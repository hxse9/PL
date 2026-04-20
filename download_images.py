import urllib.request
import urllib.parse
import json
import os

headers = {'User-Agent': 'PremierLeagueAppTracker/1.0 (contact@example.com)'}

players_search = [
    ('Son Heung-min', 'son.jpg'),
    ('Hwang Hee-chan', 'hwang.jpg'),
    ('Erling Haaland', 'haaland.jpg'),
    ('Martin Odegaard', 'odegaard.jpg'),
    ('Mohamed Salah', 'salah.jpg'),
    ('Bukayo Saka', 'saka.jpg'),
    ('Phil Foden', 'foden.jpg'),
    ('Harry Kane', 'kane.jpg'),
    ('Kevin De Bruyne', 'kdb.jpg'),
    ('Jeremy Doku', 'doku.jpg')
]

os.makedirs('static/images', exist_ok=True)
headers = {'User-Agent': 'Mozilla/5.0'}

for name, filename in players_search:
    try:
        # Search for player in TheSportsDB
        url = f"https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p={urllib.parse.quote(name)}"
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode('utf-8', errors='ignore'))
            
            if data and data.get('player') and len(data['player']) > 0:
                player_data = data['player'][0]
                # Prefers Cutout Render, then Thumb
                thumb_url = player_data.get('strCutout') or player_data.get('strThumb') or player_data.get('strRender')
                
                if thumb_url:
                    img_req = urllib.request.Request(thumb_url, headers=headers)
                    with urllib.request.urlopen(img_req, timeout=15) as img_resp:
                        with open(f"static/images/{filename}", "wb") as f:
                            f.write(img_resp.read())
                    print(f"Downloaded {filename} ({name})")
                else:
                    print(f"No image URL for {name} in API")
            else:
                print(f"Player not found in DB: {name}")
    except Exception as e:
        print(f"Failed {filename}: {e}")
