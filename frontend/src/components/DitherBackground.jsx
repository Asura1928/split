import { useEffect, useState } from 'react';
import Dither from './Dither';

// Ярче, чем раньше (0.35) — на пиках волны дизеринг должен доходить
// до настоящего белого, а не только до серого. Раньше был слишком
// плоский/тусклый шум без "зерна".
const WAVE_COLOR_GREY = [0.55, 0.55, 0.52];

export default function DitherBackground() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // CSS-медиазапрос тут не поможет — это WebGL-рендер-луп,
    // а не CSS-анимация, поэтому проверяем вручную через matchMedia
    // и передаём результат как проп в сам компонент.
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <div className="sb-dither-bg" aria-hidden="true">
      <Dither
        waveColor={WAVE_COLOR_GREY}
        colorNum={4}
        waveAmplitude={0.06}
        waveFrequency={5}
        waveSpeed={0.55}
        disableAnimation={false}
        enableMouseInteraction={false}
        mouseRadius={0.3}
      />
    </div>
  );
}
