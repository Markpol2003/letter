import { useEffect, useRef } from 'react';
import styles from './CursorEffect.module.css';

const COLORS  = ['#ff2d78','#bf00ff','#00f0ff','#ffd700'];
const SYMBOLS = ['♥','✦','◆','▲','●','★'];

export default function CursorEffect() {
  const cursorRef = useRef(null);
  const ringRef   = useRef(null);
  const mouseRef  = useRef({ x: -999, y: -999 });
  const ringPosRef = useRef({ x: -999, y: -999 });
  const rafRef    = useRef(null);

  useEffect(() => {
    /* hide default cursor */
    document.body.style.cursor = 'none';

    const cursor = cursorRef.current;
    const ring   = ringRef.current;

    /* mouse move */
    const onMove = e => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      cursor.style.transform =
        `translate(${e.clientX}px, ${e.clientY}px)`;
      spawnTrail(e.clientX, e.clientY);
    };

    /* click burst */
    const onClick = e => spawnBurst(e.clientX, e.clientY);

    /* hover on clickable elements */
    const onEnter = () => {
      cursor.classList.add(styles.cursorHover);
      ring.classList.add(styles.ringHover);
    };
    const onLeave = () => {
      cursor.classList.remove(styles.cursorHover);
      ring.classList.remove(styles.ringHover);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('click', onClick);

    const clickables = document.querySelectorAll(
      'button, a, [role="button"], [tabindex]'
    );
    clickables.forEach(el => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
      el.style.cursor = 'none';
    });

    /* RAF loop: smooth ring lerp */
    const loop = () => {
      const { x: mx, y: my } = mouseRef.current;
      const rp = ringPosRef.current;
      rp.x += (mx - rp.x) * 0.12;
      rp.y += (my - rp.y) * 0.12;
      ring.style.transform =
        `translate(${rp.x}px, ${rp.y}px)`;
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      document.body.style.cursor = '';
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('click', onClick);
      clickables.forEach(el => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
        el.style.cursor = '';
      });
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  function spawnTrail(x, y) {
    const el        = document.createElement('div');
    el.className    = styles.trail;
    const useSymbol = Math.random() > 0.55;
    const color     = COLORS[Math.floor(Math.random() * COLORS.length)];
    const size      = useSymbol ? null : 3 + Math.random() * 4;

    el.style.left  = x + 'px';
    el.style.top   = y + 'px';
    el.style.color = color;

    if (useSymbol) {
      el.textContent    = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      el.style.fontSize = (10 + Math.random() * 10) + 'px';
      el.style.textShadow = `0 0 8px ${color}`;
    } else {
      el.style.width        = size + 'px';
      el.style.height       = size + 'px';
      el.style.background   = color;
      el.style.boxShadow    = `0 0 6px ${color}`;
      el.style.borderRadius = '50%';
    }

    const angle = Math.random() * Math.PI * 2;
    const dist  = 20 + Math.random() * 40;
    el.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
    el.style.setProperty('--dy', Math.sin(angle) * dist + 'px');

    document.body.appendChild(el);
    setTimeout(() => el.remove(), 600);
  }

  function spawnBurst(x, y) {
    const count = 12;
    for (let i = 0; i < count; i++) {
      const el    = document.createElement('div');
      el.className = styles.burst;
      const color  = COLORS[Math.floor(Math.random() * COLORS.length)];
      const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      const angle  = (i / count) * Math.PI * 2;
      const dist   = 40 + Math.random() * 60;
      const size   = 10 + Math.random() * 14;

      el.textContent      = symbol;
      el.style.left       = x + 'px';
      el.style.top        = y + 'px';
      el.style.color      = color;
      el.style.fontSize   = size + 'px';
      el.style.textShadow = `0 0 10px ${color}, 0 0 20px ${color}`;
      el.style.setProperty('--bx', Math.cos(angle) * dist + 'px');
      el.style.setProperty('--by', Math.sin(angle) * dist + 'px');

      document.body.appendChild(el);
      setTimeout(() => el.remove(), 800);
    }

    /* ripple */
    const ripple    = document.createElement('div');
    ripple.className = styles.ripple;
    ripple.style.left = x + 'px';
    ripple.style.top  = y + 'px';
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  }

  return (
    <>
      <div ref={cursorRef} className={styles.cursor} />
      <div ref={ringRef}   className={styles.ring}   />
    </>
  );
}