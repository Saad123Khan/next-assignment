"use client";

import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Navbar(session) {
  const {status } = useSession();
  console.log(session,"navbar sessionnavbar session")

  return (
    <nav style={styles.nav}>
      <div style={styles.left}>
        <Link href="/" style={styles.link}>
          Home
        </Link>

        {session?.user?.roles?.includes("admin") && (
          <Link href="/admin" style={styles.link}>
            Admin
          </Link>
        )}

        {session?.user?.roles?.includes("editor") && (
          <Link href="/editor" style={styles.link}>
            Editor
          </Link>
        )}

        {session && (
          <Link href="/profile" style={styles.link}>
            Profile
          </Link>
        )}

        {session && (
          <Link href="/dashboard" style={styles.link}>
            Dashboard
          </Link>
        )}
      </div>

      <div style={styles.right}>
        {status === "loading" ? null : session?.user  ? (
          <>
            <span style={styles.user}>{session?.user?.name}</span>
            <button style={styles.btn} onClick={() => signOut()}>
              Logout
            </button>
          </>
        ) : (
          <button style={styles.btn} onClick={() => signIn()}>
            Login
          </button>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 24px",
    borderBottom: "1px solid #ddd",
    backgroundColor: "#fff",
  },
  left: {
    display: "flex",
    gap: "16px",
    alignItems: "center",
  },
  right: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
  },
  link: {
    textDecoration: "none",
    color: "#333",
    fontWeight: "500",
  },
  user: {
    fontSize: "14px",
    color: "#444",
  },
  btn: {
    padding: "6px 12px",
    border: "1px solid #333",
    background: "#fff",
    cursor: "pointer",
  },
};
