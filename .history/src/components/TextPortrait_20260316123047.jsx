import { useEffect, useRef } from 'react';
import styles from './TextPortrait.module.css';

const CHARS = 'loveyouforeverandeveralways♥01'.split('');

function getFontSize() {
  const w = window.innerWidth;
  if (w <= 360) return 5;
  if (w <= 480) return 6;
  return 7;
}

function drawSilhouette(ctx, W, H) {
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, W, H);
  const cx = W / 2;

  /* body */
  const bodyG = ctx.createRadialGradient(cx, H*.85,10, cx, H*.72, W*.7);
  bodyG.addColorStop(0,   'rgba(200,200,220,0.95)');
  bodyG.addColorStop(0.55,'rgba(120,100,160,0.6)');
  bodyG.addColorStop(1,   'rgba(0,0,0,0)');
  ctx.beginPath();
  ctx.ellipse(cx, H*.88, W*.48, H*.28, 0, 0, Math.PI*2);
  ctx.fillStyle = bodyG; ctx.fill();

  /* neck */
  const neckG = ctx.createLinearGradient(cx-18,H*.52,cx+18,H*.65);
  neckG.addColorStop(0,'rgba(200,190,220,0.9)');
  neckG.addColorStop(1,'rgba(140,120,180,0.5)');
  ctx.beginPath();
  ctx.ellipse(cx, H*.58, 18, 50, 0, 0, Math.PI*2);
  ctx.fillStyle = neckG; ctx.fill();

  /* head */
  const headG = ctx.createRadialGradient(cx-W*.04,H*.28,8, cx,H*.30,W*.22);
  headG.addColorStop(0,   'rgba(255,255,255,0.95)');
  headG.addColorStop(0.35,'rgba(210,190,240,0.85)');
  headG.addColorStop(0.7, 'rgba(140,100,200,0.5)');
  headG.addColorStop(1,   'rgba(0,0,0,0)');
  ctx.beginPath();
  ctx.ellipse(cx, H*.30, W*.20, H*.19, -0.05, 0, Math.PI*2);
  ctx.fillStyle = headG; ctx.fill();

  /* hair */
  const hairG = ctx.createRadialGradient(cx,H*.17,5, cx,H*.20,W*.22);
  hairG.addColorStop(0,  'rgba(60,30,80,0.95)');
  hairG.addColorStop(0.6,'rgba(30,10,50,0.7)');
  hairG.addColorStop(1,  'rgba(0,0,0,0)');
  ctx.beginPath();
  ctx.ellipse(cx, H*.18, W*.21, H*.16, 0, 0, Math.PI*2);
  ctx.fillStyle = hairG; ctx.fill();

  /* eyes */
  [[cx-W*.068,H*.28],[cx+W*.068,H*.28]].forEach(([ex,ey])=>{
    const eg = ctx.createRadialGradient(ex,ey,1,ex,ey,9);
    eg.addColorStop(0,'rgba(20,10,40,1)');
    eg.addColorStop(1,'rgba(80,40,120,0)');
    ctx.beginPath();
    ctx.ellipse(ex,ey,9,5,0,0,Math.PI*2);
    ctx.fillStyle=eg; ctx.fill();
  });

  /* lips */
  const lipG = ctx.createRadialGradient(cx,H*.365,1,cx,H*.365,14);
  lipG.addColorStop(0,  'rgba(200,60,100,0.85)');
  lipG.addColorStop(0.6,'rgba(160,40,80,0.5)');
  lipG.addColorStop(1,  'rgba(0,0,0,0)');
  ctx.beginPath();
  ctx.ellipse(cx,H*.365,14,5,0,0,Math.PI*2);
  ctx.fillStyle=lipG; ctx.fill();

  /* bloom */
  const bloom = ctx.createRadialGradient(cx-W*.06,H*.24,0,cx,H*.30,W*.18);
  bloom.addColorStop(0,'rgba(255,220,255,0.25)');
  bloom.addColorStop(1,'rgba(255,220,255,0)');
  ctx.beginPath();
  ctx.ellipse(cx,H*.30,W*.18,H*.17,0,0,Math.PI*2);
  ctx.fillStyle=bloom; ctx.fill();
}

function buildCache(W, H) {
  const FS   = getFontSize();
  const cols = Math.floor(W / FS);
  const rows = Math.floor(H / FS);

  const src  = document.createElement('canvas');
  src.width  = W; src.height = H;
  drawSilhouette(src.getContext('2d'), W, H);

  const tiny  = document.createElement('canvas');
  tiny.width  = cols; tiny.height = rows;
  const tCtx  = tiny.getContext('2d');
  tCtx.drawImage(src, 0, 0, cols, rows);

  const colOffset = Array.from({ length: cols },
    () => Math.floor(Math.random() * CHARS.length));

  return { cols, rows, FS, pixels: tCtx.getImageData(0,0,cols,rows).data, colOffset };
}

export default function TextPortrait() {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);
  const cacheRef  = useRef(null);
  const frameRef  = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const init = () => {
      const card = canvas.parentElement;
      const W    = card.offsetWidth  || 520;
      const H    = card.offsetHeight || 600;
      canvas.width  = W;
      canvas.height = H;
      cacheRef.current  = buildCache(W, H);
      frameRef.current  = 0;
    };

    const tick = () => {
      const canvas = canvasRef.current;
      if (!canvas || !cacheRef.current) return;

      const { cols, rows, FS, pixels, colOffset } = cacheRef.current;
      const ctx = canvas.getContext('2d');
      const W   = canvas.width;
      const H   = canvas.height;

      ctx.clearRect(0, 0, W, H);
      ctx.font         = `bold ${FS}px "Share Tech Mono", monospace`;
      ctx.textBaseline = 'top';

      const frame = frameRef.current;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const i = (row * cols + col) * 4;
          const brightness =
            (pixels[i]*0.299 + pixels[i+1]*0.587 + pixels[i+2]*0.114) / 255;
          if (brightness < 0.055) continue;

          const ci = (colOffset[col] + Math.floor(frame / 4) + row) % CHARS.length;

          let colour;
          if      (brightness > 0.75) colour = `rgba(240,220,255,${brightness.toFixed(2)})`;
          else if (brightness > 0.45) colour = `rgba(255,45,120,${(brightness*0.9).toFixed(2)})`;
          else if (brightness > 0.22) colour = `rgba(191,0,255,${(brightness*1.1).toFixed(2)})`;
          else                        colour = `rgba(0,240,255,${(brightness*1.2).toFixed(2)})`;

          ctx.fillStyle = colour;
          ctx.fillText(CHARS[ci], col * FS, row * FS);
        }
      }

      frameRef.current++;
      animRef.current = requestAnimationFrame(tick);
    };

    init();
    animRef.current = requestAnimationFrame(tick);

    /* resize */
    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { init(); }, 250);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} />;
}