import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import "bootstrap/dist/css/bootstrap.min.css";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import Login from "./login";
import Image from "next/image";
import { useState, useEffect } from "react";
const firebaseConfig = {
  apiKey: "AIzaSyBCD3-xGERFaOqnqtkWlYfu4sVBzQrVnWI",
  authDomain: "chat-app-83d51.firebaseapp.com",
  databaseURL:
    "https://chat-app-83d51-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "chat-app-83d51",
  storageBucket: "chat-app-83d51.appspot.com",
  messagingSenderId: "1074750144694",
  appId: "1:1074750144694:web:ac2b8753960f3d52796617",
  measurementId: "G-4N2WR6XD74",
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default function App({ Component, pageProps }: AppProps) {
  const [user] = useAuthState(auth);
  const [photoURL, setPhotoURL] = useState<any>(user?.photoURL);
  useEffect(() => {
    setPhotoURL(user?.photoURL);
  }, [user])
  const SignOut = () => {
    auth.signOut();
  }
  return user ? (
    <>
      <nav className="navbar navbar-expand-lg bg-light" style={{height: '56px'}}>
        <div className="container-fluid">
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
            {photoURL && <Image className="profile ms-3" alt="profile picture" width="50" height="50" src={photoURL} /> }
          </div>
        </div>
      </nav>
      <Component {...pageProps} />
    </>
  ) : (
    <Login />
  );
}
