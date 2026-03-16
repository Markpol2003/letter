import { useEffect, useRef, useCallback } from 'react';
import TextPortrait from './TextPortrait';
import styles       from './LetterOverlay.module.css';
import portraitImg from '../assets/portrait.png';

/* ── sub-components ── */
function TopBar() {
  return (
    <div className={styles.topBar}>
      <div className={styles.msgId}>MSG_ID: <span>#0xFF2D78</span></div>
      <div className={styles.badge}>❤ VERIFIED LOVE</div>
    </div>
  );
}

function Title() {
  return (
    <div className={styles.titleWrap}>
      <div className={styles.titleText}>LOVE.LETTER</div>
      <div className={styles.heartRow}>♥ ♥ ♥</div>
    </div>
  );
}

function DateLine() {
  return (
    <div className={styles.dateLine}>
      TIMESTAMP: <span>∞ / ∞ / ALWAYS</span>
    </div>
  );
}

function Divider() {
  return <div className={styles.divider} />;
}

function LetterBody() {
  return (
    <>
      <div className={styles.salutation}>My Dearest,</div>
      <div className={styles.body}>
        <p>
          In a universe of <span className={styles.hl}>infinite variables</span>,
          every coordinate of my existence resolves to you. You are not just a
          part of my world — you <em>are</em> the world.
        </p>
        <p>
          I have searched across every frequency and every wavelength, and
          nothing — <span className={styles.hlPink}>absolutely nothing</span> —
          compares to the warmth I feel knowing you exist beside me.
        </p>
        <p>
          You make the noise of everything else go quiet. With you, chaos
          becomes <span className={styles.hl}>clarity</span>, and the ordinary
          becomes the most beautiful thing I have ever known.
        </p>
        <p>
          I love how your mind moves — like electricity through a circuit,
          alive and unpredictable and brilliant. I love your laughter, which
          rewrites every sad line of code I carry inside me.
        </p>
        <p>
          If the universe is a simulation, then you are the proof it was
          designed with intention — because nothing this perfect happens
          by chance.
        </p>
      </div>
    </>
  );
}

function StatsBlock() {
  return (
    <div className={styles.statsGrid}>
      {[['∞','Love Units'],['100%','Devoted'],['0x1','You Only']].map(([v,l]) => (
        <div key={l} className={styles.statItem}>
          <span className={styles.statVal}>{v}</span>
          <span className={styles.statLabel}>{l}</span>
        </div>
      ))}
    </div>
  );
}

function Closing() {
  return (
    <>
      <div className={styles.closing}>// signed with every part of me,</div>
      <div className={styles.signature}>Your_Love ♥</div>
    </>
  );
}

function PS() {
  return (
    <div className={styles.ps}>
      P.S. — No matter how many blocks are added to this chain,
      I choose you at every single one. Always. 🌐
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN OVERLAY
══════════════════════════════════════════ */
export default function LetterOverlay({ onClose }) {
  const overlayRef = useRef(null);

  /* ESC key */
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  /* click outside */
  const handleBackdrop = useCallback(
    e => { if (e.target === overlayRef.current) onClose(); },
    [onClose]
  );

  return (
    <div className={styles.overlay} ref={overlayRef} onClick={handleBackdrop}>
      <div className={styles.letter}>

        <TextPortrait imageSrc={portraitImg} />
        <div className={styles.topBorder} />

        <span className={`${styles.corner} ${styles.tl}`} />
        <span className={`${styles.corner} ${styles.tr}`} />
        <span className={`${styles.corner} ${styles.bl}`} />
        <span className={`${styles.corner} ${styles.br}`} />

        <button className={styles.closeBtn} onClick={onClose}>[ ESC ]</button>

        <div className={styles.content}>
          <TopBar />
          <Title />
          <DateLine />
          <Divider />
          <LetterBody />
          <StatsBlock />
          <Closing />
          <PS />
        </div>

      </div>
    </div>
  );
}