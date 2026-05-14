import { useEffect, useRef, useCallback } from 'react';
import TextPortrait from './TextPortrait';
import styles       from './LetterOverlay.module.css';
import portraitImg from '../assets/portrait.png';

/* ── sub-components ── */
function TopBar() {
  return (
    <div className={styles.topBar}>
    </div>
  );
}

function Title() {
  return (
    <div className={styles.titleWrap}>
      <div className={styles.titleText}>CONGRATULATIONS, MA'AM!</div>
    </div>
  );
}

function DateLine() {
  return (
    <div className={styles.dateLine}>
    </div>
  );
}

function Divider() {
  return <div className={styles.divider} />;
}

function LetterBody() {
  return (
    <>
      <div className={styles.salutation}>Hi, Ma'am Dail! Congratulations!</div>
      <div className={styles.body}>
        <p>
        I only had a few days to finish this code, but good thing professional crammer ko hehe.
        </p>
        <p>
        I just want to say that I really admire you, even from afar. Malipay jud ko every time magkasugat ta. Your smile is honestly one of the things I like most about you. Every time makita tika — especially during graduation practice sa taas — my heart feels so happy.
        </p>
        <p>
        Sayang lang kay I had plans unta nga magpapicture sa imo during graduation, but anyways…
        </p>
        <p>
        There’s something peaceful and inspiring about your presence. Bisan simple ra nga moments, makahimo jud kag impact without even realizing it. Don’t worry, if ever mabasa man nimo ni, I don’t expect anything. I just wanted my congratulations message for you to be a little unique and sincere.
        </p>
        <p>
For now, I’ll continue admiring you quietly and hoping nga someday maka-interact ta more.
        </p>
        <p>
          I'm always rooting for you — for your dreams, plans, and future
          success. Deserve nimo tanan good things nga moabot sa imong life.
        </p>
        <p>
          God bless you always, Ma'am Dail. Congratulations again, and take care
          always! 🤍
        </p>
      </div>
    </>
  );
}

function StatsBlock() {
  return null;
}

function Closing() {
  return (
    <>
      <div className={styles.closing}>// signed with every part of me,</div>
      <div className={styles.signature}>Mark</div>
    </>
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

        <button className={styles.closeBtn} onClick={onClose}>[ Back ]</button>

        <div className={styles.content}>
          <TopBar />
          <Title />
          <DateLine />
          <Divider />
          <LetterBody />
          <StatsBlock />
          <Closing />
        </div>

      </div>
    </div>
  );
}