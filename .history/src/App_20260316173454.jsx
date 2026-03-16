import { useState, useCallback } from 'react';
import Background     from './components/Background';
import Particles      from './components/Particles';
import HintText       from './components/HintText';
import Envelope       from './components/Envelope';
import StatsRow       from './components/StatsRow';
import LetterOverlay  from './components/LetterOverlay';
import CursorEffect   from './components/CursorEffect';
import BootIntro      from './components/BootIntro';
import DecryptOverlay from './components/DecryptOverlay';
import Confetti       from './components/Confetti';
import styles         from './App.module.css';

/* stages: 'boot' → 'main' → 'decrypt' → 'letter' */

export default function App() {
  const [stage,        setStage]        = useState('boot');
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [confetti,     setConfetti]     = useState(false);

  /* boot done → show main screen */
  const handleBootDone = useCallback(() => setStage('main'), []);

  /* envelope clicked → start decrypt */
  const handleEnvelopeClick = useCallback(() => {
    if (stage !== 'main') return;
    setEnvelopeOpen(true);
    setStage('decrypt');
  }, [stage]);

  /* decrypt done → show letter + confetti */
  const handleDecryptDone = useCallback(() => {
    setStage('letter');
    setConfetti(true);
    setTimeout(() => setConfetti(false), 4000);
  }, []);

  /* close letter → back to main */
  const handleClose = useCallback(() => {
    setStage('main');
    setEnvelopeOpen(false);
  }, []);

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