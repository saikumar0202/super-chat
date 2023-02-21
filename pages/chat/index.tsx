import { MutableRefObject, useEffect, useRef, useState } from "react";
import styles from "@/styles/chat.module.scss";
import {
  collection,
  where,
  getDocs,
  getFirestore,
  setDoc,
  doc,
  addDoc,
  onSnapshot,
  DocumentData,
  query,
  orderBy,
} from "firebase/firestore";
import { db, auth } from "../_app";
import Image from "next/image";
import SideBar from "@/components/SideBar";
import { useMediaQuery } from 'react-responsive'
import { transform } from "typescript";
interface Message {
  text: string;
  createdAt: Date;
  photoURL: string;
  from: string;
  uid: string;
}
export default function ChatUI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedChatUID, setSelectedChatUID] = useState('');
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesRef = collection(db, "messages");
  const [photoURL, setPhotoURL] = useState<any>(auth?.currentUser?.photoURL);
  const isMobile = useMediaQuery({ maxWidth: 768 })
  const sidebarRef = useRef<HTMLInputElement | null>(null)
  const chatRef = useRef<HTMLInputElement | null>(null)

  const [isSideNavOpen, setSideNavOpen] = useState(false);
  useEffect(() => {
    setPhotoURL(auth?.currentUser?.photoURL);
  }, [auth?.currentUser]);

  const SignOut = () => {
    auth.signOut();
  }
  useEffect(() => {
    console.log(sidebarRef.current , chatRef.current)
    console.log(isMobile , isSideNavOpen)
    if (isMobile && sidebarRef.current && chatRef.current) {
      if (isSideNavOpen) {
        // sidebarRef.current.style.animation = "width"
        // sidebarRef.current.style.animationDuration = "0.5s"
        sidebarRef.current.style.width = '300px'
        sidebarRef.current.style.overflow = 'initial'
        // chatRef.current.style.transform = 'translateX(0px)'
        // sidebarRef.current.style.transform = 'translateX(0px)'
        // chatRef.current.style.transform = 'translateX(0px)'
      } else {
        sidebarRef.current.style.width = '0px'
        sidebarRef.current.style.overflow = 'hidden'
        // chatRef.current.style.transform = 'translateX(-300px)'
        // sidebarRef.current.style.transform = 'translateX(-300px)'
        // chatRef.current.style.transform = 'translateX(-300px)'
      }
    } else if (sidebarRef.current && chatRef.current) {
      sidebarRef.current.style.width = '300px'
        sidebarRef.current.style.overflow = 'initial'
    }
  }, [isMobile, isSideNavOpen])
  useEffect(() => {
    const q = query(
      messagesRef,
      orderBy("createdAt"),
      where('uid', 'in', [auth.currentUser?.uid, selectedChatUID])
    );
    // const q = query(
    //   messagesRef,
    //   where('uid', '==', auth.currentUser?.uid)
    // );
    const unsubscribe = onSnapshot(q, (docs) => {
      setLoading(true);
      let tempMessages: any[] = docs.docs.filter((doc) => {
        const { from, to } = doc.data();
        if (
          (from === auth.currentUser?.uid &&
            to === selectedChatUID) ||
          (to === auth.currentUser?.uid &&
            from === selectedChatUID)
        ) {
          return true;
        }
        return false
      });
      tempMessages = tempMessages.map((doc) => {
        const tempDoc = doc.data();
        const date = new Date(tempDoc.createdAt.seconds * 1000 + tempDoc.createdAt.nanoseconds / 1000000);
        return { ...tempDoc, createdAt: date }
      });
      console.log(tempMessages)
      setMessages(tempMessages);
      setLoading(false);
    });
    return () => {
      unsubscribe();
    };
  }, [selectedChatUID]);
  // const messages = docsSnapshot.docs.map(change => change.data())
  const handleMessageSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    if (messageInput !== "") {
      setMessageInput("");
      await addDoc(messagesRef, {
        text: messageInput,
        createdAt: new Date(),
        from: auth?.currentUser?.uid,
        photoURL: auth?.currentUser?.photoURL,
        uid: auth.currentUser?.uid,
        to: selectedChatUID
      });
      messagesEndRef?.current?.scrollIntoView({ behavior: "smooth" });
    }
  };
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  const getTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    const ampm = date.getHours() / 12 > 1 ? ' pm' : ' am';
    return hours + ':' + minutes + ampm;
  }
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-light" style={{ height: '56px' }}>
        <div className="container-fluid">
          {isMobile && <button className="btn fs-3" onClick={() => setSideNavOpen((prevState) => !prevState)}><i className="fa-solid fa-bars lh-1"></i></button>}
          <a className="navbar-brand" href="#">
            Super Chat
          </a>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item" hidden>
                <a className="nav-link active" aria-current="page" href="#">
                  Home
                </a>
              </li>
            </ul>
            <button className="btn btn-outline-success" type="button" onClick={SignOut}>
              Sign Out
            </button>
            {photoURL && <Image className="profile ms-3" alt="profile picture" width="50" height="50" src={photoURL} />}
          </div>
        </div>
      </nav>
      <div className={`${styles.container} container-fluid`}>
        <div id="sidebar" ref={sidebarRef}>
          <SideBar selectedChatUID={selectedChatUID} setSelectedChatUID={setSelectedChatUID} />
        </div>
        <div className="flex-fill" id="chatBody" style={{
          minWidth: 300
        }} ref={chatRef}>
          <div className="row flex-fill">
            <div className={`col-12 ${styles.messages}`}>
              {messages?.map((message, index) => (
                <div key={index}>
                  {message.uid === auth.currentUser?.uid ? (
                    <div className="d-flex">
                      <div
                        key={index}
                        className={`${styles.message} ${styles.userMessage} position-relative`}
                      >
                        <p className={styles.text}>{message.text}</p>
                        <small className={styles.timestamp}>{getTime(message.createdAt)}</small>
                      </div>
                      <Image
                        alt="profile picture"
                        src={message.photoURL}
                        className="profile ms-2"
                        width="40"
                        height="40"
                      />
                    </div>
                  ) : (
                    <div className="d-flex">
                      <Image
                        alt="profile picture"
                        src={message.photoURL}
                        className="profile me-2"
                        width="40"
                        height="40"
                      />
                      <div
                        key={index}
                        className={`${styles.message} ${styles.receiverMessage} position-relative`}
                      >
                        <p className={styles.text}>{message.text}</p>
                        <small className={styles.timestamp}>{getTime(message.createdAt)}</small>

                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef}></div>
            </div>
          </div>
          <div className={styles.inputWrapper}>
            <div className="w-100">
              <form className={styles.form} onSubmit={handleMessageSubmit}>
                <input
                  type="text"
                  className={`${styles.input} form-control`}
                  spellCheck="true"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type a message"
                />
                <button type="submit" className={styles.sendButton}>
                  <i className="fa-regular fa-paper-plane"></i>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
// export async function getServerSideProps() {
//   const messagesRef = collection(db, "messages");

//   return {
//     props: {
//       messages: JSON.parse(JSON.stringify(messages)),
//     },
//   };
// }
