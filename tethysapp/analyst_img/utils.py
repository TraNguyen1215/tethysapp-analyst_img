import os
from dotenv import load_dotenv
import psycopg2

load_dotenv()

# Sử dụng biến môi trường
DB_HOST = os.getenv('DB_HOST')
DB_NAME = os.getenv('DB_NAME')
DB_USERNAME = os.getenv('DB_USERNAME')
DB_PASSWORD = os.getenv('DB_PASSWORD')

def create_connection():
    conn = psycopg2.connect(host=DB_HOST, dbname=DB_NAME, user=DB_USERNAME, password=DB_PASSWORD)
    return conn

def fetch_data(cur):
    # Lấy tất cả các dòng kết quả
    rows = cur.fetchall()

    # Lấy tên các cột
    colnames = [desc[0] for desc in cur.description]

    # Chuyển đổi dữ liệu thành danh sách các từ điển
    result_list = [dict(zip(colnames, row)) for row in rows]

    return result_list