import mysql.connector 

from mysql.connector import Error

import os
from dotenv import load_dotenv

load_dotenv()
def get_db_connection():
    try:
        connection = mysql.connector.connect(
            host='localhost',
            user='root',      # Default XAMPP user
            password='',      # Default XAMPP password is empty
            database='ai_query_system'
        )
        if connection.is_connected():
            return connection
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None
# Test the connection script
if __name__ == "__main__":
    conn = get_db_connection()
    if conn:
        print("Successfully connected to MySQL database!")
        conn.close()
