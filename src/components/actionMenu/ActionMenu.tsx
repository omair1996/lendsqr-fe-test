import { useEffect, useRef, useState } from 'react';
import styles from './ActionMenu.module.scss';
import { MoreVertical, Eye, XCircle, CheckCircle } from 'lucide-react';
import type { User } from '@/types/User';

export default function ActionMenu({
  user,
  setUsers,
}: {
  user: User;
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}) {
  const [show, setShow] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleStatusChange = (newStatus: string) => {
    setUsers((prevUsers) =>
      prevUsers.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u))
    );
    setShow(false);
  };

  const current = user.status.toLowerCase();
  const otherStatuses = ['active', 'inactive', 'blacklisted'].filter((s) => s !== current);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShow(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.wrapper} ref={menuRef}>
      <button className={styles.trigger} onClick={() => setShow((prev) => !prev)}>
        <MoreVertical />
      </button>

      {show && (
        <div className={styles.menu}>
          <button className={styles.item}>
            <Eye className={styles.icon} />
            View Details
          </button>

          {otherStatuses.map((status) =>
            status === 'active' ? (
              <button
                className={styles.item}
                key={status}
                onClick={() => handleStatusChange('Active')}
              >
                <CheckCircle className={styles.icon} />
                Activate
              </button>
            ) : (
              <button
                className={styles.item}
                key={status}
                onClick={() => handleStatusChange(status.charAt(0).toUpperCase() + status.slice(1))}
              >
                <XCircle className={styles.icon} />
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}
