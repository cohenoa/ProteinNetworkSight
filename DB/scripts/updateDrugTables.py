import pandas as pd
from io import StringIO
from DB.scripts.updateDB_tools import open_conn, get_reverse_drugs_map, insert_rows_copy_from_factory
from yaml import safe_load
import requests


with open("DB/Schemas_new/items/drugs/sources.yaml", "r") as f:
    cfg = safe_load(f.read())
    print(cfg)

for source in cfg["extra"]:
    print(f"{source}: {source}")

    response = requests.get(source['url'])
    df = pd.read_csv(StringIO(response.text), sep='\t')

    skim_df = df[source["wanted_columns"]]

    target_product_map = get_reverse_drugs_map(skim_df, seperator=source["seperator"])
    unique_protein_names = set([key for key in target_product_map.keys()])

    with open_conn("DB/database.example.ini") as conn:
        cur = conn.cursor()
        # init names table for faster search
        cur.execute("CREATE TEMP TABLE temp_names(name varchar(50));")
        cur.executemany("INSERT INTO temp_names (name) VALUES (%s);", [(name,) for name in unique_protein_names])
        
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
                drugName = drugItem["name"]
                drugBankID = drugItem["drugBankID"]
                buf.write("{}\t{}\t{}\n".format(key, drugName, drugBankID))

        
        conn.commit()
        conn.close()



# a = safe_load(open("DB/Shemas_new/items/drugs/sources.yaml").read())
# print("a: ", a)




# src_path = "backend/src/common/cancerdrugsdb.txt"
# dest_path = "DB/Schemas_new/items/drugs/cancerdrugsdb.sql"

# lines = []
# med_df = pd.read_csv(src_path, delimiter="\t")

# med_df = med_df[["Product", "DrugBank ID", "Targets"]]

# max_len_id = 0
# target_product_map = defaultdict(list)
# for index, row in med_df.iterrows():
#     if pd.isna(row["Targets"]):
#         continue
#     infoLink = None
#     if row["DrugBank ID"].find("Not found in DrugBank") == -1:
#         infoLink = row["DrugBank ID"].split("\"")[1].split("\"")[0].split('/')[-1]
#         max_len_id = max(max_len_id, len(infoLink))
#     target_list = row["Targets"].split("; ")
#     for target in target_list:
#         target_product_map[target].append({
#             "name": row["Product"],
#             "drugBankID": infoLink
#         })

# print(max_len_id)
# print(len(target_product_map.keys()))

# conn = open_conn("DB/database.prod.ini")

# cur = conn.cursor()

# cur.execute("CREATE TEMP TABLE temp_names(name varchar(50));")
# cur.executemany("INSERT INTO temp_names (name) VALUES (%s);", [(name,) for name in target_product_map.keys()])

# sql = """ 
#     SELECT protein_id, preferred_name
#     FROM items.proteins
#     JOIN temp_names n ON n.name = preferred_name;
# """ 

# cur.execute(sql)

# rows = cur.fetchall()
# drug_map = defaultdict(list)
# for row in rows:
#     drug_map[row[0]] = target_product_map[row[1]]

# print(len(drug_map.keys()))

# # assert len(drug_map.keys()) == len(target_product_map.keys())


# buf = StringIO()
# buf.write("COPY items.drugs FROM STDIN WITH (FORMAT text, DELIMITER E'\\t');\n")
# for key, value in drug_map.items():
#     for drugItem in value:
#         drugName = drugItem["name"]
#         drugBankID = drugItem["drugBankID"]
#         buf.write("{}\t{}\t{}\n".format(key, drugName, drugBankID))
# # buf.write("\\.")

# with open(dest_path, 'w') as f:
#     f.write(buf.getvalue())

# sql = "COPY items.drugs FROM STDIN WITH (FORMAT text, DELIMITER E'\\t');"
# with open(dest_path, "r", encoding="utf8") as f:
#     next(f)  # ⬅️ Skip the COPY line
#     cur.copy_expert(sql, f)

# conn.commit()
# conn.close()
