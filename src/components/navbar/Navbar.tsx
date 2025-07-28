import styles from './Navbar.module.scss';
import { Bell, ChevronDown, Search } from 'lucide-react';
import { useState } from 'react';

const profilePicture = 'https://avatar.iran.liara.run/public';
const logo = 'https://res.cloudinary.com/omair1996/image/upload/v1753602119/logo_vizdby.png';

export default function Navbar() {
  const [search, setSearch] = useState('');
  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <img src={logo} alt="Lendsqr Logo" width={120} height={24} />
      </div>

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
