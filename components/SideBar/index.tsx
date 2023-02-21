import styles from '@/styles/sidebar.module.scss'
import Image from 'next/image';

export default function SideBar() {
  return (
    <div className={styles.sidebarContaier}>
      <ul className={styles.usersList}>
        <li className={styles.usersListItem}>
          <Image alt='profile picture' width="40" className="profile" height="40" src="https://lh3.googleusercontent.com/a/AEdFTp5dqb8dEaXZavmhvqQDhpax1x3jT5jb0KU2U9-Aojc=s96-c" />
          <div className={styles.displayName}>Anapuram Sai Kumar</div>
        </li>
      </ul>
    </div>
  );
}