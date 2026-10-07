import { useState } from 'react';
import RetroWindow from './RetroWindow';
import { getApiKeys, setApiKeys } from '../services/storage';

const SECTIONS = [
  { id: 'api-keys', label: 'API KEYS', ready: true },
  { id: 'general', label: 'GENERAL', ready: false },
  { id: 'account', label: 'ACCOUNT', ready: false },
  { id: 'privacy', label: 'PRIVACY', ready: false },
  { id: 'appearance', label: 'APPEARANCE', ready: false },
];

const SLOTS = ['SLOT_01', 'SLOT_02', 'SLOT_03'];

function ApiKeysPanel() {
  const [keys, setKeys] = useState(getApiKeys());

  const updateSlot = (slot, field, value) => {
    const next = { ...keys, [slot]: { ...keys[slot], [field]: value } };
    setKeys(next);
  };

  const save = () => setApiKeys(keys);

  return (
    <div>
      <p className="sb-panel-note">
        Ключи хранятся локально в браузере. Это не шифрование — не используй чужой компьютер для ввода реальных ключей.
      </p>
      {SLOTS.map((slot) => (
        <div key={slot} className="sb-apikey-row">
          <span className="sb-apikey-slot">{slot}</span>
          <input
            className="sb-chat-input sb-apikey-input"
            placeholder="провайдер (напр. openai)"
            value={keys[slot]?.provider || ''}
            onChange={(e) => updateSlot(slot, 'provider', e.target.value)}
          />
          <input
            className="sb-chat-input sb-apikey-input"
            placeholder="api key"
            type="password"
            value={keys[slot]?.key || ''}
            onChange={(e) => updateSlot(slot, 'key', e.target.value)}
          />
        </div>
      ))}
      <button className="sb-cta" onClick={save}>СОХРАНИТЬ КОНФИГУРАЦИЮ ▸</button>
    </div>
  );
}

export default function Settings({ onBack }) {
  const [active, setActive] = useState('api-keys');

  return (
    <div className="sb-panel-screen">
      <RetroWindow title="SYS_CONFIG // НАСТРОЙКИ" highlight style={{ width: '100%', maxWidth: 720 }}>
        <button className="sb-panel-back" onClick={onBack}>{'‹ назад'}</button>

        <div className="sb-settings-layout">
          <nav className="sb-settings-nav">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                className={`sb-settings-nav-item ${active === s.id ? 'sb-settings-nav-active' : ''}`}
                onClick={() => s.ready && setActive(s.id)}
                disabled={!s.ready}
              >
                {s.label}{!s.ready && ' (скоро)'}
              </button>
            ))}
          </nav>
          <div className="sb-settings-content">
            {active === 'api-keys' && <ApiKeysPanel />}
          </div>
        </div>
      </RetroWindow>
    </div>
  );
}
