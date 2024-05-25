import os
from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
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

@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI!"}

@app.post("/assistant-bot")
def assistance_bot(query: str = Form(...)):
    try:
        response = FinGeniusAssistant(query)
        return {"assistant response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyser-bot")
async def analyser_bot(
    query: str = Form(...),
    userId: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None)
):
    try:
        if file:
            if not file.filename.endswith('.pdf'):
                raise HTTPException(status_code=400, detail="File must be a PDF")

            file_path = os.path.join(UPLOAD_FOLDER, file.filename)
            with open(file_path, "wb") as f:
                f.write(file.file.read())

            context = PDFToContext(file_path)
        else:
            if not userId:
                raise HTTPException(status_code=400, detail="userId is required if no file is uploaded")

            context = JsonToPdfToContext(userId)

        response = FinGeniusAnalyser(query, context=context)
        return {"analyser response": response}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
