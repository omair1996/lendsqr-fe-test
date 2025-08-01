import styles from './Navbar.module.scss';
import { Bell, ChevronDown, Search } from 'lucide-react';
import { useSearch } from '@/contexts/SearchContext';

const profilePicture = 'https://avatar.iran.liara.run/public';

export default function Navbar() {
  const { search, setSearch } = useSearch();

  return (
    <nav className={styles.navbar}>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search for anything"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />
        <button className={styles.searchBtn}>
          <Search size={16} color="#fff" />
        </button>
      </div>

      <div className={styles.right}>
        <a className={styles.docsLink} href="#">
          Docs
        </a>
        <Bell size={20} className={styles.bellIcon} />
        <img src={profilePicture} alt="Profile" width={32} height={32} className={styles.avatar} />
        <span className={styles.username}>Adedeji</span>
        <ChevronDown size={16} className={styles.chevronIcon} />
      </div>
    </nav>
  );
}
