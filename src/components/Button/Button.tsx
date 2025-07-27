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
  ...rest
}) => {
  return (
    <button type={type} className={`${styles.button} ${styles[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
};

export default Button;
