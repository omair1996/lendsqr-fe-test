import styles from './UserDashboard.module.scss';
import { useEffect, useState } from 'react';
import SummaryCards from '../SummaryCards/SummaryCards';
import { MoreVertical, ListFilter } from 'lucide-react';

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

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>
                Organization <ListFilter />
              </th>
              <th>
                Username <ListFilter />
              </th>
              <th>
                Email <ListFilter />
              </th>
              <th>
                Phone Number <ListFilter />
              </th>
              <th>
                Date Joined <ListFilter />
              </th>
              <th>
                Status <ListFilter />
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.organization}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{new Date(user.date_joined).toLocaleString()}</td>
                <td>
                  <span className={`${styles.status} ${styles[user.status.toLowerCase()]}`}>
                    {user.status}
                  </span>
                </td>
                <td>
                  <button className={styles.menuBtn}>
                    <MoreVertical />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
