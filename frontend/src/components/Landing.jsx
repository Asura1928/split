import RetroWindow from './RetroWindow';
import DemoChat from './DemoChat';
import DitherBackground from './DitherBackground';
import heroImg from '../assets/splitbrain-hero.png';
import '../landing.css';

const BOOT_LINES = [
  '> запуск ядра SPLITBRAIN v1.0.1-a ...',
  '> хранение ключей: локально ...',
  '> облачный хозяин: не обнаружен ...',
  '> нейро-слоты: готовы к работе ...',
  '> _ система ожидает задачу...',
];

const FEATURES = [
  ['ПАРАЛЛЕЛЬНО', 'Отправляй одну задачу нескольким моделям и сравнивай ответы в одном рабочем пространстве.'],
  ['КОНТРОЛЬ', 'Ключи моделей не навязываются сервисом. Ты сам решаешь, какие провайдеры и слоты использовать.'],
  ['РАЗГОВОР', 'Продолжай одну сессию, возвращайся к прошлым задачам и держи контекст там, где он действительно нужен.'],
];

export default function Landing({ onEnter }) {
  return (
    <div className="sb-landing sb-landing-page">
      <DitherBackground />

      <header className="sb-hero sb-reveal">
        <div className="sb-hero-img-wrap">
          <img src={heroImg} alt="SPLITBRAIN" className="sb-hero-img" width="1672" height="941" />
        </div>
        <p className="sb-eyebrow">СБОРКА 1.0.1-A · СЕАНС #00A9-DC</p>
        <div className="sb-hero-text">
          <p className="sb-tagline">ДВЕ МОДЕЛИ. ОДИН ДИАЛОГ. БЕЗ ОБЛАЧНОГО ХОЗЯИНА.</p>
          <p className="sb-subtext">
            Клиент для параллельной работы с несколькими LLM. Ты ставишь задачу. Модели предлагают решения,
            сравнивают подходы и помогают прийти к сильному выводу.
          </p>
        </div>
        <button className="sb-cta sb-hero-cta" onClick={onEnter}>ВОЙТИ В ЧАТ ▸</button>
      </header>

      <main>
        <section className="sb-grid sb-reveal sb-reveal-delay-1">
          <RetroWindow title="TERM/BOOT.LOG" style={{ gridArea: 'boot' }}>
            <pre className="sb-boot-log">{BOOT_LINES.join('\n')}</pre>
          </RetroWindow>

          <RetroWindow title="CHAT//ДЕМО" highlight style={{ gridArea: 'chat' }}>
            <DemoChat />
          </RetroWindow>

          <RetroWindow title="SPEC_SHEET.TXT" style={{ gridArea: 'spec' }}>
            <dl className="sb-spec">
              <dt>НЕЙРО_01</dt>
              <dd>слот конфигурируется пользователем</dd>
              <dt>НЕЙРО_02</dt>
              <dd>второй слот для параллельной работы</dd>
              <dt>КЛЮЧИ</dt>
              <dd>хранятся локально в браузере</dd>
              <dt>СТЕК</dt>
              <dd>react · fastapi · postgresql</dd>
              <dt>СТАТУС</dt>
              <dd className="sb-status-live">прототип / в разработке</dd>
            </dl>
          </RetroWindow>
        </section>

        <section className="sb-info-section sb-reveal sb-reveal-delay-2">
          <div className="sb-section-heading">
            <p className="sb-eyebrow">SYSTEM//OVERVIEW</p>
            <h2>НЕ ПРОСТО ЧАТ.</h2>
            <p>SplitBrain собирает несколько моделей в одном интерфейсе, но не заставляет тебя следовать чужой схеме работы.</p>
          </div>
          <div className="sb-feature-grid">
            {FEATURES.map(([title, text]) => (
              <article key={title} className="sb-feature-card">
                <span className="sb-feature-index">// 0{FEATURES.findIndex(([item]) => item === title) + 1}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="sb-flow-section sb-reveal sb-reveal-delay-3">
          <RetroWindow title="HOW_IT_WORKS.TXT" highlight>
            <div className="sb-flow-grid">
              <div><span>01</span><strong>ПОДКЛЮЧИ</strong><p>Настрой модельные слоты и ключи.</p></div>
              <div><span>02</span><strong>НАПИШИ</strong><p>Создай задачу обычным языком.</p></div>
              <div><span>03</span><strong>СРАВНИ</strong><p>Получай ответы параллельно.</p></div>
              <div><span>04</span><strong>РЕШИ</strong><p>Выбери направление и продолжай диалог.</p></div>
            </div>
          </RetroWindow>
        </section>

        <section className="sb-final-cta sb-reveal sb-reveal-delay-3">
          <p className="sb-eyebrow">ACCESS//READY</p>
          <h2>ГОТОВ К НОВОМУ СЕАНСУ?</h2>
          <button className="sb-cta" onClick={onEnter}>ИНИЦИАЛИЗИРОВАТЬ ▸</button>
        </section>
      </main>

      <footer className="sb-footer">
        <span>0xDC-00A9-7F-2026</span>
        <span>сделано в темноте</span>
      </footer>
    </div>
  );
}
