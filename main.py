import os

# Очищаем переменные среды от локальных прокси (SOCKS4) только для этого процесса,
# чтобы все API-клиенты могли отправлять запросы напрямую.
os.environ.pop("http_proxy", None)
os.environ.pop("https_proxy", None)
os.environ.pop("all_proxy", None)
os.environ.pop("HTTP_PROXY", None)
os.environ.pop("HTTPS_PROXY", None)
os.environ.pop("ALL_PROXY", None)

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
from google import genai
from app.routers.auth import router as auth_router
from groq import Groq

# Загружаем ключи из файла .env
load_dotenv()

# Настройка клиента DeepSeek
deepseek_client = OpenAI(
    api_key=os.getenv("DEEPSEEK_API_KEY"),
    base_url="https://api.groq.com/openai/v1"
)

# Настройка клиента Gemini
gemini_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

app = FastAPI()

app.include_router(auth_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class MessageRequest(BaseModel):
    text: str
    model_a: str = "deepseek" 
    model_b: str = "gemini"

def call_llm(model_name: str, prompt: str) -> str:
    try:
        if model_name == "deepseek":
            response = groq_client.chat.completions.create(
                model="openai/gpt-oss-120b",
                messages=[{
                    "role": "user",
                    "content": f"Ты ИИ-агент. Твоя задача — предложить решение или аргументированно критиковать оппонента. Будь краток и технически точен. Если оппонент полностью прав и добавить нечего, напиши ровно одно слово: [CONSENSUS].\n\nЗапрос: {prompt}"
                }]
            )
            return response.choices[0].message.content

        elif model_name == "gemini":
            response = gemini_client.models.generate_content(
                model='gemini-3.8-flash',
                contents=f"Системная инструкция: Ты ИИ-агент. Предложи решение или критикуй оппонента. Будь краток. Если оппонент прав, напиши ровно одно слово: [CONSENSUS].\n\nЗапрос: {prompt}"
            )
            return response.text

        else:
            return f"Модель {model_name} не найдена."

    except Exception as e:
        return f"[ОШИБКА API {model_name}]: {str(e)}"

@app.post("/chat")
async def process_chat(request: MessageRequest):
    dialogue = []
    current_prompt = f"Пользователь спрашивает: {request.text}. Предложи решение."
    
    max_rounds = 3 
    
    for i in range(max_rounds):
        # Ход Модели А
        reply_a = call_llm(request.model_a, current_prompt)
        dialogue.append({"agent": request.model_a, "text": reply_a})
        
        if "[CONSENSUS]" in reply_a:
            return {"status": "consensus_reached", "dialogue": dialogue}
            
        # Ход Модели B
        prompt_for_b = f"Твой оппонент предложил следующее: {reply_a}. Если согласен, напиши [CONSENSUS]. Если нет - аргументируй."
        reply_b = call_llm(request.model_b, prompt_for_b)
        dialogue.append({"agent": request.model_b, "text": reply_b})
        
        if "[CONSENSUS]" in reply_b:
            return {"status": "consensus_reached", "dialogue": dialogue}
            
        # Возврат на следующий круг
        current_prompt = f"Оппонент ответил: {reply_b}. Если согласен, напиши [CONSENSUS]. Если нет - отвечай."

    return {
        "status": "bo3_limit_reached",
        "message": "Агенты не пришли к согласию за 3 раунда.",
        "dialogue": dialogue
    }