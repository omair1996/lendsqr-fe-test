import styles from './Login.module.scss';
import InputField from '../../components/Input/Input';
import Button from '../../components/Button/Button';

const Login = () => {
  const logo = 'https://res.cloudinary.com/omair1996/image/upload/v1753602119/logo_vizdby.png';
  const Illustrlogoation =
    'https://res.cloudinary.com/omair1996/image/upload/v1753593871/pablo-sign-in_1_qh7emf.svg';
  return (
    <div className={styles.loginWrapper}>
      <div className={styles.leftPane}>
        <img src={logo} alt="Lendsqr Logo" className={styles.logo} />
        <img src={Illustrlogoation} alt="Login Illustrlogoation" className={styles.image} />
      </div>

      <div className={styles.rightPane}>
        <div className={styles.formWrapper}>
          <h2>Welcome!</h2>
          <p>Enter details to login.</p>

          <form className={styles.form}>
            <InputField type="email" placeholder="Email" />
            <InputField type="password" placeholder="Password" showToggle />
            <a href="#" className={styles.forgot}>
              FORGOT PASSWORD?
            </a>
            <Button type="submit">Login</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
