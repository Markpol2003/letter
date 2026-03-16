import { useEffect, useState } from 'react';
import styles from './DecryptOverlay.module.css';

const GLITCH_CHARS = '!@#$%^&*<>?/|01♥◆▲✦░▒▓'.split('');
const MSG          = 'DECRYPTING...';

function randomChar() {
  return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
}

export default function DecryptOverlay({ onDone }) {
  const [display,  setDisplay]  = useState('');
  const [progress, setProgress] = useState(0);
  const [exiting,  setExiting]  = useState(false);

  useEffect(() => {
    let pct     = 0;
    let solved  = 0;

    const interval = setInterval(() => {
      pct = Math.min(100, pct + (Math.random() * 2.5 + 0.5));
      setProgress(Math.round(pct));

      /* reveal characters left to right as % grows */
      solved = Math.floor((pct / 100) * MSG.length);

      setDisplay(
        MSG.split('').map((ch, i) =>
          i < solved ? ch : randomChar()
        ).join('')
      );

      if (pct >= 100) {
        clearInterval(interval);
        /* show full message briefly then exit */
        setDisplay(MSG);
        setTimeout(() => {
          setExiting(true);
          setTimeout(onDone, 600);
        }, 400);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [onDone]);

  return (
    <div className={`${styles.wrap} ${exiting ? styles.exit : ''}`}>

      {/* glitching text */}
      <div className={styles.text}>{display}</div>

      {/* progress bar */}
      <div className={styles.barTrack}>
        <div
          className={styles.barFill}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* percentage */}
      <div className={styles.pct}>{progress}%</div>

    </div>
  );
}