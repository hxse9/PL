from flask import Flask, render_template, jsonify
import sqlite3

app = Flask(__name__)

def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/countries')
def get_countries():
    conn = get_db_connection()
    countries = conn.execute('SELECT * FROM countries').fetchall()
    conn.close()
    return jsonify([dict(ix) for ix in countries])

@app.route('/api/players')
def get_all_players():
    conn = get_db_connection()
    players = conn.execute('''
        SELECT p.*, c.name as country_name, c.flag_code 
        FROM players p 
        JOIN countries c ON p.country_id = c.id
    ''').fetchall()
    conn.close()
    return jsonify([dict(ix) for ix in players])

@app.route('/api/players/<int:country_id>')
def get_players_by_country(country_id):
    conn = get_db_connection()
    players = conn.execute('''
        SELECT p.*, c.name as country_name, c.flag_code 
        FROM players p 
        JOIN countries c ON p.country_id = c.id 
        WHERE p.country_id = ?
    ''', (country_id,)).fetchall()
    conn.close()
    return jsonify([dict(ix) for ix in players])

if __name__ == '__main__':
    app.run(debug=True, port=5000)
