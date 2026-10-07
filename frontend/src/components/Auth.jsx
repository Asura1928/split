import { useState } from 'react';
import DitherBackground from './DitherBackground';
import registrationImg from '../assets/registration.png';
import loginImg from '../assets/login.png';

const API_BASE = 'http://127.0.0.1:8000';

// mode: 'register' | 'login' | 'forgot' | 'reset'
export default function Auth({ onAuthenticated, resetToken }) {
  const [mode, setMode] = useState(resetToken ? 'reset' : 'register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [yandexNote, setYandexNote] = useState(false);

  const switchMode = (nextMode) => {
    if (nextMode === mode) return;
    setMode(nextMode);
    setError('');
    setInfo('');
  };

  const loginRequest = async (loginEmail, loginPassword) => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: loginEmail, password: loginPassword }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Не удалось войти');
    return data.access_token;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Заполни оба поля');
      return;
    }
    setIsLoading(true);
    try {
      if (mode === 'register') {
        const res = await fetch(`${API_BASE}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.detail || 'Не удалось зарегистрироваться');
        }
        const token = await loginRequest(email, password);
        onAuthenticated(token);
      } else {
        const token = await loginRequest(email, password);
        onAuthenticated(token);
      }
    } catch (err) {
      setError(err.message || 'Сервер недоступен');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    if (!email.trim()) {
      setError('Укажи email');
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Не удалось отправить запрос');
      setInfo(data.message);
    } catch (err) {
      setError(err.message || 'Сервер недоступен');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    if (!newPassword.trim() || !newPasswordConfirm.trim()) {
      setError('Заполни оба поля');
      return;
    }
    if (newPassword !== newPasswordConfirm) {
      setError('Пароли не совпадают');
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: resetToken, new_password: newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Не удалось сбросить пароль');
      setInfo('Пароль изменён. Теперь можно войти.');
      setTimeout(() => switchMode('login'), 1500);
    } catch (err) {
      setError(err.message || 'Сервер недоступен');
    } finally {
      setIsLoading(false);
    }
  };

  const showTitleImg = mode === 'register' || mode === 'login';

  return (
    <div className="sb-landing sb-auth-page">
      <DitherBackground />
      <div className="sb-auth-screen">
        <div className="sb-auth-stack">
          {showTitleImg && (
            <div className="sb-auth-title-wrap">
              <img
                key={mode}
                src={mode === 'register' ? registrationImg : loginImg}
                alt={mode === 'register' ? 'Регистрация' : 'Вход'}
                className="sb-auth-mode-img"
              />
            </div>
          )}

          <div className="sb-auth-card">
            <div className="sb-auth-card-body">
              {(mode === 'register' || mode === 'login') && (
                <>
                  <div className="sb-auth-tabs">
                    <button
                      type="button"
                      className={`sb-auth-tab ${mode === 'register' ? 'sb-auth-tab-active' : ''}`}
                      onClick={() => switchMode('register')}
                    >
                      РЕГИСТРАЦИЯ
                    </button>
                    <button
                      type="button"
                      className={`sb-auth-tab ${mode === 'login' ? 'sb-auth-tab-active' : ''}`}
                      onClick={() => switchMode('login')}
                    >
                      ВХОД
                    </button>
                  </div>

                  <form
                    key={mode + '-form'}
                    className="sb-auth-form sb-auth-form-swap"
                    onSubmit={handleSubmit}
                  >
                    <label className="sb-auth-field">
                      <span>EMAIL</span>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email"
                        className="sb-chat-input"
                        autoComplete="email"
                      />
                    </label>
                    <label className="sb-auth-field">
                      <span>ПАРОЛЬ</span>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="пароль"
                        className="sb-chat-input"
                        autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                      />
                    </label>

                    {error && <p className="sb-auth-error">{'> ' + error}</p>}

                    <button type="submit" className="sb-cta sb-auth-primary" disabled={isLoading}>
                      {isLoading
                        ? 'ПОДКЛЮЧЕНИЕ...'
                        : mode === 'register'
                          ? 'СОЗДАТЬ АККАУНТ ▸'
                          : 'ВОЙТИ ▸'}
                    </button>

                    {mode === 'login' && (
                      <button
                        type="button"
                        className="sb-auth-link-back"
                        onClick={() => switchMode('forgot')}
                      >
                        забыли пароль?
                      </button>
                    )}
                  </form>

                  <div className="sb-auth-divider"><span>или</span></div>

                  <button type="button" className="sb-auth-yandex" onClick={() => setYandexNote(true)}>
                    ВОЙТИ ЧЕРЕЗ YANDEX ID
                  </button>
                  {yandexNote && <p className="sb-auth-note">{'> модуль ещё не подключён'}</p>}
                </>
              )}

              {mode === 'forgot' && (
                <>
                  <p className="sb-eyebrow">ВОССТАНОВЛЕНИЕ ДОСТУПА</p>
                  <form className="sb-auth-form sb-auth-form-swap" onSubmit={handleForgotSubmit}>
                    <p className="sb-auth-note">{'> введи email, пришлём ссылку для сброса пароля'}</p>
                    <label className="sb-auth-field">
                      <span>EMAIL</span>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email"
                        className="sb-chat-input"
                        autoComplete="email"
                      />
                    </label>

                    {error && <p className="sb-auth-error">{'> ' + error}</p>}
                    {info && <p className="sb-auth-note">{'> ' + info}</p>}

                    <button type="submit" className="sb-cta sb-auth-primary" disabled={isLoading}>
                      {isLoading ? 'ОТПРАВКА...' : 'ПОЛУЧИТЬ ССЫЛКУ ▸'}
                    </button>

                    <button
                      type="button"
                      className="sb-auth-link-back"
                      onClick={() => switchMode('login')}
                    >
                      {'< вернуться ко входу'}
                    </button>
                  </form>
                </>
              )}

              {mode === 'reset' && (
                <>
                  <p className="sb-eyebrow">НОВЫЙ ПАРОЛЬ</p>
                  <form className="sb-auth-form sb-auth-form-swap" onSubmit={handleResetSubmit}>
                    <label className="sb-auth-field">
                      <span>НОВЫЙ ПАРОЛЬ</span>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="новый пароль"
                        className="sb-chat-input"
                        autoComplete="new-password"
                      />
                    </label>
                    <label className="sb-auth-field">
                      <span>ПОВТОРИ ПАРОЛЬ</span>
                      <input
                        type="password"
                        value={newPasswordConfirm}
                        onChange={(e) => setNewPasswordConfirm(e.target.value)}
                        placeholder="повтори пароль"
                        className="sb-chat-input"
                        autoComplete="new-password"
                      />
                    </label>

                    {error && <p className="sb-auth-error">{'> ' + error}</p>}
                    {info && <p className="sb-auth-note">{'> ' + info}</p>}

                    <button type="submit" className="sb-cta sb-auth-primary" disabled={isLoading}>
                      {isLoading ? 'СОХРАНЕНИЕ...' : 'СОХРАНИТЬ ПАРОЛЬ ▸'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
