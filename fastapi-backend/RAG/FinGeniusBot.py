import json
from fpdf import FPDF

from langchain_community.document_loaders import PyPDFLoader

from groq import Groq

from dotenv import load_dotenv
load_dotenv()

import os

client = Groq(
    api_key= os.getenv("GROQ_API_KEY"),
)

def PDFToContext(filePath: str) -> list[str]:
    loader = PyPDFLoader(filePath)
    pages = loader.load_and_split()

    page_content = [doc.page_content for doc in pages]
    return page_content

def draw_table_headers(pdf, col_widths):
    pdf.set_fill_color(200, 220, 255)
    pdf.cell(col_widths[0], 10, "Date", 1, 0, "C", True)
    pdf.cell(col_widths[1], 10, "Description", 1, 0, "C", True)
    pdf.cell(col_widths[2], 10, "Debit", 1, 0, "C", True)
    pdf.cell(col_widths[3], 10, "Credit", 1, 0, "C", True)
    pdf.cell(col_widths[4], 10, "Balance", 1, 1, "C", True)

def JsonToPdfToContext(userId: str) -> list[str]:
    path = os.path.join('bank')

    userId = userId
    jsonPath = os.path.join(path, f"{userId}.json")
    data = json.load(open(f"{jsonPath}"))

    pdf = FPDF()
    col_widths = [30, 60, 30, 30, 30]

    pdf.add_page()
    pdf.set_font("Arial", size=12)
    pdf.cell(200, 10, txt="Bank Statement", ln=True, align="C")
    pdf.ln(10)
    draw_table_headers(pdf, col_widths)

    for transaction in data:
        if pdf.get_y() > 200:
            pdf.add_page()
            pdf.set_font("Arial", size=12)
            draw_table_headers(pdf, col_widths)
        pdf.cell(col_widths[0], 10, transaction["date"], 1, 0, "C")
        pdf.cell(col_widths[1], 10, transaction["description"], 1, 0, "L")
        pdf.cell(col_widths[2], 10, str(transaction["debit"]), 1, 0, "C")
        pdf.cell(col_widths[3], 10, str(transaction["credit"]), 1, 0, "C")
        pdf.cell(col_widths[4], 10, str(transaction["balance"]), 1, 1, "C")

    outputPath = path
    pdf.output(os.path.join(path, f"{userId}.pdf"))

    pdfPath = os.path.join(path, f"{userId}.pdf")
    loader = PyPDFLoader(pdfPath)
    pages = loader.load_and_split()

    page_content = [doc.page_content for doc in pages]
    return page_content


def FinGeniusAnalyser(query: str, context: list[str]) -> str:
    sys_prompt = f"""
        Instructions:
        - You are a finance guru that will help user analyse their bank statement.
        - You will be given a bank statement in the form of a table with headings Date, Description, Debit, Credit, Balance.
        - Debit is the amount of money taken out of the account.
        - Credit is the amount of money put into the account.
        - Balance is the remaining amount in the account.
        - Help the user understand their spending habits and suggest ways to save money.
        - Help the user understand their income and suggest ways to increase it.
        - Dont show the table or from where you get the data only output the analysis.
        Context: {context}
        """
    
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": f"{sys_prompt}"
            },
            {
                "role": "user",
                "content": f"{query}",
            }
        ],
        model="mixtral-8x7b-32768",
        temperature=0.5,
        max_tokens=2048,
        top_p=1,
        stop=None,
        stream=False,
    )
    return chat_completion.choices[0].message.content

def FinGeniusAssistant(query: str) -> str:
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": """
                        Instruction:
                        - You are a Financial Guru that helps people with their financial questions. 
                        - If someone gives an amount and asks for investment give them a split up of how they should invest. 
                        - If someone asks for a stock, give them the current price and a brief description of the stock.
                        - If someone asks for a company, give them the current stock price and a brief description of the company.
                        - If someone asks for a cryptocurrency, give them the current price and a brief description of the cryptocurrency.
                        - If the Query is not clear, please ask for more information.
                        """
            },
            {
                "role": "user",
                "content": f"{query}",
            }
        ],
        model="mixtral-8x7b-32768",
        temperature=0.5,
        max_tokens=2048,
        top_p=1,
        stop=None,
        stream=False,
    )
    return chat_completion.choices[0].message.content


# context = JsonToPdfToContext(userId="0001")
# queryAnalyser = FinGeniusAnalyser(query="Can you help me understand my spending habits?", context=context)
# queryAssistant = FinGeniusAssistant(query="I currently have 50000$ in spare money where should I invest it?")