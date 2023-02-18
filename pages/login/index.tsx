import Link from "next/link";
import { useState } from "react";
import styles from "@/styles/Login.module.scss";
import Head from "next/head";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(`Email: ${email}, Password: ${password}`);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Login</title>
      </Head>
      <form
        className={`${styles.loginForm} p-5 rounded shadow bg-white`}
        onSubmit={handleSubmit}
      >
        <h1 className="mb-4">Login</h1>
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
        </div>
        <div className={`${styles.links} mt-3 d-flex justify-content-between`}>
          <Link href="/forgot-password">
            Forgot Password
          </Link>
          <Link href="/signup">
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
}
