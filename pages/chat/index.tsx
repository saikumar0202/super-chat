import { useEffect, useRef, useState } from "react";
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
import { useAuthState } from "react-firebase-hooks/auth";
import Image from "next/image";
import SideBar from "@/components/SideBar";
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
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesRef = collection(db, "messages");
  const q = query(messagesRef, orderBy("createdAt"));
  useEffect(() => {
    const unsubscribe = onSnapshot(q, (docs) => {
      setLoading(true);
      const tempMessages: Message[] = [];
      docs.forEach((doc) => {
        tempMessages.push(doc.data() as Message);
      });
      setMessages(tempMessages);
      setLoading(false);
    });
    return () => {
      unsubscribe();
    };
  }, []);
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
      });
      messagesEndRef?.current?.scrollIntoView({ behavior: "smooth" });
    }
  };
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className={`${styles.container} container`}>
      <SideBar />
      <div className="flex-fill">
        <div className="row flex-fill">
          <div className={`col-12 ${styles.messages}`}>
            {messages.map((message, index) => (
              <>
                {message.uid === auth.currentUser?.uid ? (
                  <div className="d-flex">
                    <div
                      key={index}
                      className={`${styles.message} ${styles.userMessage}`}
                    >
                      <p className={styles.text}>{message.text}</p>
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
                      className={`${styles.message} ${styles.receiverMessage}`}
                    >
                      <p className={styles.text}>{message.text}</p>
                    </div>
                  </div>
                )}
              </>
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
