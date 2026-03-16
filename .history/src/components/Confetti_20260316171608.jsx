import { useEffect, useRef } from 'react';
import styles from './Confetti.module.css';

const COLORS  = ['#ff2d78','#bf00ff','#00f0ff','#ffd700','#fff'];
const SYMBOLS = ['♥','◆','▲','✦','★','●'];

export default function Confetti({ active }) {
  const containerRef = useRef(null);
  const piecesRef    = useRef([]);
  const rafRef       = useRef(null);

  useEffect(() => {
    if (!active) return;

    const container = containerRef.current;
    const W = window.innerWidth;
    const count = window.innerWidth < 480 ? 55 : 90;

    /* create pieces */
    const pieces = Array.from({ length: count }, () => {
      const el        = document.createElement('div');
      const useSymbol = Math.random() > 0.45;
      const color     = COLORS[Math.floor(Math.random() * COLORS.length)];
      const size      = useSymbol
        ? 10 + Math.random() * 14
        : 5  + Math.random() * 8;

      el.className = styles.piece;
      el.style.left    = Math.random() * W + 'px';
      el.style.top     = -(size + 20) + 'px';
      el.style.color   = color;

      if (useSymbol) {
        el.textContent    = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
        el.style.fontSize = size + 'px';
        el.style.textShadow = `0 0 8px ${color}`;
      } else {
        el.style.width      = size + 'px';
        el.style.height     = size * (0.4 + Math.random() * 0.6) + 'px';
        el.style.background = color;
        el.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        el.style.boxShadow  = `0 0 4px ${color}`;
      }

      container.appendChild(el);

      return {
        el,
        x:    parseFloat(el.style.left),
        y:    parseFloat(el.style.top),
        vx:   (Math.random() - 0.5) * 3,
        vy:   2 + Math.random() * 4,
        rot:  Math.random() * 360,
        rotV: (Math.random() - 0.5) * 8,
        opacity: 1,
        done: false,
      };
    });

    piecesRef.current = pieces;

    const tick = () => {
      let allDone = true;

      pieces.forEach(p => {
        if (p.done) return;
        allDone = false;

        p.x   += p.vx;
        p.y   += p.vy;
        p.vy  += 0.12;            /* gravity */
        p.vx  *= 0.995;           /* air drag */
        p.rot += p.rotV;

        /* fade out in bottom 30% of screen */
        if (p.y > window.innerHeight * 0.7) {
          p.opacity = Math.max(0, p.opacity - 0.018);
        }

        p.el.style.transform = `translate(${p.x - parseFloat(p.el.style.left)}px, ${p.y - parseFloat(p.el.style.top)}px) rotate(${p.rot}deg)`;
        p.el.style.opacity   = p.opacity;

        if (p.y > window.innerHeight + 40 || p.opacity <= 0) {
          p.el.remove();
          p.done = true;
        }
      });

      if (!allDone) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      pieces.forEach(p => p.el.remove());
    };
  }, [active]);

  return <div ref={containerRef} className={styles.container} />;
}