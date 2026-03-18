import { useEffect, useRef } from 'react';
import styles from './TextPortrait.module.css';

const CHARS = 'LOVEYOUFOREVER♥01'.split('');

function getFontSize() {
  const w = window.innerWidth;
  if (w <= 360) return 6;   // was 5
  if (w <= 480) return 7;   // was 6
  return 8;                  // was 7
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = reject;
  });
}

function drawImageCover(ctx, img, W, H) {
  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  const scale = Math.max(W / iw, H / ih);
  const sw = Math.ceil(W / scale);
  const sh = Math.ceil(H / scale);
  const sx = Math.floor((iw - sw) / 2);
  const sy = Math.floor((ih - sh) / 2);
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, W, H);
}

function boostVisibility(ctx, W, H) {
  const imgData = ctx.getImageData(0, 0, W, H);
  const d = imgData.data;

  const contrast = 1.8;   // was 1.25 — much stronger edge definition
  const brighten = 20;    // was 10  — lifts midtones so more chars appear

  for (let i = 0; i < d.length; i += 4) {
    const r = d[i], g = d[i + 1], b = d[i + 2];
    let y = 0.299 * r + 0.587 * g + 0.114 * b;
    y = (y - 128) * contrast + 128 + brighten;
    y = Math.max(0, Math.min(255, y));
    d[i] = d[i + 1] = d[i + 2] = y;
  }

  ctx.putImageData(imgData, 0, 0);

  // lighter vignette so edges stay visible
  const vg = ctx.createRadialGradient(
    W / 2, H / 2, Math.min(W, H) * 0.25,
    W / 2, H / 2, Math.max(W, H) * 0.75
  );
  vg.addColorStop(0, 'rgba(0,0,0,0)');
  vg.addColorStop(1, 'rgba(0,0,0,0.2)');   // was 0.35
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, W, H);
}

function buildCacheFromCanvas(sourceCanvas, W, H) {
  const FS = getFontSize();
  const cols = Math.floor(W / FS);
  const rows = Math.floor(H / FS);

  const tiny = document.createElement('canvas');
  tiny.width  = cols;
  tiny.height = rows;

  const tCtx = tiny.getContext('2d');
  tCtx.drawImage(sourceCanvas, 0, 0, cols, rows);
  const pixels = tCtx.getImageData(0, 0, cols, rows).data;

  const colOffset = Array.from({ length: cols }, () =>
    Math.floor(Math.random() * CHARS.length)
  );

  return { cols, rows, FS, pixels, colOffset };
}

export default function TextPortrait({ imageSrc }) {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);
  const cacheRef  = useRef(null);
  const frameRef  = useRef(0);
  const imgRef    = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function initImage() {
      try {
        const img = await loadImage(imageSrc);
        if (!cancelled) imgRef.current = img;
        initAndStart();
      } catch (e) {
        console.error('Failed to load portrait image:', e);
      }
    }

    function initAndStart() {
      const canvas = canvasRef.current;
      const img    = imgRef.current;
      if (!canvas || !img) return;

      const card = canvas.parentElement;
      const W    = card.offsetWidth  || 520;
      const H    = card.offsetHeight || 600;

      canvas.width  = W;
      canvas.height = H;

      const src  = document.createElement('canvas');
      src.width  = W;
      src.height = H;

      const sCtx = src.getContext('2d');
      sCtx.clearRect(0, 0, W, H);
      drawImageCover(sCtx, img, W, H);
      boostVisibility(sCtx, W, H);

      cacheRef.current = buildCacheFromCanvas(src, W, H);
      frameRef.current = 0;

      if (animRef.current) cancelAnimationFrame(animRef.current);

      const tick = () => {
        if (cancelled) return;
        const { cols, rows, FS, pixels, colOffset } = cacheRef.current || {};
        if (!cols) return;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, W, H);
        ctx.font          = `700 ${FS}px "Share Tech Mono", monospace`;
        ctx.textBaseline  = 'top';

        const frame = frameRef.current;

        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            const i = (row * cols + col) * 4;
            const brightness =
              (pixels[i] * 0.299 + pixels[i + 1] * 0.587 + pixels[i + 2] * 0.114) / 255;

            // lower skip threshold so more dark areas still render
            if (brightness < 0.04) continue;   // was 0.06

            const ci = (colOffset[col] + Math.floor(frame / 4) + row) % CHARS.length;

            // stronger alpha curve — bright pixels near fully opaque
            const alpha = Math.min(1, Math.max(0.15, brightness * 1.4));  // was 1.15, floor 0.12

            // two-tone: bright areas cyan, mid-tones pink — adds depth + readability
            if (brightness > 0.55) {
              ctx.fillStyle = `rgba(0,240,255,${alpha})`;      // neon-cyan highlights
            } else if (brightness > 0.25) {
              ctx.fillStyle = `rgba(255,45,120,${alpha})`;     // neon-pink midtones
            } else {
              ctx.fillStyle = `rgba(191,0,255,${alpha * 0.8})`; // purple shadows
            }

            ctx.fillText(CHARS[ci], col * FS, row * FS);
          }
        }

        frameRef.current++;
        animRef.current = requestAnimationFrame(tick);
      };

      animRef.current = requestAnimationFrame(tick);
    }

    initImage();

    let rTimer;
    const onResize = () => {
      clearTimeout(rTimer);
      rTimer = setTimeout(() => initAndStart(), 250);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelled = true;
      window.removeEventListener('resize', onResize);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [imageSrc]);

  return <canvas ref={canvasRef} className={styles.canvas} />;
}