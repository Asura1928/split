import { useRef, useState } from 'react';

export default function Composer({ onSend, isLoading }) {
  const [value, setValue] = useState('');
  const textareaRef = useRef(null);

  const resize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = '0px';
    el.style.height = `${Math.min(el.scrollHeight, 150)}px`;
  };

  const submit = () => {
    const text = value.trim();
    if (!text || isLoading) return;
    onSend(text);
    setValue('');
    requestAnimationFrame(resize);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <div className="sb-composer-wrap">
      <div className={`sb-composer ${value ? 'sb-composer-active' : ''}`}>
        <button className="sb-composer-plus" type="button" aria-label="Дополнительные действия">+</button>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(event) => { setValue(event.target.value); resize(); }}
          onKeyDown={handleKeyDown}
          placeholder="Напишите сообщение..."
          rows={1}
          disabled={isLoading}
        />
        <button
          className="sb-composer-send"
          type="button"
          onClick={submit}
          disabled={isLoading || !value.trim()}
          aria-label="Отправить"
        >
          {isLoading ? '…' : '▸'}
        </button>
      </div>
      <div className="sb-composer-hint">
        <span>ENTER — ОТПРАВИТЬ · SHIFT+ENTER — НОВАЯ СТРОКА</span>
        <span>SPLITBRAIN</span>
      </div>
    </div>
  );
}
