import { useEffect, useState } from 'react';
import styles from './BootIntro.module.css';

const LINES = [
  'SYSTEM ONLINE...',
  'LOADING SECRET FILE...',
  'ACCESS GRANTED ✓',
];

export default function BootIntro({ onDone }) {
  const [lineIndex, setLineIndex] = useState(0);
  const [typed,     setTyped]     = useState('');
  const [exiting,   setExiting]   = useState(false);

  useEffect(() => {
    let charIndex = 0;
    let currentLine = 0;
    let typingTimer;
    let lineTimer;

    const typeNextLine = () => {
      const line = LINES[currentLine];
      charIndex = 0;
      setTyped('');

      typingTimer = setInterval(() => {
        charIndex++;
        setTyped(line.slice(0, charIndex));

        if (charIndex >= line.length) {
          clearInterval(typingTimer);

          /* pause then move to next line or exit */
          lineTimer = setTimeout(() => {
            currentLine++;
            setLineIndex(currentLine);

            if (currentLine >= LINES.length) {
              /* all lines done — exit */
              setExiting(true);
              setTimeout(onDone, 800);
            } else {
              typeNextLine();
            }
          }, 600);
        }
      }, 55);
    };

    typeNextLine();

    return () => {
      clearInterval(typingTimer);
      clearTimeout(lineTimer);
    };
  }, [onDone]);

  return (
    <div className={`${styles.wrap} ${exiting ? styles.exit : ''}`}>
      <div className={styles.box}>

        {/* solved lines */}
        {LINES.slice(0, lineIndex).map((l, i) => (
          <div key={i} className={styles.solvedLine}>
            <span className={styles.prompt}>{'>'}</span>
            <span>{l}</span>
          </div>
        ))}

        {/* currently typing line */}
        {lineIndex < LINES.length && (
          <div className={styles.activeLine}>
            <span className={styles.prompt}>{'>'}</span>
            <span>{typed}</span>
            <span className={styles.caret}>█</span>
          </div>
        )}

      </div>
    </div>
  );
}