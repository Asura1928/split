import { useEffect, useState } from 'react';
import { useTypewriter } from '../hooks/useTypewriter';

// Нейтральный технический тон вместо ролевого "оператив/GH0ST_X".
const SCRIPT = [
  { agent: 'user', label: 'USER', text: 'нужен план миграции с монолита на сервисы. без даунтайма.' },
  { agent: 'a', label: 'НЕЙРО_01', text: 'strangler fig. выносим модуль за модулем, старый код держим живым до полного покрытия.' },
  { agent: 'b', label: 'НЕЙРО_02', text: 'долго. режь по границам транзакций и разворачивай параллельно — риск ниже, чем кажется.' },
  { agent: 'a', label: 'НЕЙРО_01', text: 'параллельный запуск без синхронизации данных — это гонка состояний на проде.' },
  { agent: 'b', label: 'НЕЙРО_02', text: 'принято. добавляем event log между старым и новым. [CONSENSUS]' },
  { agent: 'sys', label: 'SYSTEM', text: 'консенсус достигнут за 2 раунда. решение записано в тред.' },
];

const AGENT_CLASS = {
  user: 'sb-line-user',
  a: 'sb-line-a',
  b: 'sb-line-b',
  sys: 'sb-line-sys',
};

export default function DemoChat() {
  const [lineIndex, setLineIndex] = useState(0);
  const [history, setHistory] = useState([]);
  const current = SCRIPT[lineIndex];
  const { displayed, done } = useTypewriter(current.text, 20, 350);

  useEffect(() => {
    if (!done) return;
    const holdMs = current.agent === 'sys' ? 2200 : 900;
    const t = setTimeout(() => {
      setHistory((h) => [...h, current]);
      setLineIndex((i) => (i + 1) % SCRIPT.length);
      if (lineIndex === SCRIPT.length - 1) {
        setTimeout(() => setHistory([]), 50);
      }
    }, holdMs);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  return (
    <div className="sb-demo-chat">
      {history.map((line, idx) => (
        <p key={idx} className={`sb-demo-line ${AGENT_CLASS[line.agent]}`}>
          <span className="sb-demo-label">{line.label}</span> {line.text}
        </p>
      ))}
      <p className={`sb-demo-line ${AGENT_CLASS[current.agent]}`}>
        <span className="sb-demo-label">{current.label}</span> {displayed}
        <span className="sb-cursor">_</span>
      </p>
    </div>
  );
}
