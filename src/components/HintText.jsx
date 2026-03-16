import { useEffect, useState } from 'react';
import styles from './HintText.module.css';

export default function HintText() {
  const [text, setText] = useState('');

  useEffect(() => {
    const msg = window.innerWidth < 400
      ? 'tap envelope to open'
      : 'click envelope to decrypt message';
    let i = 0;
    setText('');
    const t = setInterval(() => {
      setText(prev => prev + msg[i]);
      i++;
      if (i >= msg.length) clearInterval(t);
    }, 65);
    return () => clearInterval(t);
  }, []);

  return <p className={styles.hint}>{text}</p>;
}