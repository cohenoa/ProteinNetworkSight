from src.common.configuration import close_db_conn, open_db_conn


class Organism:
    def __init__(self, name, id) -> None:
        self.label = name
        self.value = id
    
    def __str__(self) -> str:
        toPrint = "name:" + self.label + "\n"
        toPrint += "id:" + str(self.value) + "\n"
        return toPrint


def get_organism(conn) -> str:
    sql = """ 
           SELECT species_id, official_name
           FROM items.species
        """

    cur = conn.cursor()
    cur.execute(sql)

    rows = cur.fetchall()
    return rows


def get_organism_list():
    organism_list = []
    conn = open_db_conn()
    if conn is None:
        return

    rows = get_organism(conn)
    for row in rows:
        obj = Organism(row[1], row[0])
        organism_list.append(obj)   

    close_db_conn(conn)
    return organism_list
