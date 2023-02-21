import { auth, db } from '@/pages/_app';
import styles from '@/styles/sidebar.module.scss'
import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive'
interface Friend {
  lastLogin: Date,
  friends: string[],
  email: string,
  photoURL: string,
  uid: string,
  displayName: string
}
interface SideBarProps {
  setSelectedChatUID: Function,
  selectedChatUID: string
}
export default function SideBar(props: SideBarProps) {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const { setSelectedChatUID, selectedChatUID } = props;
  const userRef = collection(db, 'users');
  const [friends, setFriends] = useState<Friend[]>([]);
  const getByUID = query(userRef, where('uid', '==', auth.currentUser?.uid), limit(1));
  useEffect(() => {
    (async () => {
      await getDocs(getByUID).then(async (users) => {
        const currentUserFriends = users?.docs[0]?.data().friends;
        if (currentUserFriends?.length > 0) {
          const getByFriendsUID = query(userRef, where('uid', 'in', currentUserFriends), where('uid', '!=', auth.currentUser?.uid));
          await getDocs(getByFriendsUID).then(frds => {
            let tempFriends: Friend[] = [];
            frds.forEach(frd => {
              tempFriends.push(frd.data() as Friend)
            })
            setFriends(tempFriends);
            console.log(tempFriends)
          })
        }
      })
    })()
  }, [])
  const selectFriend = (uid: string) => {
    setSelectedChatUID(uid);
  }
  return (
    <div className={styles.sidebarContaier}>
      <ul className={styles.usersList}>
        {friends.map((friend) => (
          <li className={`${styles.usersListItem} ${friend.uid === selectedChatUID && styles.active}`} onClick={() => selectFriend(friend.uid)}>
            <Image alt='profile picture' width="40" className="profile" height="40" src={friend.photoURL} />
            <div className={styles.displayName}>{friend.displayName}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}