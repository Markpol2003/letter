import styles from './Background.module.css';

export default function Background() {
  return (
    <>
      <div className={styles.gridBg}    />
      <div className={styles.glowCenter}/>
      <div className={styles.scanline}  />
      <div className={`${styles.cornerDecor} ${styles.tl}`}/>
      <div className={`${styles.cornerDecor} ${styles.tr}`}/>
      <div className={`${styles.cornerDecor} ${styles.bl}`}/>
      <div className={`${styles.cornerDecor} ${styles.br}`}/>
    </>
  );
}