import sqlite3

def init_db():
    conn = sqlite3.connect('lights.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS device (id INTEGER PRIMARY KEY, device_id TEXT)''')
    conn.commit()
    conn.close()

def update_light_status():
    conn = sqlite3.connect('lights.db')
    c = conn.cursor() 
    devices = [("T:5:1:1:",), ("T:5:1:2:",), ("T:5:1:3:",), ("T:5:1:4:",), ("T:5:1:5:",)] 
    c.executemany('INSERT INTO device (device_id) VALUES (?)', devices)
    conn.commit()
    conn.close()
