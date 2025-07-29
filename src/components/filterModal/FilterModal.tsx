import styles from './FilterModal.module.scss';

interface FilterModalProps {
  onClose: () => void;
}

export default function FilterModal({ onClose }: FilterModalProps) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>FILTER</h3>
          <span className={styles.closeBtn} onClick={onClose}>
            ×
          </span>
        </div>

        <div className={styles.modalBody}>
          <label>ORGANIZATION</label>
          <select>
            <option>Select</option>
          </select>

          <label>USERNAME</label>
          <input type="text" placeholder=" user" />

          <label>EMAIL</label>
          <input type="text" placeholder="email" />

          <label>DATE</label>
          <input type="date" placeholder="date" />

          <label>PHONE NUMBER</label>
          <input type="text" placeholder="phone Number" />

          <label>STATUS</label>
          <select>
            <option>Select</option>
          </select>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.resetBtn}>Reset</button>
          <button className={styles.filterBtn}>Filter</button>
        </div>
      </div>
    </div>
  );
}
