// app/(auth)/sign-in/page.tsx or pages/signin.tsx

"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";

export default function SignInPage() {
  const { data: session } = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (session) {
    return (
      <div>
        <h2>Welcome, {session.user?.name || session.user?.email}</h2>
        <button onClick={() => signOut()}>Sign Out</button>
      </div>
    );
  }

  async function handleCredentialsSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (res?.error) {
      setError(res.error);
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h1>Sign In</h1>

      <form onSubmit={handleCredentialsSignIn}>
        <div>
          <label>Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>

        <div style={{ marginTop: 10 }}>
          <label>Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>

        {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}

        <button type="submit" style={{ marginTop: 20 }}>
          Sign In with Credentials
        </button>
      </form>

      <hr style={{ margin: "30px 0" }} />

      <button
        onClick={() => signIn("github")}
        style={{ width: "100%", marginBottom: 10 }}
      >
        Sign In with GitHub
      </button>
      <button onClick={() => signIn("google")} style={{ width: "100%" }}>
        Sign In with Google
      </button>
    </div>
  );
}
