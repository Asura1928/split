import { useState } from 'react';
import RetroWindow from './RetroWindow';
import { getSystemPrompt, setSystemPrompt } from '../services/storage';

export default function Profile({ user, onBack }) {
  const [prompt, setPrompt] = useState(getSystemPrompt());
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSystemPrompt(prompt);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="sb-panel-screen">
      <RetroWindow title="PROFILE // IDENTITY" highlight style={{ width: '100%', maxWidth: 560 }}>
        <button className="sb-panel-back" onClick={onBack}>{'‹ назад'}</button>

        <div className="sb-profile-row">
          <div className="sb-profile-avatar">?</div>
          <div>
            <p className="sb-profile-email">{user?.email}</p>
            <p className="sb-profile-note">username/аватар — пока нет бэкенда, недоступно</p>
          </div>
        </div>

        <p className="sb-panel-label">ИНСТРУКЦИИ ДЛЯ НЕЙРО-СЛОТОВ (system prompt)</p>
        <textarea
          className="sb-composer-input sb-profile-prompt"
          rows={5}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="> общая инструкция для обоих агентов..."
        />
        <button className="sb-cta" onClick={handleSave}>
          {saved ? 'СОХРАНЕНО' : 'СОХРАНИТЬ ▸'}
        </button>
      </RetroWindow>
    </div>
  );
}
