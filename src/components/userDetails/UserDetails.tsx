import styles from './UserDetails.module.scss';
import { ArrowLeft } from 'lucide-react';
import type { User } from '@/types/User';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  user: User;
}

export default function UserDetails({ user: initialUser }: Props) {
  const [user, setUser] = useState(initialUser);

  const { profile, education, socials, guarantor, username, email, phone, status } = user;

  const current = status.toLowerCase();
  const otherStatuses = ['active', 'inactive', 'blacklisted'].filter((s) => s !== current);
  const navigate = useNavigate();

  const handleStatusChange = (newStatus: string) => {
    const updatedUser = { ...user, status: newStatus };
    setUser(updatedUser);

    localStorage.setItem('selectedUser', JSON.stringify(updatedUser));

    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      const parsedUsers: User[] = JSON.parse(savedUsers);
      const updatedUsers = parsedUsers.map((u) => (u.id === updatedUser.id ? updatedUser : u));
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    }

    console.log('Saved to localStorage:', updatedUser);
  };

  return (
    <div className={styles.wrapper}>
      {/* Header */}
      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        <ArrowLeft size={18} /> Back to Users
      </button>
      <div className={styles.header}>
        <h3>User Details</h3>
        <div className={styles.actions}>
          {otherStatuses.map((s) => {
            const label = s.charAt(0).toUpperCase() + s.slice(1);
            const className =
              s === 'active'
                ? styles.activate
                : s === 'inactive'
                ? styles.inactive
                : styles.blacklist;

            return (
              <button key={s} className={className} onClick={() => handleStatusChange(label)}>
                {label} User
              </button>
            );
          })}
        </div>
      </div>

      {/* User Summary Card */}
      <div className={styles.summaryCard}>
        <div className={styles.avatar}>
          <img src={profile.avatar} alt={profile.full_name} />
        </div>
        <div>
          <h3>{profile.full_name}</h3>
          <p>{username}</p>
        </div>
        <div className={styles.stars}>
          <p>User’s Tier</p>
          <span>{'⭐️'.repeat(profile.tier)}</span>
        </div>

        <div className={styles.accountDetails}>
          <h3>
            ₦
            {Number(profile.account_balance.replace(/[₦,]/g, '')).toLocaleString('en-NG', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h3>
          <p>
            {profile.account_number} / {profile.bank_name}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <span className={styles.active}>General Details</span>
        <span>Documents</span>
        <span>Bank Details</span>
        <span>Loans</span>
        <span>Savings</span>
        <span>App and System</span>
      </div>

      {/* Details */}
      <div className={styles.detailsGrid}>
        {/* Personal Info */}
        <section className={styles.Personal}>
          <h4>Personal Information</h4>
          <div className={styles.infoRow}>
            <div>
              <p>Full Name</p>
              <h5>{profile.full_name}</h5>
            </div>
            <div>
              <p>Phone Number</p>
              <h5>{phone}</h5>
            </div>
            <div>
              <p>Email Address</p>
              <h5>{email}</h5>
            </div>
            <div>
              <p>BVN</p>
              <h5>{profile.bvn}</h5>
            </div>
            <div>
              <p>Gender</p>
              <h5>{profile.gender}</h5>
            </div>
            <div>
              <p>Marital Status</p>
              <h5>{profile.marital_status}</h5>
            </div>
            <div>
              <p>Children</p>
              <h5>{profile.children}</h5>
            </div>
            <div>
              <p>Type of Residence</p>
              <h5>{profile.residence}</h5>
            </div>
          </div>
        </section>

        {/* Education */}
        <section>
          <h4>Education and Employment</h4>
          <div className={styles.infoRow}>
            <div>
              <p>Level of Education</p>
              <h5>{education.level}</h5>
            </div>
            <div>
              <p>Employment Status</p>
              <h5>{education.status}</h5>
            </div>
            <div>
              <p>Sector of Employment</p>
              <h5>{education.sector}</h5>
            </div>
            <div>
              <p>Duration of Employment</p>
              <h5>{education.duration}</h5>
            </div>
            <div>
              <p>Office Email</p>
              <h5>{education.office_email}</h5>
            </div>
            <div>
              <p>Monthly Income</p>
              <h5>
                ₦{Number(education.monthly_income[0]).toLocaleString()} - ₦
                {Number(education.monthly_income[1]).toLocaleString()}
              </h5>
            </div>
            <div>
              <p>Loan Repayment</p>
              <h5>₦{Number(education.loan_repayment).toLocaleString()}</h5>
            </div>
          </div>
        </section>

        {/* Socials */}
        <section>
          <h4>Socials</h4>
          <div className={styles.infoRow}>
            <div>
              <p>Twitter</p>
              <h5>{socials.twitter}</h5>
            </div>
            <div>
              <p>Facebook</p>
              <h5>{socials.facebook}</h5>
            </div>
            <div>
              <p>Instagram</p>
              <h5>{socials.instagram}</h5>
            </div>
          </div>
        </section>

        {/* Guarantors */}
        <section>
          <h4>Guarantor</h4>
          {guarantor.map((g, i) => (
            <div key={i} className={styles.infoRow}>
              <div>
                <p>Full Name</p>
                <h5>{g.name}</h5>
              </div>
              <div>
                <p>Phone Number</p>
                <h5>{g.phone}</h5>
              </div>
              <div>
                <p>Email Address</p>
                <h5>{g.email}</h5>
              </div>
              <div>
                <p>Relationship</p>
                <h5>{g.relationship}</h5>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
