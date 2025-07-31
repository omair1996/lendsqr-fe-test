import React from 'react';
import { SearchProvider } from '../contexts/SearchContext';
import Sidebar from '../components/sidebar/SideBar';
import Navbar from '../components/navbar/Navbar';
import styles from './MainLayout.module.scss';

interface Props {
  children: React.ReactNode;
}

const MainLayout = ({ children }: Props) => {
  return (
    <SearchProvider>
      <div className={styles.layoutWrapper}>
        <Sidebar />
        <div className={styles.mainContent}>
          <Navbar />
          <div className={styles.pageContent}>{children}</div>
        </div>
      </div>
    </SearchProvider>
  );
};

export default MainLayout;
