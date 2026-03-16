import { useState } from 'react';
import Background    from './components/Background';
import Particles     from './components/Particles';
import HintText      from './components/HintText';
import Envelope      from './components/Envelope';
import StatsRow      from './components/StatsRow';
import LetterOverlay from './components/LetterOverlay';
import styles        from './App.module.css';

export default function App() {
  const [isOpen,     setIsOpen]     = useState(false);
  const [showLetter, setShowLetter] = useState(false);

  const openLetter = () => {
    setIsOpen(true);
    setTimeout(() => setShowLetter(true), 620);
  };

  const closeLetter = () => {
    setShowLetter(false);
    setTimeout(() => setIsOpen(false), 300);
  };

  return (
    <div className={styles.app}>
      <Background />
      <Particles />
      <HintText />
      <Envelope isOpen={isOpen} onClick={openLetter} />
      <StatsRow />
      {showLetter && <LetterOverlay onClose={closeLetter} />}
    </div>
  );
}