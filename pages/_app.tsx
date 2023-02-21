import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import "bootstrap/dist/css/bootstrap.min.css";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import Login from "./login";

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
  return user ? (
    <>
      <Component {...pageProps} />
    </>
  ) : (
    <Login />
  );
}
