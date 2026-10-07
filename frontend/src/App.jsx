import { useState, useEffect } from 'react';
import './index.css';
import Landing from './components/Landing';
import Auth from './components/Auth';
import Sidebar from './components/layout/Sidebar';
import Workspace from './components/Workspace';
import Profile from './components/Profile';
import Settings from './components/Settings';
import DitherBackground from './components/DitherBackground';
import { getToken, setToken, clearToken } from './services/storage';
import { fetchMe } from './services/auth';

function App() {
  const [screen, setScreen] = useState('landing');
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [resetToken, setResetToken] = useState(null);

  const [chatLog, setChatLog] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Если пришли по ссылке /reset-password?token=... из письма (сейчас —
  // из консоли бэкенда), сразу открываем экран сброса пароля, минуя
  // лендинг и обычный флоу входа.
  useEffect(() => {
    const path = window.location.pathname;
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (path === '/reset-password' && token) {
      setResetToken(token);
      setScreen('auth');
      setCheckingSession(false);
      return;
    }

    // При загрузке страницы — если есть токен, пробуем восстановить сессию
    // через /auth/me, а не сразу выкидывать на логин.
    const savedToken = getToken();
    if (!savedToken) {
      setCheckingSession(false);
      return;
    }
    fetchMe(savedToken)
      .then((me) => {
        setUser(me);
        setScreen('workspace');
      })
      .catch(() => {
        clearToken();
      })
      .finally(() => setCheckingSession(false));
  }, []);

  const handleAuthenticated = async (token) => {
    setToken(token);
    try {
      const me = await fetchMe(token);
      setUser(me);
    } catch {
      // токен только что выдан бэком, но на всякий случай не роняем экран
    }
    setResetToken(null);
    setScreen('workspace');
  };

  const handleLogout = () => {
    clearToken();
    setUser(null);
    setChatLog([]);
    setScreen('landing');
  };

  const sendMessage = async (text) => {
    const newLog = [...chatLog, { type: 'user', text: `> USER: ${text}` }];
    setChatLog(newLog);
    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, model_a: 'deepseek', model_b: 'gemini' }),
      });
      const data = await response.json();

      const formattedDialogue = data.dialogue.map((item) => ({
        type: 'agent',
        agent: item.agent,
        text: `[${item.agent.toUpperCase()}]: ${item.text}`,
      }));

      setChatLog([...newLog, ...formattedDialogue, { type: 'sys', text: `> СТАТУС: ${data.status}` }]);
    } catch {
      setChatLog([...newLog, { type: 'error', text: '> ОШИБКА: Сервер недоступен.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (checkingSession) return null;

  if (screen === 'landing') return <Landing onEnter={() => setScreen('auth')} />;
  if (screen === 'auth') return <Auth onAuthenticated={handleAuthenticated} resetToken={resetToken} />;

  if (screen === 'profile') {
    return (
      <div className="sb-landing">
        <DitherBackground />
        <Profile user={user} onBack={() => setScreen('workspace')} />
      </div>
    );
  }

  if (screen === 'settings') {
    return (
      <div className="sb-landing">
        <DitherBackground />
        <Settings onBack={() => setScreen('workspace')} />
      </div>
    );
  }

  return (
    <div className="sb-landing sb-workspace-flat-bg">
      <div className="sb-app-shell">
        <Sidebar
          user={user}
          onNewSession={() => setChatLog([])}
          onNavigate={setScreen}
          onLogout={handleLogout}
        />
        <Workspace chatLog={chatLog} isLoading={isLoading} onSend={sendMessage} />
      </div>
    </div>
  );
}

export default App;
