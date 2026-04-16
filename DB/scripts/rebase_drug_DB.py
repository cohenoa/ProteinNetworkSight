import pandas as pd
from io import StringIO
from DB.scripts.updateDB_tools import open_conn, get_reverse_drugs_map, insert_rows_copy_from_factory, get_tag_value, reset_tables
from yaml import safe_load
import requests

with open_conn("DB/database.example.ini") as conn:
    reset_tables(conn, tables={"items.drugs_info": None, "items.protein_drugs": None})

with open("DB/Schemas_new/items/drugs/sources.yaml", "r") as f:
    cfg = safe_load(f.read())

source = cfg["main"]
source["wanted_columns"] = [source["must_columns"][1]] + source["wanted_columns"]
response = requests.get(source['url'])
df = pd.read_csv(StringIO(response.text), sep='\t')

a = "Cervical Cancer Metastatic; Metastatic Colorectal Cancer (MCRC); Metastatic Non-Squamous Non-Small Cell Lung Cancer; Metastatic Renal Cell Carcinoma; Persistent Cervical Cancer; Recurrent Cervical Cancer; Recurrent Glioblastoma; Stage III epithelial ovarian cancer following initial surgical resection; Stage IV epithelial ovarian cancer following initial surgical resection; Fallopian tube cancer following initial surgical resection; Locally advanced nonsquamous non-small cell lung cancer; Primary peritoneal cancer following initial surgical resection; Recurrent Non-Squamous Non-Small Cell Lung Cancer; Recurrent Platinum-Sensitive Epithelial Ovarian Cancer; Recurrent Platinum-resistant Epithelial Ovarian Cancer; Recurrent platinum drug resistant Fallopian tube cancer; Recurrent platinum drug resistant primary peritoneal cancer; Recurrent platinum sensitive primary peritoneal cancer; Recurrent platinum-sensitive fallopian tube cancer; Unresectable Non-Squamous Non-Small-Cell Lung Cancer"
print(len(a))

df = df.dropna(subset=[source["must_columns"][0]])
print(df.shape[0])
df["Year"] = df["Year"].fillna(-1).astype(int)
df = df.replace({"Y": True, "N": False})
df["EMA"] = df["EMA"].fillna(False).astype(bool)
df["FDA"] = df["FDA"].fillna(False).astype(bool)
df["EN"] = df["EN"].fillna(False).astype(bool)
df["WHO"] = df["WHO"].fillna(False).astype(bool)
df["Generic"] = df["Generic"].fillna(False).astype(bool)
df["Indications"] = df["Indications"].apply(lambda x: "\"{}\"".format(str(x).replace("\t", " ").replace("\n", " ")))

drug_name_id_map = {}
with open_conn("DB/database.example.ini") as conn:
    cur = conn.cursor()
    rows = df[source["wanted_columns"]].values.tolist()
    buf = StringIO()
    i = 1
    for row in rows:
        buf.write("{}".format(i))
        for val in row:
            if str(val).startswith("<a"):
                method = "tag"
            else:
                method = "plane"
            val = get_tag_value(val, method, additional_splits=["CHEMBL"])
            buf.write("\t{}".format(val))
        buf.write("\n")
        drug_name_id_map[row[0]] = i
        i += 1

    buf.seek(0)
    insert_rows_copy_from_factory(conn, "items.drugs_info")(buf)
    conn.commit()


skim_df = df[source["must_columns"]]

target_product_map = get_reverse_drugs_map(skim_df, columns=source["must_columns"], seperator=source["seperator"], id_map=drug_name_id_map)
unique_protein_names = set([key for key in target_product_map.keys()])

print(unique_protein_names)

with open_conn("DB/database.example.ini") as conn:
    cur = conn.cursor()
    # init names table for faster search
    cur.execute("CREATE TEMP TABLE temp_names(name varchar(50));")
    cur.executemany("INSERT INTO temp_names (name) VALUES (%s);", [(name,) for name in unique_protein_names])
    conn.commit()
    
    sql = """ 
        SELECT protein_id, preferred_name
        FROM items.proteins
        JOIN temp_names n ON n.name = preferred_name;
    """ 
    cur.execute(sql)

    rows = cur.fetchall()

    drug_map = {}
    for row in rows:
        drug_map[row[0]] = target_product_map[row[1]]

    buf = StringIO()
    for key, value in drug_map.items():
        for drugItem in value:
            drugId = drugItem["id"]
            buf.write("{}\t{}\n".format(key, drugId))

    buf.seek(0)
    insert_rows_copy_from_factory(conn, "items.protein_drugs")(buf)
    
    conn.commit()