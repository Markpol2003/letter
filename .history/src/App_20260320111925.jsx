import { useState, useEffect, useCallback } from 'react';
import Background     from './components/Background';
import Particles      from './components/Particles';
import HintText       from './components/HintText';
import Envelope       from './components/Envelope';
import StatsRow       from './components/StatsRow';
import LetterOverlay  from './components/LetterOverlay';
import CursorEffect   from './components/CursorEffect';
import BootIntro      from './components/BootIntro';
import DecryptOverlay from './components/DecryptOverlay';
import styles         from './App.module.css';

const UNLOCK_DATE = new Date('2026-03-20T00:00:00');

function LockScreen() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = UNLOCK_DATE - now;
  const days    = Math.max(0, Math.floor(diff / 86_400_000));
  const hours   = Math.max(0, Math.floor((diff % 86_400_000) / 3_600_000));
  const minutes = Math.max(0, Math.floor((diff % 3_600_000) / 60_000));
  const seconds = Math.max(0, Math.floor((diff % 60_000) / 1000));

  const pad = n => String(n).padStart(2, '0');

  return (
    <div className={styles.lockScreen}>
      <div className={styles.lockIcon}>&#128274;</div>
      <h1 className={styles.lockTitle}>ACCESS DENIED</h1>
      <p className={styles.lockSub}>This letter will unlock on</p>
      <div className={styles.lockDate}>April 13, 2026</div>
      <div className={styles.countdown}>
        <div className={styles.countUnit}>
          <span className={styles.countVal}>{pad(days)}</span>
          <span className={styles.countLabel}>DAYS</span>
        </div>
        <div className={styles.countUnit}>
          <span className={styles.countVal}>{pad(hours)}</span>
          <span className={styles.countLabel}>HRS</span>
        </div>
        <div className={styles.countUnit}>
          <span className={styles.countVal}>{pad(minutes)}</span>
          <span className={styles.countLabel}>MIN</span>
        </div>
        <div className={styles.countUnit}>
          <span className={styles.countVal}>{pad(seconds)}</span>
          <span className={styles.countLabel}>SEC</span>
        </div>
      </div>
    </div>
  );
}

/* stages: 'boot' → 'main' → 'decrypt' → 'letter' */

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [stage,        setStage]        = useState('boot');
  const [envelopeOpen, setEnvelopeOpen] = useState(false);

  useEffect(() => {
    if (new Date() >= UNLOCK_DATE) setIsUnlocked(true);
  }, []);

  /* boot done → show main screen */
  const handleBootDone = useCallback(() => setStage('main'), []);

  /* envelope clicked → start decrypt */
  const handleEnvelopeClick = useCallback(() => {
    if (stage !== 'main') return;
    setEnvelopeOpen(true);
    setStage('decrypt');
  }, [stage]);

  /* decrypt done → show letter */
  const handleDecryptDone = useCallback(() => {
    setStage('letter');
  }, []);

  /* close letter → back to main */
  const handleClose = useCallback(() => {
    setStage('main');
    setEnvelopeOpen(false);
  }, []);

  if (!isUnlocked) {
    return (
      <div className={styles.app}>
        <CursorEffect />
        <Background />
        <Particles />
        <LockScreen />
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <CursorEffect />

      {/* always mounted */}
      <Background />
      <Particles />

      {/* boot intro */}
      {stage === 'boot' && (
        <BootIntro onDone={handleBootDone} />
      )}

      {/* main scene */}
      {(stage === 'main' || stage === 'decrypt' || stage === 'letter') && (
        <>
          <HintText />
          <Envelope
            isOpen={envelopeOpen}
            onClick={handleEnvelopeClick}
          />
          <StatsRow />
        </>
      )}

      {/* decrypt overlay */}
      {stage === 'decrypt' && (
        <DecryptOverlay onDone={handleDecryptDone} />
      )}

      {/* letter */}
      {stage === 'letter' && (
        <LetterOverlay onClose={handleClose} />
      )}
    </div>
  );
}