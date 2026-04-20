import sqlite3

def init_db():
    connection = sqlite3.connect('database.db')
    
    with open('schema.sql') as f:
        connection.executescript(f.read())
        
    cur = connection.cursor()
    
    # Insert Countries
    cur.execute("INSERT INTO countries (name, flag_code) VALUES (?, ?)", ('South Korea', 'kr'))
    kr_id = cur.lastrowid
    cur.execute("INSERT INTO countries (name, flag_code) VALUES (?, ?)", ('Norway', 'no'))
    no_id = cur.lastrowid
    cur.execute("INSERT INTO countries (name, flag_code) VALUES (?, ?)", ('Egypt', 'eg'))
    eg_id = cur.lastrowid
    cur.execute("INSERT INTO countries (name, flag_code) VALUES (?, ?)", ('England', 'gb-eng'))
    en_id = cur.lastrowid
    cur.execute("INSERT INTO countries (name, flag_code) VALUES (?, ?)", ('Belgium', 'be'))
    be_id = cur.lastrowid

    # Insert Players (Example Data based on recent EPL history)
    players = [
        # South Korea
        ('Son Heung-min', kr_id, 'Tottenham Hotspur', 'Forward', 120, 62, 300, '/static/images/son.jpg'),
        ('Hwang Hee-chan', kr_id, 'Wolverhampton Wanderers', 'Forward', 22, 7, 85, '/static/images/hwang.jpg'),
        
        # Norway
        ('Erling Haaland', no_id, 'Manchester City', 'Forward', 60, 13, 62, '/static/images/haaland.jpg'),
        ('Martin Ødegaard', no_id, 'Arsenal', 'Midfielder', 31, 23, 120, '/static/images/odegaard.jpg'),
        
        # Egypt
        ('Mohamed Salah', eg_id, 'Liverpool', 'Forward', 157, 69, 258, '/static/images/salah.jpg'),
        
        # England
        ('Bukayo Saka', en_id, 'Arsenal', 'Forward', 46, 35, 169, '/static/images/saka.jpg'),
        ('Phil Foden', en_id, 'Manchester City', 'Midfielder', 50, 25, 160, '/static/images/foden.jpg'),
        ('Harry Kane', en_id, 'Tottenham Hotspur (Former)', 'Forward', 213, 46, 320, '/static/images/kane.jpg'),

        # Belgium
        ('Kevin De Bruyne', be_id, 'Manchester City', 'Midfielder', 68, 110, 255, '/static/images/kdb.jpg'),
        ('Jeremy Doku', be_id, 'Manchester City', 'Forward', 3, 5, 25, '/static/images/doku.jpg')
    ]
    
    cur.executemany(
        "INSERT INTO players (name, country_id, team, position, goals, assists, appearances, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        players
    )
    
    connection.commit()
    connection.close()
    
    print("Database initialized successfully with seeded player data!")

if __name__ == '__main__':
    init_db()
