import { useState } from 'react';
import styles from './Input.module.scss';

type Props = {
  type: 'email' | 'password' | 'text';
  placeholder: string;
  showToggle?: boolean;
};

const InputField = ({ type, placeholder, showToggle = false }: Props) => {
  const [visible, setVisible] = useState(false);

  const actualType = type === 'password' && visible ? 'text' : type;

  return (
    <div className={styles.inputWrapper}>
      <input type={actualType} placeholder={placeholder} />
      {showToggle && (
        <span className={styles.toggle} onClick={() => setVisible(!visible)}>
          {visible ? 'HIDE' : 'SHOW'}
        </span>
      )}
    </div>
  );
};

export default InputField;
