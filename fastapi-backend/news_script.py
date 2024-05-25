import pprint
import requests

# Replace 'YOUR_API_KEY' with your actual API key
secret = '05dbdf3ffccd49bfbabc15650174438e'

# Define the endpoint
url = 'https://newsapi.org/v2/everything?'

# Specify the query and number of returns
parameters = {
    'q': 'finance',  # query phrase
    'pageSize': 20,   # maximum is 100
    'apiKey': secret  # your own API key
}

# Make the request
response = requests.get(url, params=parameters)

# Convert the response to JSON format and pretty print it
response_json = response.json()
pprint.pprint(response_json)
