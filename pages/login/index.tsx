import Link from "next/link";
import { useState } from "react";
import styles from "@/styles/Login.module.scss";
import Head from "next/head";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { db } from "../_app";
import backgroundImage from "@/public/img/login-bg.jpg";
import {
  addDoc,
  collection,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import Image from "next/image";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const userRef = collection(db, "users");
  // const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   console.log(`Email: ${email}, Password: ${password}`);
  // };
  const SignIn = () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(async (res) => {
        // displayName , photoURL, email, uid, friends, lastLogin
        const { user } = res;
        const getByUID = query(userRef, where("uid", "==", res.user.uid));
        const currentUser = await getDocs(getByUID);
        if (currentUser.size === 0) {
          await addDoc(userRef, {
            displayName: user.displayName,
            photoURL: user.photoURL,
            email: user.email,
            uid: user.uid,
            friends: [],
            lastLogin: new Date(),
          });
        }
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Login</title>
      </Head>
      <div className={styles.loginBackground}>
      <div className={styles.loginBackgroundContainer}>
        {/* <Image
          width="2000"
          height="2000"
          style={{
            width: "auto",
            height: "100vh",
            position: 'absolute',
            zIndex: 0
          }}
          alt="background image"
          src={backgroundImage}
        /> */}
      </div>
      </div>
      {/* <form className={`${styles.loginForm} p-5 rounded shadow`}> */}
      {/* <h1 className="mb-4">Login</h1>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="d-flex justify-content-center">
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </div> */}
      {/* <div className="google-btn">
          <div className="google-icon-wrapper">
            <img
              className="google-icon"
              src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
            />
          </div>
          <p className="btn-text">
            <b>Sign in with google</b>
          </p>
        </div> */}
      <div
        className={`${styles.loginForm} d-flex justify-content-center shodow`}
      >
        <button
          type="submit"
          className="btn bg-transparent text-dark"
          onClick={SignIn}
        >
          <img
            className="google-icon"
            src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
          />{" "}
          Sign in with Google
        </button>
      </div>
      {/* <div className={`${styles.links} mt-3 d-flex justify-content-between`}>
          <Link href="/forgot-password">
            Forgot Password
          </Link>
          <Link href="/signup">
            Sign up
          </Link>
        </div> */}
      {/* </form> */}
    </div>
  );
}
