const TOKEN_KEY = 'splitbrain_token';
const API_KEYS_KEY = 'splitbrain_api_keys';
const SYSTEM_PROMPT_KEY = 'splitbrain_system_prompt';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// Ключи хранятся в браузере как есть — это НЕ шифрование, просто
// локальное хранение. Пока нет бэкенда под BYOK, это единственный
// честный вариант ("хранится локально", не "зашифровано").
export function getApiKeys() {
  const raw = localStorage.getItem(API_KEYS_KEY);
  return raw ? JSON.parse(raw) : {};
}

export function setApiKeys(keys) {
  localStorage.setItem(API_KEYS_KEY, JSON.stringify(keys));
}

export function getSystemPrompt() {
  return localStorage.getItem(SYSTEM_PROMPT_KEY) || '';
}

export function setSystemPrompt(text) {
  localStorage.setItem(SYSTEM_PROMPT_KEY, text);
}
