export default function RetroWindow({ title, children, highlight = false, style }) {
  return (
    <div className={`sb-window ${highlight ? 'sb-window-highlight' : ''}`} style={style}>
      <div className="sb-window-titlebar">
        <span className="sb-window-title">{title}</span>
        <span className="sb-window-controls">X □ _</span>
      </div>
      <div className="sb-window-body">{children}</div>
    </div>
  );
}
