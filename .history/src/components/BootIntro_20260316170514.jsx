import { useEffect, useState } from 'react';
import styles from './BootIntro.module.css';

const BOOT_LINES = [
  { text: 'BIOS v2.0.78 initialized...',          delay: 0    },
  { text: 'Loading kernel modules...',             delay: 300  },
  { text: 'Mounting file system... OK',            delay: 600  },
  { text: 'Checking memory integrity... PASSED',   delay: 900  },
  { text: 'Network interface... ONLINE',           delay: 1200 },
  { text: 'Encryption layer... ACTIVE',            delay: 1500 },
  { text: 'Scanning for packages...',              delay: 1800 },
  { text: '> Found: SECRET_MSG.enc [1 file]',      delay: 2100 },
  { text: 'Decryption key... VERIFIED ✓',          delay: 2500 },
  { text: 'Launching LETTER.EXE...',               delay: 2900 },
];

export default function BootIntro({ onDone }) {
  const [lines,   setLines]   = useState([]);
  const [barW,    setBarW]    = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    /* reveal lines one by one */
    const timers = BOOT_LINES.map((l, i) =>
      setTimeout(() => {
        setLines(prev => [...prev, l.text]);
        setBarW(Math.round(((i + 1) / BOOT_LINES.length) * 100));
      }, l.delay)
    );

    /* exit after last line */
    const exitTimer = setTimeout(() => {
      setExiting(true);
      setTimeout(onDone, 700);
    }, 3600);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(exitTimer);
    };
  }, [onDone]);

  return (
    <div className={`${styles.wrap} ${exiting ? styles.exit : ''}`}>
      <div className={styles.screen}>

        {/* top bar */}
        <div className={styles.topBar}>
          <span className={styles.topBarDot} />
          <span className={styles.topBarDot} />
          <span className={styles.topBarDot} />
          <span className={styles.topBarTitle}>SYSTEM_BOOT.exe</span>
        </div>

        {/* lines */}
        <div className={styles.lines}>
          {lines.map((l, i) => (
            <div key={i} className={styles.line}>
              <span className={styles.prompt}>{'>'}</span>
              <span className={styles.lineText}>{l}</span>
            </div>
          ))}

          {/* blinking cursor on last line */}
          {lines.length < BOOT_LINES.length && (
            <div className={styles.line}>
              <span className={styles.prompt}>{'>'}</span>
              <span className={styles.caret}>█</span>
            </div>
          )}
        </div>

        {/* progress bar */}
        <div className={styles.barWrap}>
          <div className={styles.barLabel}>
            LOADING {barW}%
          </div>
          <div className={styles.barTrack}>
            <div
              className={styles.barFill}
              style={{ width: `${barW}%` }}
            />
          </div>
        </div>

      </div>
    </div>
  );
}