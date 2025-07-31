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
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Load users from localStorage or fetch
  useEffect(() =>  feat-user-details
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

      {/* Desktop Table */}
      {!isMobile && (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                {[
                  'Organization',
                  'Username',
                  'Email',
                  'Phone Number',
                  'Date Joined',
                  'Status',
                  '',
                ].map((label) => (
                  <th key={label}>
                    {label}{' '}
                    {label && label !== '' && (
                      <ListFilter
                        className={styles.filterBtn}
                        onClick={() => setShowFilterModal(true)}
                      />
                    )}
                  </th>
                ))}
              </tr>
            </thead>

            {showFilterModal && (
              <FilterModal
                onClose={() => setShowFilterModal(false)}
                onApply={(filters) => {
                  setFilterValues(filters);
                  setShowFilterModal(false);
                }}
                onReset={() =>
                  setFilterValues({
                    organization: '',
                    username: '',
                    email: '',
                    date: '',
                    phone: '',
                    status: '',
                  })
                }
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
      )}

      {/* Mobile Card Layout */}
      {isMobile && (
        <div className={styles.mobileTable}>
          {paginatedUsers.map((user) => (
            <div className={styles.userCard} key={user.id}>
              <div>
                <span className={styles.label}>Organization:</span> {user.organization}
              </div>
              <div>
                <span className={styles.label}>Username:</span> {user.username}
              </div>
              <div>
                <span className={styles.label}>Email:</span> {user.email}
              </div>
              <div>
                <span className={styles.label}>Phone:</span> {user.phone}
              </div>
              <div>
                <span className={styles.label}>Date Joined:</span>{' '}
                {new Date(user.date_joined).toLocaleString()}
              </div>
              <div className={`${styles.status} ${styles[user.status.toLowerCase()]}`}>
                {user.status}
              </div>
              <div className={styles.actions}>
                <ActionMenu user={user} setUsers={setUsers} />
              </div>
            </div>
          ))}
        </div>
      )}

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
