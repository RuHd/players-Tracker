from requests import request
import json

# Get game information about online players from steam chart and send to the fron-end

data = request("GET",'https://api.steampowered.com/ISteamApps/GetAppList/v2/').json()

data = data['applist']['apps']

with open("games.json", "w", encoding='utf-8') as f:
    json.dump(data, f, indent=4, ensure_ascii=False)

print(data)