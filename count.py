from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import json
import re
import os

API_KEY = os.getenv('STEAM_API_KEY')  # Ensure you have your Steam API key set in the environment variables

games = []

app = Flask("games_player_counter")
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/')
def index():
    return jsonify({"message": "Welcome to the Games Player Counter API"})

@app.route('/updateJSON', methods=['GET']) # The endpoint updates games.json with the latest game list from Steam API
def updateJSON():
    try:
        response = requests.get(f'https://api.steampowered.com/IStoreService/GetAppList/v1/?key={API_KEY}')
        data = response.json()
        print("Data fetched successfully from Steam API")

        data = data['applist']['apps']

        for game in data:
            game['name'] = re.sub(r"[^\w\s]", "", game['name'])
            
        with open("games.json", "w", encoding='utf-8') as f:
            json.dump(data, f, indent=4, ensure_ascii=False)

        return jsonify({"message": "JSON file updated successfully"}), 200
    
    except Exception as e:
        return jsonify({"error": "Failed to update JSON file"}), 500

@app.route('/getGame', methods=['POST']) # Gets the appid from games.json when the user search for a specific game and scrapes the player count from steamcharts.com
def getGames():

    data = request.get_json()
    app_id = data['game']['appid']

    if not app_id:
        return jsonify({"error": "game doesn't exists"}), 400

    request_url = f'https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?key={API_KEY}&appid={app_id}'
    
    res = requests.get(request_url)

    if res.status_code != 200: 
        return jsonify({"error": "Failed to fetch game details"}), 500

    full_url = f'https://steamcdn-a.akamaihd.net/steam/apps/{app_id}/header.jpg'

    players = res.json().get("response", {}).get("player_count", 0)

    return jsonify({'appid': app_id, 'players': players, 'image': full_url, 'name': data['game']['name']})

@app.route('/refreshPlayersCount', methods=['POST']) # Refresh the player count for the displayed game in the front-end without refreshing the page.
def refreshPlayersCount():
    
    data = request.get_json()
    gameId = data.get('gameID')

    if not gameId:
        return jsonify({"error": "Game ID is required"}), 400

    res = requests.get(f'https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?key={API_KEY}&appid={gameId}')

    

    players = res.json().get("response",{}).get("player_count", 0)
    
    return jsonify({"players": players})

@app.route('/getStats', methods=['POST']) # Gets the screenshots and price of a game from the Steam Store API when clicking on the card in the front-end.
def getStats():
    data = request.get_json()
    
    app_id = data['game']['appid']

    if not app_id:
        return jsonify({"error": "Game doesn't exist"}), 400

    request_url = f'https://store.steampowered.com/api/appdetails?appids={app_id}&cc=BR'

    res = requests.get(request_url)

    if res.status_code != 200:
        return jsonify({"error": "Failed to fetch game details"}), 500

    game_data = res.json().get(str(app_id), {}).get('data', {})

    if not game_data:
        return jsonify({"error": "Game data not found"}), 404
    
    return jsonify({
        'screenshots': game_data.get('screenshots', []),
        'price': game_data.get('price_overview', {}).get('final_formatted')
    })

        
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)  # Set use_reloader=False to avoid running the scraper twice
