import { useEffect, useRef } from 'react';

const COLORS = ['#ff2d78', '#bf00ff', '#00f0ff', '#ffd700', '#fff'];

export default function Confetti({ active }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!active) return;

    const container = containerRef.current;
    const count = window.innerWidth < 480 ? 40 : 65;
    const pieces = [];
    let rafId;

    /* create pieces */
    for (let i = 0; i < count; i++) {
      const el    = document.createElement('div');
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const size  = 5 + Math.random() * 6;

      Object.assign(el.style, {
        position:     'absolute',
        width:        size + 'px',
        height:       size + 'px',
        background:   color,
        borderRadius: Math.random() > 0.5 ? '50%' : '2px',
        left:         Math.random() * 100 + '%',
        top:          '-10px',
        opacity:      1,
      });

      container.appendChild(el);

      pieces.push({
        el,
        x:    parseFloat(el.style.left),
        y:    -10,
        vx:   (Math.random() - 0.5) * 2.5,
        vy:   2 + Math.random() * 3,
        rot:  Math.random() * 360,
        rotV: (Math.random() - 0.5) * 6,
        opacity: 1,
      });
    }

    /* animate */
    const tick = () => {
      let allDone = true;

      pieces.forEach(p => {
        if (p.opacity <= 0) return;
        allDone = false;

        p.y   += p.vy;
        p.x   += p.vx;
        p.vy  += 0.1;
        p.rot += p.rotV;

        /* fade near bottom */
        if (p.y > window.innerHeight * 0.65) {
          p.opacity = Math.max(0, p.opacity - 0.02);
        }

        p.el.style.transform = `translate(${p.x - parseFloat(p.el.style.left)}px, ${p.y}px) rotate(${p.rot}deg)`;
        p.el.style.opacity   = p.opacity;
      });

      if (!allDone) rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      pieces.forEach(p => p.el.remove());
    };
  }, [active]);

  return (
    <div
      ref={containerRef}
      style={{
        position:      'fixed',
        inset:         0,
        pointerEvents: 'none',
        zIndex:        9997,
        overflow:      'hidden',
      }}
    />
  );
}