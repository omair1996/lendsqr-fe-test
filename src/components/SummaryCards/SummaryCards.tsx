import styles from './SummaryCards.module.scss';
import { Users, UserCheck, Files, Coins } from 'lucide-react';
import type { User } from '@/types/User';

interface SummaryCardsProps {
  users: User[];
}
export default function SummaryCards({ users }: SummaryCardsProps) {
  return (
    <div className={styles.cards}>
      <div className={styles.card}>
        <Users color="#DF18FF" size={24} />
        <p>USERS</p>
        <h3>{users.length.toLocaleString()}</h3>
      </div>
      <div className={styles.card}>
        <UserCheck color="#5718FF" size={24} />
        <p>ACTIVE USERS</p>
        <h3>{users.filter((u) => u.status.toLowerCase() === 'active').length.toLocaleString()}</h3>
      </div>
      <div className={styles.card}>
        <Files color="#F55F44" size={24} />
        <p>USERS WITH LOANS</p>
        <h3>{users.filter((u) => u.hasLoan).length.toLocaleString()}</h3>
      </div>
      <div className={styles.card}>
        <Coins color="#FF3366" size={24} />
        <p>USERS WITH SAVINGS</p>
        <h3>{users.filter((u) => u.hasSavings).length.toLocaleString()}</h3>
      </div>
    </div>
  );
}
