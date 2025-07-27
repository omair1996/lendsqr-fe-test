import { useState } from 'react';
import styles from './Login.module.scss';
import InputField from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import LoadingIndicator from '../../components/loading/LoadingIndicator';
const logo = 'https://res.cloudinary.com/omair1996/image/upload/v1753602119/logo_vizdby.png';
const illustration =
  'https://res.cloudinary.com/omair1996/image/upload/v1753593871/pablo-sign-in_1_qh7emf.svg';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: false, password: false });
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) =>
    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailValid = validateEmail(email);
    const passwordValid = password.length > 0;

    setErrors({ email: !emailValid, password: !passwordValid });

    if (!emailValid || !passwordValid) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Logged in!');
    }, 2000);
  };

  return loading ? (
    <div>
      <LoadingIndicator />
    </div>
  ) : (
    <div className={styles.loginWrapper}>
      <div className={styles.leftPane}>
        <img src={logo} alt="Lendsqr Logo" className={styles.logo} />
        <img src={illustration} alt="Login Illustration" className={styles.image} />
      </div>

      <div className={styles.rightPane}>
        <div className={styles.formWrapper}>
          <h2>Welcome!</h2>
          <p>Enter details to login.</p>

          <form className={styles.form} onSubmit={handleSubmit}>
            <InputField
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />
            <InputField
              type="password"
              placeholder="Password"
              showToggle
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <a href="#" className={styles.forgot}>
              FORGOT PASSWORD?
            </a>
            <Button type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
