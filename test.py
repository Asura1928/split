import os
import urllib.request
from dotenv import load_dotenv
from google import genai

# 1. Отрубаем чтение кривых прокси из реестра Windows
urllib.request.getproxies = lambda: {}

# 2. Ставим переменные в верхнем регистре (httpx читает именно их)
os.environ["HTTP_PROXY"] = "socks5://127.0.0.1:10808"
os.environ["HTTPS_PROXY"] = "socks5://127.0.0.1:10808"

load_dotenv()

try:
    # 3. Принудительно передаем прокси напрямую в клиент Gemini
    client = genai.Client(
        api_key=os.getenv("GEMINI_API_KEY"),
        http_options={'proxy': 'socks5://127.0.0.1:10808'}
    )
    print("Успешное подключение. Список моделей:")
    for m in client.models.list():
        print(m.name)
except Exception as e:
    print(f"Ошибка: {e}")