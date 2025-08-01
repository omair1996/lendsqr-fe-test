import React from 'react';
import styles from './Button.module.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({
  children,
  type = 'button',
  className = '',
  variant = 'primary',
  onClick,
  ...rest
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      onClick?.(e);
    } catch (error) {
      console.error('Button click handler error:', error);
    }
  };

  return (
    <button
      type={type}
      className={`${styles.button} ${styles[variant]} ${className}`}
      onClick={onClick ? handleClick : undefined}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
