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
        I only had a few days to finish this code, but good thing professional crammer ko. 
        </p>
        <p>
          <span className={styles.hl}>CONGRATULATIONS!!!</span> Graduate na jud
          ka, Nyce. Good luck sa imong college journey ug sa course na imong
          pilion. Future Engr ba? Pero masking unsa man na path imong kuhaon,
          kaya raman japon kaayo nimo man.
        </p>
        <p>
          Wala ko nag message sa katung link nnyo para sa retreat, para maiba
          lang. Gi-code nako ni siya na letter ug plano jud nako ni i-send
          saimong NGL. Abi nako di naka mag NGL kay i-direct message unta nako,
          pero timing nag NGL ka. Unya sa akong na remember, na exit nako dayun.
          Mao najud ni.
        </p>
        <p>Kanang, kuan...</p>
        <p>
          Thank you, Nyce, for being honest sa pag ingon directly sakoa sa akong
          last confession. <span className={styles.hlPink}>I really appreciated
          that</span> kay gusto pud nako makabalo sa tinuod ug dili napud ko mag
          hope ug sobra. Pero even after that, I still admire you from afar and
          siguro naga hope pako even though I know sakong self na walay chance.
        </p>
        <p>
          Nag plano pud ko atong sa seniors ball na magpa picture saimo but then
          wala nalang. Kay murag kota kaykag pa picture saimong admirers.
        </p>
        <p>
          I'm still admiring you from afar. Mawala ra man pud ni, eventually.
          Hehehe.
        </p>
        <p>
          Mao napud ata ni akong last letter jud. Naa nay physical ug digital
          letter.
        </p>
        <p>
          Kanang, <span className={styles.hl}>gwapa jud kayka mu smile</span>.
          Like, makawala ug stress haha.
        </p>
        <p>
          Good luck again, Nyce, as you step into another chapter sa imong life.
          I hope you achieve all your dreams and stay the same kind and inspiring
          person that you are.
        </p>
        <p><span className={styles.hlPink}>Keep inspiring others!</span></p>
        <p>And… take care always.</p>
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

function PS() {
  return (
    <div className={styles.ps}>
      P.S. — Mao napud ata ni akong last letter jud.
      Naa nay physical ug digital letter. Take care always, Nyce.
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

        <button className={styles.closeBtn} onClick={onClose}>[ Back ]</button>

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