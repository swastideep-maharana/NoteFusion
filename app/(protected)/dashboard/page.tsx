"use client";

import { useSession, signOut } from "next-auth/react";

export default function Dashboard() {
  const { data: session, status } = useSession({ required: true });

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h1>Dashboard</h1>
      <p>Welcome, {session?.user?.name || session?.user?.email}!</p>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
}
