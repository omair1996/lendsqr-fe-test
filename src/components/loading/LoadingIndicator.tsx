import styles from './LoadingIndicator.module.scss';

const LoadingIndicator = () => {
  return (
    <div className={styles.loaderWrapper}>
      <div className={styles.spinner}></div>
    </div>
  );
};

export default LoadingIndicator;
