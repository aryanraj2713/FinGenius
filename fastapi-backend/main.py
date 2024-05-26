import os
from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import requests
# from typing import List
import pymongo
import json

from dotenv import load_dotenv
load_dotenv()

from RAG.FinGeniusBot import FinGeniusAssistant, FinGeniusAnalyser, JsonToPdfToContext, PDFToContext

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

BANKSTATMENT_FOLDER = 'bank'
os.makedirs(BANKSTATMENT_FOLDER, exist_ok=True)


@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI!"}

@app.post("/assistant-bot")
def assistance_bot(query: str = Form(...)):
    try:
        response = FinGeniusAssistant(query)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/save-bank-statement")
async def save_bank_statement(userId: str = Form(...)):

    uri = os.getenv("MONGODB_URI")
    client = pymongo.MongoClient(uri)
    db = client['test']
    collection = db['expenses']
    user_data = collection.find_one({'userId': userId})
    if user_data:
        expenses = user_data.get('expenses', [])
        file_path = os.path.join('bank', f'{userId}.json')
        with open(file_path, 'w') as file:
            json.dump(expenses, file, indent=4)
        
        return f"Data for user {userId} has been written to {file_path}"
    else:
        return f"No data found for user {userId}"

@app.post("/save-pdf")
async def save_pdf(file: UploadFile = File(...)):
    if file:
        if not file.filename.endswith('.pdf'):
            raise HTTPException(status_code=400, detail="File must be a PDF")

        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        with open(file_path, "wb") as f:
            f.write(file.file.read())
        
        return f"File {file.filename} has been saved to {file_path}"
    else:
        return "No file uploaded"
        

@app.post("/analyser-bot")
async def analyser_bot(
    query: str = Form(...),
    userId: Optional[str] = Form(None)
):
    if not userId:
        file_path = os.path.join(UPLOAD_FOLDER)
        context = PDFToContext(file_path)
    if userId:
        context = JsonToPdfToContext(userId)
    response = FinGeniusAnalyser(query, context=context)
    return {"response": response}



# newsapi = NewsApiClient(api_key="NEWS_API_KEY")

# @app.get("/financial-news", response_model=List[dict])
# async def get_financial_news():
#     """

#     Returns:
#         List[dict]: A list of dictionaries representing the top financial news headlines.
#             Each dictionary contains information such as the title, description, author,
#             publication date, and URL of the news article.
#     Raises:
#         HTTPException: If there was an error fetching the news or if the NewsAPI response
#             status is not 'ok'.
#     """

#     try:
#         # Fetch top headlines related to financial news
#         top_headlines = newsapi.get_top_headlines(
#             category='business',
#             language='en',
#             country='us'
#         )
        
#         if top_headlines['status'] != 'ok':
#             raise HTTPException(status_code=500, detail="Error fetching news")
        
#         return top_headlines['articles']
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))



class Source(BaseModel):
    id: Optional[str]
    name: str

class Article(BaseModel):
    source: Source
    author: Optional[str]
    title: str
    description: Optional[str]
    url: str
    publishedAt: str
    content: Optional[str]

class NewsResponse(BaseModel):
    status: str
    totalResults: int
    articles: List[Article]

@app.get("/finance_news", response_model=NewsResponse)
async def get_big_data_news():
    url = 'https://newsapi.org/v2/everything'
    NEWS_API_KEY = '05dbdf3ffccd49bfbabc15650174438e'
    parameters = {
        'q': 'finance',
        'pageSize': 20,
        'apiKey': NEWS_API_KEY
    }
    try:
        response = requests.get(url, params=parameters)
        response.raise_for_status()
    except requests.RequestException as e:
        raise HTTPException(status_code=response.status_code, detail=str(e))
    return response.json()


@app.get("/news/{ticker}")
def get_stock_news(ticker: str):
    url = f"https://yahoo-finance127.p.rapidapi.com/news/{ticker}"
    headers = {
        "X-RapidAPI-Key": "5a67ca7e36mshfe02fcb157d7904p1f8447jsn59277a0a41b1",
        "X-RapidAPI-Host": "yahoo-finance127.p.rapidapi.com"
    }

    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        return response.json()
    else:
        raise HTTPException(status_code=response.status_code, detail="Error fetching data from Yahoo Finance API")


@app.get("/deals")
def get_amazon_deals():
    url = "https://real-time-amazon-data.p.rapidapi.com/deals-v2"
    querystring = {"country": "US"}
    
    headers = {
        "X-RapidAPI-Key": "5a67ca7e36mshfe02fcb157d7904p1f8447jsn59277a0a41b1",
        "X-RapidAPI-Host": "real-time-amazon-data.p.rapidapi.com"
    }

    response = requests.get(url, headers=headers, params=querystring)
    
    if response.status_code == 200:
        return response.json()
    else:
        raise HTTPException(status_code=response.status_code, detail="Error fetching data from Amazon API")