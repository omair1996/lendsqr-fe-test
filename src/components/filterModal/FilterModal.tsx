import styles from './FilterModal.module.scss';

export interface FilterValues {
  organization?: string;
  username?: string;
  email?: string;
  date?: string;
  phone?: string;
  status?: string;
}

export interface FilterModalProps {
  onClose: () => void;
  onApply: (filters: FilterValues) => void;
  onReset: () => void;
  values: FilterValues;
  setValues: React.Dispatch<React.SetStateAction<FilterValues>>;
}

export default function FilterModal({
  onClose,
  onApply,
  onReset,
  values,
  setValues,
}: FilterModalProps) {
  const handleChange = (field: keyof FilterValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

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
          <select
            value={values.organization || ''}
            onChange={(e) => handleChange('organization', e.target.value)}
          >
            <option value="">Select</option>
            <option value="Lendstar">Lendsqr</option>
            <option value="Irorun">Irorun</option>
          </select>

          <label>USERNAME</label>
          <input
            type="text"
            value={values.username || ''}
            onChange={(e) => handleChange('username', e.target.value)}
            placeholder="user"
          />

          <label>EMAIL</label>
          <input
            type="text"
            value={values.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="email"
          />

          <label>DATE</label>
          <input
            type="date"
            value={values.date || ''}
            onChange={(e) => handleChange('date', e.target.value)}
          />

          <label>PHONE NUMBER</label>
          <input
            type="text"
            value={values.phone || ''}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="phone number"
          />

          <label>STATUS</label>
          <select
            value={values.status || ''}
            onChange={(e) => handleChange('status', e.target.value)}
          >
            <option value="">Select</option>
            <option value="active">Active</option>
            <option value="blacklisted">Blacklisted</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.resetBtn} onClick={onReset}>
            Reset
          </button>
          <button className={styles.filterBtn} onClick={() => onApply(values)}>
            Filter
          </button>
        </div>
      </div>
    </div>
  );
}
