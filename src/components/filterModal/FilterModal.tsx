import styles from './FilterModal.module.scss';
import { CircleX } from 'lucide-react';
import { useState } from 'react';

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

// Export for testing
export const createHandleChange = (
  setValues: React.Dispatch<React.SetStateAction<FilterValues>>
) => {
  return (field: keyof FilterValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };
};

export default function FilterModal({
  onClose,
  onApply,
  onReset,
  values,
  setValues,
}: FilterModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleChange = createHandleChange(setValues);

  const handleApply = async () => {
    setIsSubmitting(true);
    try {
      await onApply(values);
    } catch (error) {
      console.error('Filter apply error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = async () => {
    try {
      await onReset();
    } catch (error) {
      console.error('Filter reset error:', error);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <CircleX
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close"
            data-testid="close-button"
          />
        </div>

        <div className={styles.modalBody}>
          <label htmlFor="organization">ORGANIZATION</label>
          <select
            id="organization"
            value={values.organization || ''}
            onChange={(e) => handleChange('organization', e.target.value)}
          >
            <option value="">Select</option>
            <option value="Lendstar">Lendstar</option>
            <option value="Irorun">Irorun</option>
          </select>

          <label htmlFor="username">USERNAME</label>
          <input
            id="username"
            type="text"
            value={values.username || ''}
            onChange={(e) => handleChange('username', e.target.value)}
            placeholder="user"
          />

          <label htmlFor="email">EMAIL</label>
          <input
            id="email"
            type="text"
            value={values.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="email"
          />

          <label htmlFor="date">DATE</label>
          <input
            id="date"
            type="date"
            value={values.date || ''}
            onChange={(e) => handleChange('date', e.target.value)}
          />

          <label htmlFor="phonenumber">PHONE NUMBER</label>
          <input
            id="phonenumber"
            type="text"
            value={values.phone || ''}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="phone number"
          />

          <label htmlFor="status">STATUS</label>
          <select
            id="status"
            value={values.status || ''}
            onChange={(e) => handleChange('status', e.target.value)}
          >
            <option value="">Select</option>
            <option value="active">Active</option>
            <option value="blacklisted">Blacklisted</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.resetBtn} onClick={handleReset} disabled={isSubmitting}>
            Reset
          </button>
          <button className={styles.filterBtn} onClick={handleApply} disabled={isSubmitting}>
            {isSubmitting ? 'Applying...' : 'Filter'}
          </button>
        </div>
      </div>
    </div>
  );
}
