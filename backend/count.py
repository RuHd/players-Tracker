from flask import Flask, jsonify, request
from flask_cors import CORS
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.action_chains import ActionChains
from time import sleep
from bs4 import BeautifulSoup
import requests
import json
import re

games = []

# js = json.load(open("games.json", "r", encoding='utf-8'))
app = Flask("games_player_counter")
CORS(app, resources={r"/*": {"origins": "*"}})

# def setup_chrome():
#     if not os.path.exists("/opt/render/project/.render/chrome_installed"):
#         os.system("apt update")
#         os.system("apt install -y wget gnupg unzip")
#         os.system("wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb")
#         os.system("apt install -y ./google-chrome-stable_current_amd64.deb")
#         os.system("touch /opt/render/project/.render/chrome_installed")


@app.route('/')
def index():
    return jsonify({"message": "Welcome to the Games Player Counter API"})

@app.route('/updateJSON', methods=['GET'])
def updateJSON():
    
    response = requests.get('https://api.steampowered.com/ISteamApps/GetAppList/v2/')
    data = response.json()

    data = data['applist']['apps']

    for game in data:
        game['name'] = re.sub(r"[^\w\s]", "", game['name'])
        
    with open("games.json", "w", encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

    return jsonify({"message": "JSON file updated successfully"}), 200

    
# @app.route('/searchGame', methods=['POST'])
# def searchGame():
    gameName = request.get_json().get('name', '').strip()
    if not gameName:
        return jsonify({"error": "Game title is required"}), 400
    try:
        chrome_options = Options()
        chrome_options.add_argument("--disable-dev-shm-usage")  # Overcome limited resource problems
        chrome_options.add_argument("--headless")  # Run in headless mode for performance

        chrome_service = Service(executable_path=r"C:\Users\ruana\Desktop\chromedriver-win64\chromedriver.exe")  # Path to your chromedriver
        driver = webdriver.Chrome(options=chrome_options, service=chrome_service)

        actions = ActionChains(driver)

        driver.get("https://steamcharts.com/")

        sleep(1)

        search_bar = driver.find_element(By.XPATH, '/html/body/div[3]/div[1]/div/form/input')
        search_bar.send_keys(gameName)
        actions.send_keys("\n").perform()

        game_image = driver.find_element(By.XPATH, '/html/body/div[3]/div[2]/table/tbody/tr/td[1]/a/img').get_attribute('src')
       
        game_link = driver.find_element(By.XPATH, '/html/body/div[3]/div[2]/table/tbody/tr/td[1]/a/img')
        game_link.click()

        game_id = driver.current_url.split('/')[-1]
        players_online = driver.find_element(By.XPATH, '/html/body/div[3]/div[3]/div[1]/span').get_attribute('outerHTML')
        games_name = driver.find_element(By.XPATH, '/html/body/div[3]/h1/a').get_attribute('outerHTML')
        
        soupPlayers = BeautifulSoup(players_online, 'html.parser')
        soupName = BeautifulSoup(games_name, 'html.parser')

        game_data = {
            "id": game_id,
            "name": soupName.get_text(strip=True),
            "players": soupPlayers.get_text(strip=True),
            "image": game_image
        }

        return jsonify(game_data)
    finally:
        driver.quit()

@app.route('/getGame', methods=['POST'])
def getGames():

    data = request.get_json()
    app_id = data['game']['appid']

    if not app_id:
        return jsonify({"error": "game doesn't exists"}), 400

    request_url = f'https://steamcharts.com/app/{app_id}'
    
    res = requests.get(request_url)


    if res.status_code != 200: 
        print(f"***********res {res.status_code}")
        return jsonify({"error": "Failed to fetch game details"}), 500

    bs = BeautifulSoup(res.text, 'html.parser')

    full_url = f'https://steamcdn-a.akamaihd.net/steam/apps/{app_id}/header.jpg'

    players = bs.find('div', class_='app-stat').find('span', class_='num').get_text(strip=True)

    return jsonify({'appid': app_id, 'players': players, 'image': full_url, 'name': data['game']['name']})

@app.route('/refreshPlayersCount', methods=['POST'])
def refreshPlayersCount():
    
    data = request.get_json()
    gameId = data.get('gameID')

    if not gameId:
        return jsonify({"error": "Game ID is required"}), 400

    res = requests.get(f'http://steamcharts.com/app/{gameId}')

    soup = BeautifulSoup(res.text, 'html.parser')
    current = soup.find('div', class_='app-stat').find('span', class_='num').get_text(strip=True)
    
    return jsonify({"players": current})

@app.route('/getStats', methods=['POST'])
def getStats():
    data = request.get_json()
    
    app_id = data['game']['appid']

    if not app_id:
        return jsonify({"error": "Game doesn't exist"}), 400

    request_url = f'https://store.steampowered.com/api/appdetails?appids={app_id}&cc=us'

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
