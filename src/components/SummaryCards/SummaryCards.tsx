import styles from './SummaryCards.module.scss';
import { Users, UserCheck, Files, Coins } from 'lucide-react';
import type { User } from '@/types/User';

interface SummaryCardsProps {
  users: User[];
}

export default function SummaryCards({ users }: SummaryCardsProps) {
  const activeUsers = users.filter((u) => u.status.toLowerCase() === 'active').length;
  const usersWithLoans = users.filter((u) => u.hasLoan).length;
  const usersWithSavings = users.filter((u) => u.hasSavings).length;

  return (
    <div className={styles.cards} data-testid="summary-cards">
      <div className={styles.card} data-testid="total-users-card">
        <div className={styles.iconWrapper} style={{ color: '#DF18FF' }}>
          <Users size={24} data-testid="users-icon" />
        </div>
        <p>USERS</p>
        <h3 data-testid="total-users-count">{users.length.toLocaleString()}</h3>
      </div>
      <div className={styles.card} data-testid="active-users-card">
        <div className={styles.iconWrapper} style={{ color: '#5718FF' }}>
          <UserCheck size={24} data-testid="active-users-icon" />
        </div>
        <p>ACTIVE USERS</p>
        <h3 data-testid="active-users-count">{activeUsers.toLocaleString()}</h3>
      </div>
      <div className={styles.card} data-testid="loans-card">
        <div className={styles.iconWrapper} style={{ color: '#F55F44' }}>
          <Files size={24} data-testid="loans-icon" />
        </div>
        <p>USERS WITH LOANS</p>
        <h3 data-testid="loans-count">{usersWithLoans.toLocaleString()}</h3>
      </div>
      <div className={styles.card} data-testid="savings-card">
        <div className={styles.iconWrapper} style={{ color: '#FF3366' }}>
          <Coins size={24} data-testid="savings-icon" />
        </div>
        <p>USERS WITH SAVINGS</p>
        <h3 data-testid="savings-count">{usersWithSavings.toLocaleString()}</h3>
      </div>
    </div>
  );
}
