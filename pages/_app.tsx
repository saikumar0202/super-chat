import '@/styles/globals.css'
import type { AppProps } from 'next/app'
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBCD3-xGERFaOqnqtkWlYfu4sVBzQrVnWI",
  authDomain: "chat-app-83d51.firebaseapp.com",
  projectId: "chat-app-83d51",
  storageBucket: "chat-app-83d51.appspot.com",
  messagingSenderId: "1074750144694",
  appId: "1:1074750144694:web:ac2b8753960f3d52796617",
  measurementId: "G-4N2WR6XD74"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
