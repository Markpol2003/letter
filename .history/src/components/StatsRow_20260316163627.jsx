import styles from './StatsRow.module.css';

const STATS = [
  { label: 'ENCRYPTED', cls: 'cyan'   },
  { label: 'SEALED',    cls: 'pink'   },
  { label: 'FOREVER',   cls: 'purple' },
];

export default function StatsRow() {
  return (
    <div className={styles.row}>
      {STATS.map(s => (
        <div key={s.label} className={styles.chip}>
          <span className={`${styles.dot} ${styles[s.cls]}`} />
          {s.label}
        </div>
      ))}
    </div>
  );
}