from groq import Groq

from dotenv import load_dotenv
load_dotenv()

import os

client = Groq(
    api_key= os.getenv("GROQ_API_KEY"),
)

def FinGeniusAssistant(query: str) -> str:
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": """
                        You are a Financial Guru that helps people with their financial questions. 
                        If someone gives an amount and asks for investment give them a split up of how they should invest. 
                        If the Query is not clear, please ask for more information.
                        """
            },
            {
                "role": "user",
                "content": query,
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

print(FinGeniusAssistant(query="I currently have 50000$ in spare money where should I invest it?"))