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

  return (
    <div className={styles.inputWrapper}>
      <input
        type={actualType}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          if (!touched) setTouched(true);
          onChange(e);
        }}
        onBlur={() => setTouched(true)}
        className={error && touched ? styles.error : ''}
      />
      {showToggle && (
        <span className={styles.toggle} onClick={() => setVisible(!visible)}>
          {visible ? 'HIDE' : 'SHOW'}
        </span>
      )}
    </div>
  );
};

export default InputField;
