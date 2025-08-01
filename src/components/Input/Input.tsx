import { useState } from 'react';
import styles from './Input.module.scss';

type Props = {
  type: 'email' | 'password' | 'text';
  placeholder: string;
  showToggle?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
};

const InputField = ({ type, placeholder, showToggle = false, value, onChange, error }: Props) => {
  const [visible, setVisible] = useState(false);
  const [touched, setTouched] = useState(false);

  const actualType = type === 'password' && visible ? 'text' : type;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!touched) setTouched(true);
      onChange(e);
    } catch (error) {
      console.error('Error in input change:', error);
    }
  };

  return (
    <div className={styles.inputWrapper}>
      <input
        type={actualType}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onBlur={() => setTouched(true)}
        className={error && touched ? styles.error : ''}
        aria-invalid={error && touched}
      />
      {showToggle && (
        <button
          type="button"
          className={styles.toggle}
          onClick={() => setVisible(!visible)}
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? 'HIDE' : 'SHOW'}
        </button>
      )}
      {error && touched && (
        <span className={styles.errorText} role="alert">
          This field is required
        </span>
      )}
    </div>
  );
};

export default InputField;
