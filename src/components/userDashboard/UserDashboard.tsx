import styles from './UserDashboard.module.scss';
import { useEffect, useState } from 'react';
import SummaryCards from '../SummaryCards/SummaryCards';
import { ListFilter } from 'lucide-react';
import Pagination from '../pagination/Pagination';
import type { User } from '@/types/User';
import FilterModal from '../filterModal/FilterModal';
import ActionMenu from '../actionMenu/ActionMenu';
import { setWithExpiry, cleanupExpiredLocalStorage, getWithExpiry } from '@/lib/utils';

type FilterValues = {
  organization?: string;
  username?: string;
  email?: string;
  date?: string;
  phone?: string;
  status?: string;
};

export default function UserDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterValues, setFilterValues] = useState<FilterValues>({});

  useEffect(() => {
    const loadUsers = () => {
      cleanupExpiredLocalStorage();
      const savedUsers = getWithExpiry<User[]>('users');
      if (savedUsers) {
        setUsers(savedUsers);
      } else {
        fetch('/mock/users.json')
          .then((res) => res.json())
          .then((data) => {
            setUsers(data);
            setWithExpiry('users', data, 1000 * 60 * 60);
          });
      }
    };

    loadUsers();

    // Add storage event listener
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'users') {
        loadUsers();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const filteredUsers = users.filter((user) => {
    return (
      (!filterValues.organization || user.organization.includes(filterValues.organization)) &&
      (!filterValues.username || user.username.includes(filterValues.username)) &&
      (!filterValues.email || user.email.includes(filterValues.email)) &&
      (!filterValues.date || user.date_joined.includes(filterValues.date)) &&
      (!filterValues.phone || user.phone.includes(filterValues.phone)) &&
      (!filterValues.status || user.status.toLowerCase() === filterValues.status.toLowerCase())
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));
  const startIdx = (page - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIdx, endIdx);

  useEffect(() => {
    setPage(1);
  }, [itemsPerPage]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [totalPages, page]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Users</h2>
      <SummaryCards users={users} />

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>
                Organization{' '}
                <ListFilter className={styles.filterBtn} onClick={() => setShowFilterModal(true)} />
              </th>
              <th>
                Username{' '}
                <ListFilter className={styles.filterBtn} onClick={() => setShowFilterModal(true)} />
              </th>
              <th>
                Email{' '}
                <ListFilter className={styles.filterBtn} onClick={() => setShowFilterModal(true)} />
              </th>
              <th>
                Phone Number{' '}
                <ListFilter className={styles.filterBtn} onClick={() => setShowFilterModal(true)} />
              </th>
              <th>
                Date Joined{' '}
                <ListFilter className={styles.filterBtn} onClick={() => setShowFilterModal(true)} />
              </th>
              <th>
                Status{' '}
                <ListFilter className={styles.filterBtn} onClick={() => setShowFilterModal(true)} />
              </th>
              <th></th>
            </tr>
          </thead>
          {showFilterModal && (
            <FilterModal
              onClose={() => setShowFilterModal(false)}
              onApply={(filters) => {
                setFilterValues(filters);
                setShowFilterModal(false);
              }}
              onReset={() => {
                setFilterValues({
                  organization: '',
                  username: '',
                  email: '',
                  date: '',
                  phone: '',
                  status: '',
                });
              }}
              values={filterValues}
              setValues={setFilterValues}
            />
          )}

          <tbody>
            {paginatedUsers.map((user) => (
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
                  <ActionMenu user={user} setUsers={setUsers} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={setItemsPerPage}
      />
    </div>
  );
}
