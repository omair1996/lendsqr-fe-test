import styles from './Navbar.module.scss';
import { Bell, ChevronDown, Search } from 'lucide-react';
import { useSearch } from '@/contexts/SearchContext';

interface NavbarProps {
  profilePicture?: string;
  username?: string;
}

const defaultProfilePicture = 'https://avatar.iran.liara.run/public';

export default function Navbar({
  profilePicture = defaultProfilePicture,
  username = 'Adedeji',
}: NavbarProps) {
  const { search, setSearch } = useSearch();

  return (
    <nav className={styles.navbar} data-testid="navbar">
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search for anything"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
          aria-label="Search input"
          data-testid="search-input"
        />
        <button className={styles.searchBtn} aria-label="Search" data-testid="search-button">
          <Search size={16} color="#fff" />
        </button>
      </div>

      <div className={styles.right} data-testid="navbar-right-section">
        <a className={styles.docsLink} href="#" data-testid="docs-link">
          Docs
        </a>
        <Bell
          size={20}
          className={styles.bellIcon}
          aria-label="Notifications"
          data-testid="notifications-icon"
        />
        <img
          src={profilePicture}
          alt={`${username}'s profile`}
          width={32}
          height={32}
          className={styles.avatar}
          data-testid="profile-picture"
        />
        <span className={styles.username} data-testid="username">
          {username}
        </span>
        <ChevronDown
          size={16}
          className={styles.chevronIcon}
          aria-label="User menu"
          data-testid="user-menu-icon"
        />
      </div>
    </nav>
  );
}
