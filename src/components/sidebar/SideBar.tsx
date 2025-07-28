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
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import styles from './Sidebar.module.scss';

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
      { icon: Users, label: 'Users', path: '/dashboard/users' },
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

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      <button className={styles.collapseBtn} onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
      </button>

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
  );
}
