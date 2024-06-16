from common.configuration import close_db_conn, open_db_conn

def truncate_Table():
    conn = open_db_conn()
    if conn is None:
        return
    cur = conn.cursor()
    
    sql = """ 
                TRUNCATE users.users_table
          """

    cur.execute(sql)
    cur.close()
    close_db_conn(conn)

if __name__ == "__main__":
    truncate_Table()