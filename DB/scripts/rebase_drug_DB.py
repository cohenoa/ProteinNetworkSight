import pandas as pd
from io import StringIO
from DB.scripts.updateDB_tools import open_conn, get_reverse_drugs_map, insert_rows_copy_from_factory, reset_table
from yaml import safe_load
import requests

with open("DB/Schemas_new/items/drugs/sources.yaml", "r") as f:
    cfg = safe_load(f.read())

source = cfg["main"]
response = requests.get(source['url'])
df = pd.read_csv(StringIO(response.text), sep='\t')

skim_df = df[source["wanted_columns"]]

target_product_map = get_reverse_drugs_map(skim_df, columns=source["wanted_columns"], drugBankIdFormat="tag", seperator=source["seperator"], drugBankIdExceptions=source["drugBankIdExceptions"])
unique_protein_names = set([key for key in target_product_map.keys()])

with open_conn("DB/database.example.ini") as conn:
    cur = conn.cursor()
    reset_table(cur, "items", "drugs")
    conn.commit()
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
            drugName = drugItem["name"]
            drugBankID = drugItem["drugBankID"]
            buf.write("{}\t{}\t{}\n".format(key, drugName, drugBankID))

    buf.seek(0)
    insert_rows_copy_from_factory(conn, "items.drugs")(buf)
    
    conn.commit()