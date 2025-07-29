import styles from './UserDashboard.module.scss';
import { useEffect, useState } from 'react';
import SummaryCards from '../SummaryCards/SummaryCards';

interface User {
  id: string;
  organization: string;
  username: string;
  email: string;
  phone: string;
  date_joined: string;
  status: string;
  profile: { avatar: string };
  hasLoan: boolean;
  hasSavings: boolean;
}

export default function UserDashboard() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch('/mock/users.json')
      .then((res) => res.json())
      .then(setUsers);
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Users</h2>
      <SummaryCards users={users} />
    </div>
  );
}
