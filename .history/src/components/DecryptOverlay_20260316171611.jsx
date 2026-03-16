import { useEffect, useState, useRef } from 'react';
import styles from './DecryptOverlay.module.css';

const GLITCH_CHARS = '!@#$%^&*<>?/|\\[]{}01♥◆▲✦░▒▓'.split('');
const MSG          = 'DECRYPTING MESSAGE...';

function randomChar() {
  return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
}

export default function DecryptOverlay({ onDone }) {
  const [displayText, setDisplayText] = useState(
    () => Array(MSG.length).fill('').map(randomChar).join('')
  );
  const [progress, setProgress] = useState(0);
  const [statusLine, setStatusLine] = useState('INITIALIZING...');
  const [exiting,    setExiting]    = useState(false);
  const solvedRef = useRef(Array(MSG.length).fill(false));

  const STATUS_STEPS = [
    { at: 15, text: 'READING ENCRYPTION KEY...' },
    { at: 35, text: 'BREAKING CIPHER LAYER...'  },
    { at: 55, text: 'VERIFYING SIGNATURE...'    },
    { at: 75, text: 'REBUILDING DATA...'         },
    { at: 90, text: 'ALMOST THERE...'            },
    { at: 99, text: 'ACCESS GRANTED ✓'           },
  ];

  useEffect(() => {
    let pct = 0;
    const solved = solvedRef.current;

    const interval = setInterval(() => {
      pct = Math.min(100, pct + (Math.random() * 2.2 + 0.4));
      setProgress(Math.round(pct));

      /* update status line */
      const step = [...STATUS_STEPS].reverse()
        .find(s => pct >= s.at);
      if (step) setStatusLine(step.text);

      /* progressively reveal correct characters */
      const revealCount = Math.floor((pct / 100) * MSG.length);
      setDisplayText(prev => {
        const arr = prev.split('');
        for (let i = 0; i < MSG.length; i++) {
          if (i < revealCount) {
            arr[i] = MSG[i];
            solved[i] = true;
          } else if (!solved[i]) {
            arr[i] = randomChar();
          }
        }
        return arr.join('');
      });

      if (pct >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setExiting(true);
          setTimeout(onDone, 600);
        }, 500);
      }
    }, 40);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onDone]);

  return (
    <div className={`${styles.wrap} ${exiting ? styles.exit : ''}`}>

      {/* scanline overlay */}
      <div className={styles.scanlines} />

      <div className={styles.box}>
        {/* glitching title */}
        <div className={styles.glitchText} data-text={displayText}>
          {displayText}
        </div>

        {/* progress */}
        <div className={styles.pctText}>{progress}%</div>

        <div className={styles.barTrack}>
          <div
            className={styles.barFill}
            style={{ width: `${progress}%` }}
          />
          {/* animated glow head */}
          <div
            className={styles.barHead}
            style={{ left: `${progress}%` }}
          />
        </div>

        {/* status */}
        <div className={styles.status}>{statusLine}</div>

        {/* hex noise */}
        <HexNoise />
      </div>
    </div>
  );
}

/* small animated hex grid for background texture */
function HexNoise() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const chars = '0123456789ABCDEF'.split('');
    let t;
    const update = () => {
      el.textContent = Array.from({ length: 120 },
        () => chars[Math.floor(Math.random() * chars.length)]
      ).join(' ');
      t = setTimeout(update, 80);
    };
    update();
    return () => clearTimeout(t);
  }, []);

  return <div ref={ref} className={styles.hexNoise} />;
}