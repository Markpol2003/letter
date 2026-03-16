import styles from './Envelope.module.css';

export default function Envelope({ isOpen, onClick }) {
  return (
    <div
      className={`${styles.wrapper} ${isOpen ? styles.open : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}
      aria-label="Open love letter"
    >
      <div className={styles.envelope}>
        <div className={styles.envBody}>
          <div className={styles.envLeft}  />
          <div className={styles.envRight} />
          <div className={styles.envBottom}/>
        </div>
        <div className={styles.envFlap} />
        <div className={styles.seal}>💗</div>
      </div>
    </div>
  );
}