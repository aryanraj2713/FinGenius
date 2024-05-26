import requests

url = "https://yahoo-finance127.p.rapidapi.com/news/tsla"

headers = {
	"X-RapidAPI-Key": "5a67ca7e36mshfe02fcb157d7904p1f8447jsn59277a0a41b1",
	"X-RapidAPI-Host": "yahoo-finance127.p.rapidapi.com"
}

response = requests.get(url, headers=headers)

print(response.json())