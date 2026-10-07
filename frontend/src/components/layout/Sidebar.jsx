import { useCallback, useEffect, useRef, useState } from 'react';

const MOCK_SESSIONS = {
  'СЕГОДНЯ': ['Миграция базы данных PostgreSQL', 'Рефакторинг компонента'],
  'ВЧЕРА': ['Архитектура микросервисов', 'Оценка API'],
};

const MIN_WIDTH = 220;
const DEFAULT_WIDTH = 280;
const MAX_WIDTH = 420;
const STORAGE_KEY = 'splitbrain_sidebar_width';

export default function Sidebar({ user, onNewSession, onNavigate, onLogout }) {
  const [width, setWidth] = useState(() => {
    const saved = Number(localStorage.getItem(STORAGE_KEY));
    return Number.isFinite(saved) ? Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, saved)) : DEFAULT_WIDTH;
  });
  const dragState = useRef(null);

  const handlePointerMove = useCallback((event) => {
    if (!dragState.current) return;
    const next = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, event.clientX));
    setWidth(next);
  }, []);

  const stopResize = useCallback(() => {
    if (!dragState.current) return;
    dragState.current = null;
    document.body.classList.remove('sb-is-resizing');
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', stopResize);
    setWidth((current) => {
      localStorage.setItem(STORAGE_KEY, String(current));
      return current;
    });
  }, [handlePointerMove]);

  const startResize = (event) => {
    event.preventDefault();
    dragState.current = true;
    document.body.classList.add('sb-is-resizing');
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', stopResize, { once: true });
  };

  useEffect(() => () => {
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', stopResize);
  }, [handlePointerMove, stopResize]);

  return (
    <aside className="sb-sidebar" style={{ width }}>
      <div className="sb-sidebar-top">
        <div className="sb-sidebar-wordmark" title="SplitBrain">SPLITBRAIN</div>
        <button className="sb-sidebar-new-flat" onClick={onNewSession}>
          [+] НОВАЯ СЕССИЯ
        </button>
      </div>

      <div className="sb-sidebar-history">
        {Object.entries(MOCK_SESSIONS).map(([group, items]) => (
          <section key={group} className="sb-sidebar-group-block">
            <p className="sb-sidebar-group">{group}</p>
            {items.map((title) => (
              <button key={title} className="sb-sidebar-session" title={title}>
                <span aria-hidden="true">&gt;</span>
                <span className="sb-sidebar-session-title">{title}</span>
              </button>
            ))}
          </section>
        ))}
      </div>

      <div className="sb-sidebar-user">
        <div className="sb-sidebar-user-main">
          <div className="sb-sidebar-avatar" aria-hidden="true">?</div>
          <div className="sb-sidebar-user-copy">
            <p className="sb-sidebar-email">{user?.email || '...'}</p>
            <span>ONLINE</span>
          </div>
        </div>
        <div className="sb-sidebar-actions">
          <button onClick={() => onNavigate('profile')}>PROFILE</button>
          <button onClick={() => onNavigate('settings')}>SETTINGS</button>
          <button onClick={onLogout} className="sb-sidebar-logout">LOGOUT</button>
        </div>
      </div>

      <div
        className="sb-sidebar-resizer"
        role="separator"
        aria-label="Изменить ширину боковой панели"
        onPointerDown={startResize}
      />
    </aside>
  );
}
