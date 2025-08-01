import {
  Briefcase,
  Home,
  Users,
  UserPlus,
  Landmark,
  Coins,
  ShieldCheck,
  PiggyBank,
  HandCoins,
  UserMinus,
  Building2,
  FileText,
  Receipt,
  Repeat,
  Settings,
  Tags,
  ScrollText,
  ChevronDown,
  ChevronUp,
  Menu,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import styles from './Sidebar.module.scss';
import { useEffect } from 'react';
const logo = 'https://res.cloudinary.com/omair1996/image/upload/v1753602119/logo_vizdby.png';

type SidebarItem = {
  icon: React.ElementType;
  label: string;
  path?: string;
  isOrgSwitcher?: boolean;
};

type SidebarGroup = {
  section: string | null;
  items: SidebarItem[];
};

const sidebarItems: SidebarGroup[] = [
  {
    section: null,
    items: [{ icon: Briefcase, label: 'Switch Organization', isOrgSwitcher: true }],
  },
  {
    section: null,
    items: [{ icon: Home, label: 'Dashboard' }],
  },
  {
    section: 'CUSTOMERS',
    items: [
      { icon: Users, label: 'Users', path: '/dashboard/user' },
      { icon: UserPlus, label: 'Guarantors' },
      { icon: Landmark, label: 'Loans' },
      { icon: Coins, label: 'Decision Models' },
      { icon: PiggyBank, label: 'Savings' },
      { icon: HandCoins, label: 'Loan Requests' },
      { icon: UserMinus, label: 'Whitelist' },
      { icon: ShieldCheck, label: 'Karma' },
    ],
  },
  {
    section: 'BUSINESSES',
    items: [
      { icon: Briefcase, label: 'Organization' },
      { icon: Landmark, label: 'Loan Products' },
      { icon: PiggyBank, label: 'Savings Products' },
      { icon: Coins, label: 'Fees and Charges' },
      { icon: FileText, label: 'Transactions' },
      { icon: Repeat, label: 'Services' },
      { icon: Users, label: 'Service Account' },
      { icon: Receipt, label: 'Settlements' },
      { icon: Building2, label: 'Reports' },
    ],
  },
  {
    section: 'SETTINGS',
    items: [
      { icon: Settings, label: 'Preferences' },
      { icon: Tags, label: 'Fees and Pricing' },
      { icon: ScrollText, label: 'Audit Logs' },
    ],
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      const isNowMobile = window.innerWidth <= 768;
      setIsMobile(isNowMobile);
      if (isNowMobile) {
        setCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return (
    <>
      {isMobile && collapsed && (
        <button className={styles.menuBtn} onClick={() => setCollapsed(false)}>
          <Menu size={24} />
        </button>
      )}
      <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <img src={logo} alt="Lendsqr Logo" width={120} height={24} />
          </div>
          <button className={styles.collapseBtn} onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
          </button>
        </div>

        {sidebarItems.map((group, i) => (
          <div key={i} className="">
            {group.section && <p className={styles.sidebarSection}>{group.section}</p>}
            {group.items.map(({ icon: Icon, label, path, isOrgSwitcher }) =>
              path ? (
                <NavLink
                  to={path}
                  key={label}
                  className={({ isActive }) =>
                    `${styles.sidebarItem} ${isActive ? styles.active : ''} ${
                      isOrgSwitcher ? styles.orgSwitch : ''
                    }`
                  }
                >
                  <Icon size={16} />
                  {!collapsed && <span>{label}</span>}
                </NavLink>
              ) : (
                <div
                  key={label}
                  className={`${styles.sidebarItem} ${isOrgSwitcher ? styles.orgSwitch : ''}`}
                >
                  <Icon size={16} />
                  {!collapsed && <span>{label}</span>}
                </div>
              )
            )}
          </div>
        ))}
      </aside>
    </>
  );
}
