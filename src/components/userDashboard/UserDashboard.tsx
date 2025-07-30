import styles from './UserDashboard.module.scss';
import { useEffect, useState } from 'react';
import SummaryCards from '../SummaryCards/SummaryCards';
import { MoreVertical, ListFilter } from 'lucide-react';
import Pagination from '../pagination/Pagination';
import type { User } from '@/types/User';
import FilterModal from '../filterModal/FilterModal';

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
    fetch('/mock/users.json')
      .then((res) => res.json())
      .then(setUsers);
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
                  <button className={styles.menuBtn}>
                    <MoreVertical />
                  </button>
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
