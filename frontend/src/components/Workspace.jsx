import Composer from './chat/Composer';

function Message({ msg }) {
  const isUser = msg.type === 'user';
  const isSystem = msg.type === 'sys';
  const isError = msg.type === 'error';
  const tone = isError ? 'error' : isUser ? 'user' : isSystem ? 'sys' : 'agent';
  const label = isUser ? 'USER' : isError ? 'SYSTEM' : isSystem ? 'SYSTEM' : (msg.agent || 'NEURO').toUpperCase();

  return (
    <article className={`sb-message sb-message-${tone}`}>
      <div className="sb-message-meta">
        <span>{label}</span>
        {!isUser && !isSystem && !isError && <span className="sb-message-status">● ONLINE</span>}
      </div>
      <div className="sb-message-body">{isUser ? msg.text.replace(/^> USER: /, '') : msg.text.replace(/^\[[^\]]+\]: /, '')}</div>
    </article>
  );
}

export default function Workspace({ chatLog, isLoading, onSend }) {
  const isEmpty = chatLog.length === 0;

  return (
    <main className="sb-workspace">
      <header className="sb-workspace-header">
        <div>
          <span className="sb-workspace-kicker">SESSION_001</span>
          <span className="sb-workspace-title">WORKSPACE</span>
        </div>
        <span className="sb-workspace-status"><i /> READY</span>
      </header>

      <div className="sb-workspace-chat">
        <div className="sb-workspace-messages">
          {isEmpty ? (
            <div className="sb-workspace-empty">
              <p>NEW SESSION</p>
              <p className="sb-workspace-empty-sub">Чем займёмся?</p>
            </div>
          ) : (
            chatLog.map((msg, idx) => <Message key={`${msg.type}-${idx}`} msg={msg} />)
          )}
          {isLoading && (
            <article className="sb-message sb-message-sys sb-message-loading">
              <div className="sb-message-meta"><span>SYSTEM</span><span className="sb-loading-dots">● ● ●</span></div>
              <div className="sb-message-body">синхронизация нейронных связей ...</div>
            </article>
          )}
        </div>
      </div>

      <Composer onSend={onSend} isLoading={isLoading} />
    </main>
  );
}
