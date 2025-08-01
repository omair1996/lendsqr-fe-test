import styles from './LoadingIndicator.module.scss';

const LoadingIndicator = () => {
  return (
    <div className={styles.loaderWrapper} role="status" aria-live="polite">
      <div className={styles.spinner} aria-hidden="true"></div>
    </div>
  );
};

export default LoadingIndicator;
