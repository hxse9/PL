# Premier League Global Player Tracker ⚽

A premium web dashboard for tracking English Premier League (EPL) players and their statistics across different countries. 

## Features
- **Interactive Dashboard**: View total players, goals, and assists at a glance with animated counters.
- **Dynamic Filtering**: Filter players by country using the sidebar navigation.
- **Search Functionality**: Quickly find players by name or team.
- **Responsive Design**: Premium dark-mode UI with fluid animations, blurred elements (glassmorphism), and a responsive grid layout.

## Tech Stack
- **Backend**: Python, Flask
- **Database**: SQLite3
- **Frontend**: HTML5, Vanilla CSS (Premium Dark Theme), Vanilla JavaScript

## Project Structure
- `app.py`: Main Flask application handling UI routing and REST API endpoints.
- `schema.sql`: Database schema definition for `countries` and `players` tables.
- `init_db.py`: Database initialization script.
- `database.db`: SQLite database file.
- `static/css/style.css`: Comprehensive styles including variables, layouts, and animations.
- `static/js/script.js`: Frontend logic for fetching data, searching, filtering, and updating the DOM dynamically.
- `templates/index.html`: Main dashboard view.

## API Endpoints
- `GET /api/countries`: Fetch all registered countries.
- `GET /api/players`: Fetch all players along with their country information.
- `GET /api/players/<int:country_id>`: Fetch players filtered by a specific country ID.

## Setup & Run Instructions
1. Ensure Python is installed.
2. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Initialize the database (if not already done):
   ```bash
   python init_db.py
   ```
4. Run the Flask application:
   ```bash
   python app.py
   ```
5. Open your browser and navigate to: `http://127.0.0.1:5000`
