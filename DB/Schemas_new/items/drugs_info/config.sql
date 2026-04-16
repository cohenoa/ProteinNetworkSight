CREATE TABLE items.drugs_info (
    drug_id SERIAL PRIMARY KEY,
    drug_name varchar(64),
    EMA boolean,
    FDA boolean,
    EN boolean,
    WHO boolean,
    Generic boolean,
    Year integer,
    Other varchar(20),
    DrugBank_ID varchar(8),
    ChEMBL varchar(8),
    ATC varchar(128),
    Indications varchar(1024)
);