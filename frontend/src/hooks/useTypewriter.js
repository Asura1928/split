import { useEffect, useState } from 'react';

// Печатает строку посимвольно. Вызывает onDone, когда строка допечатана.
export function useTypewriter(fullText, speedMs = 22, startDelayMs = 0) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;
    let intervalId;

    const startTimeout = setTimeout(() => {
      intervalId = setInterval(() => {
        i += 1;
        setDisplayed(fullText.slice(0, i));
        if (i >= fullText.length) {
          clearInterval(intervalId);
          setDone(true);
        }
      }, speedMs);
    }, startDelayMs);

    return () => {
      clearTimeout(startTimeout);
      clearInterval(intervalId);
    };
  }, [fullText, speedMs, startDelayMs]);

  return { displayed, done };
}
