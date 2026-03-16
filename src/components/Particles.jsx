import { useMemo } from 'react';
import styles from './Particles.module.css';

const COLORS = [
  'rgba(255,45,120,0.8)',
  'rgba(0,240,255,0.8)',
  'rgba(191,0,255,0.8)',
  'rgba(255,215,0,0.6)',
];
const SHAPES = ['♥','◆','▲','✦','●'];

export default function Particles() {
  const items = useMemo(() => {
    const count = window.innerWidth < 480 ? 14 : 28;
    return Array.from({ length: count }, (_, i) => {
      const useShape = Math.random() > 0.5;
      const color    = COLORS[Math.floor(Math.random() * COLORS.length)];
      return {
        id:       i,
        useShape,
        color,
        shape:    SHAPES[Math.floor(Math.random() * SHAPES.length)],
        left:     Math.random() * 100,
        size:     useShape ? null : 2 + Math.random() * 4,
        fontSize: useShape ? 0.5 + Math.random() * 0.9 : null,
        duration: 8  + Math.random() * 14,
        delay:    Math.random() * 10,
      };
    });
  }, []);

  return (
    <div className={styles.container}>
      {items.map(p => (
        <span
          key={p.id}
          className={styles.particle}
          style={{
            left:              `${p.left}vw`,
            width:             p.useShape ? 0 : `${p.size}px`,
            height:            p.useShape ? 0 : `${p.size}px`,
            fontSize:          p.useShape ? `${p.fontSize}rem` : 0,
            background:        p.useShape ? 'transparent' : p.color,
            color:             p.color,
            boxShadow:         p.useShape ? 'none' : `0 0 6px ${p.color}`,
            textShadow:        '0 0 8px currentColor',
            animationDuration: `${p.duration}s`,
            animationDelay:    `${p.delay}s`,
          }}
        >
          {p.useShape ? p.shape : null}
        </span>
      ))}
    </div>
  );
}