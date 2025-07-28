import type { ReactNode } from 'react';
import Sidebar from '../components/sidebar/SideBar';

interface Props {
  children: ReactNode;
}

const MainLayout = ({ children }: Props) => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
};

export default MainLayout;
