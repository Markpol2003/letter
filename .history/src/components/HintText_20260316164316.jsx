import { useEffect, useState } from 'react';
import styles from './HintText.module.css';

const MSG = 'click envelope to decrypt message';

export default function HintText() {
  const [text, setText] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setText('');
    setDone(false);
    let i = 0;

    const t = setInterval(() => {
      // increment first, then slice — no off-by-one
      i++;
      setText(MSG.slice(0, i));

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