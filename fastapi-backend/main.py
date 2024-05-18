from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from RAG.FinGeniusBot import FinGeniusAssistant, FinGeniusAnalyser, JsonToPdfToContext

app = FastAPI()

class FinGeniusAssistantRequest(BaseModel):
    query: str

class FinGeniusAnalyserRequest(BaseModel):
    query: str
    userId: str

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI!"}

@app.post("/assistant-bot")
def assistance_bot(request: FinGeniusAssistantRequest):
    response = FinGeniusAssistant(request.query)
    return {"assistant response": response}

@app.post("/analyser-bot")
def analyser_bot(request: FinGeniusAnalyserRequest):
    context = JsonToPdfToContext(request.userId)
    response = FinGeniusAnalyser(request.query, context)
    return {"analyser response": response}
