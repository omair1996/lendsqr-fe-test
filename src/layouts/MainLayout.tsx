import type { ReactNode } from 'react';
import Sidebar from '../components/sidebar/SideBar';
import Navbar from '../components/navbar/Navbar';
import styles from './MainLayout.module.scss';

interface Props {
  children: ReactNode;
}
const MainLayout = ({ children }: Props) => {
  return (
    <div className={styles.layoutWrapper}>
      <Sidebar />
      <div className={styles.mainContent}>
        <Navbar />
        <div className={styles.pageContent}>{children}</div>
      </div>
    </div>
  );
};

export default MainLayout;
