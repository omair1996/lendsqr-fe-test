import { useEffect, useRef, useState } from 'react';
import styles from './ActionMenu.module.scss';
import { MoreVertical, Eye, XCircle, CheckCircle } from 'lucide-react';
import type { User } from '@/types/User';

export default function ActionMenu({ user }: { user: User }) {
  const [show, setShow] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setShow((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShow(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const current = user.status.toLowerCase();
  const otherStatuses = ['active', 'inactive', 'blacklisted'].filter((s) => s !== current);

  return (
    <div className={styles.wrapper} ref={menuRef}>
      <button className={styles.trigger} onClick={toggleMenu}>
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
              <button className={styles.item} key={status}>
                <CheckCircle className={styles.icon} />
                Activate
              </button>
            ) : (
              <button className={styles.item} key={status}>
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
