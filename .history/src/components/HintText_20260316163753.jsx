import { useEffect, useState } from 'react';
import styles from './HintText.module.css';

// fixed messages — no window.innerWidth check
// so it never re-renders differently on resize
const MSG = 'click envelope to decrypt message';

export default function HintText() {
  const [text, setText]       = useState('');
  const [done, setDone]       = useState(false);

  useEffect(() => {
    // reset
    setText('');
    setDone(false);
    let i = 0;

    const t = setInterval(() => {
      setText(MSG.slice(0, i + 1));
      i++;
      if (i >= MSG.length) {
        clearInterval(t);
        setDone(true);
      }
    }, 65);

    return () => clearInterval(t);
  }, []);

  return (
    <p className={`${styles.hint} ${done ? styles.done : ''}`}>
      {text}
    </p>
  );
}