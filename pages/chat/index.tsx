import { useEffect, useRef, useState } from "react";
import styles from "@/styles/chat.module.scss";

interface Message {
  content: string;
  sender: string;
}

export default function ChatUI() {
  const [messages, setMessages] = useState<Message[]>([
    {content: "messageInput", sender: "suser"}
  ]);
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleMessageSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (messageInput !== "") {
      setMessages([...messages, { content: messageInput, sender: "user" }]);
      setMessageInput("");
      console.log(messagesEndRef);
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
      <div className="row flex-fill">
        <div className={`col-12 ${styles.messages}`}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`${styles.message} ${
                message.sender === "user"
                  ? styles.userMessage
                  : styles.receiverMessage
              }`}
            >
              <p className={styles.text}>{message.content}</p>
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
  );
}
