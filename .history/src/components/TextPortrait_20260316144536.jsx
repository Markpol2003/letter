import { useEffect, useRef } from 'react';
import styles from './TextPortrait.module.css';

// characters used to draw the portrait
const CHARS = 'LOVEYOUFOREVER♥01'.split('');

function getFontSize() {
  const w = window.innerWidth;
  if (w <= 360) return 5;
  if (w <= 480) return 6;
  return 7;
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    // If you use an external URL, this helps avoid canvas tainting (server must allow CORS)
    img.crossOrigin = 'anonymous';
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = reject;
  });
}

/** draw image like background-size: cover */
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

/** optional: boost contrast/brightness to make the portrait more visible */
function boostVisibility(ctx, W, H) {
  const imgData = ctx.getImageData(0, 0, W, H);
  const d = imgData.data;

  // tweak these if you want stronger portrait
  const contrast = 1.25;  // 1 = no change
  const brighten = 10;    // 0 = no change

  for (let i = 0; i < d.length; i += 4) {
    // convert to grayscale
    const r = d[i], g = d[i + 1], b = d[i + 2];
    let y = 0.299 * r + 0.587 * g + 0.114 * b;

    // contrast around midpoint 128
    y = (y - 128) * contrast + 128 + brighten;

    // clamp
    y = Math.max(0, Math.min(255, y));

    d[i] = d[i + 1] = d[i + 2] = y;
    // keep alpha as-is
  }

  ctx.putImageData(imgData, 0, 0);

  // a little dark vignette helps make it “portrait-like”
  const vg = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.2, W / 2, H / 2, Math.max(W, H) * 0.7);
  vg.addColorStop(0, 'rgba(0,0,0,0)');
  vg.addColorStop(1, 'rgba(0,0,0,0.35)');
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, W, H);
}

function buildCacheFromCanvas(sourceCanvas, W, H) {
  const FS = getFontSize();
  const cols = Math.floor(W / FS);
  const rows = Math.floor(H / FS);

  const tiny = document.createElement('canvas');
  tiny.width = cols;
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
  const animRef = useRef(null);
  const cacheRef = useRef(null);
  const frameRef = useRef(0);
  const imgRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function initImage() {
      try {
        const img = await loadImage(imageSrc);
        if (!cancelled) imgRef.current = img;
        // after image loads, build
        initAndStart();
      } catch (e) {
        console.error('Failed to load portrait image:', e);
      }
    }

    function initAndStart() {
      const canvas = canvasRef.current;
      const img = imgRef.current;
      if (!canvas || !img) return;

      const card = canvas.parentElement;
      const W = card.offsetWidth || 520;
      const H = card.offsetHeight || 600;

      canvas.width = W;
      canvas.height = H;

      // ── THIS is the replacement for drawSilhouette() ──
      // Draw your image to an offscreen canvas
      const src = document.createElement('canvas');
      src.width = W;
      src.height = H;

      const sCtx = src.getContext('2d');
      sCtx.clearRect(0, 0, W, H);
      drawImageCover(sCtx, img, W, H);

      // make it more visible as a text portrait
      boostVisibility(sCtx, W, H);

      cacheRef.current = buildCacheFromCanvas(src, W, H);
      frameRef.current = 0;

      // start animation loop
      if (animRef.current) cancelAnimationFrame(animRef.current);

      const tick = () => {
        const { cols, rows, FS, pixels, colOffset } = cacheRef.current || {};
        if (!cols) return;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, W, H);
        ctx.font = `700 ${FS}px "Share Tech Mono", monospace`;
        ctx.textBaseline = 'top';

        const frame = frameRef.current;

        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            const i = (row * cols + col) * 4;
            const brightness =
              (pixels[i] * 0.299 + pixels[i + 1] * 0.587 + pixels[i + 2] * 0.114) / 255;

            if (brightness < 0.06) continue;

            const ci = (colOffset[col] + Math.floor(frame / 4) + row) % CHARS.length;

            // brighter pixels -> more visible characters
            const alpha = Math.min(1, Math.max(0.12, brightness * 1.15));

            // neon-ish tint
            ctx.fillStyle = `rgba(255,45,120,${alpha})`;
            ctx.fillText(CHARS[ci], col * FS, row * FS);
          }
        }

        frameRef.current++;
        animRef.current = requestAnimationFrame(tick);
      };

      animRef.current = requestAnimationFrame(tick);
    }

    // load image first
    initImage();

    // rebuild on resize
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageSrc]);

  return <canvas ref={canvasRef} className={styles.canvas} />;
}