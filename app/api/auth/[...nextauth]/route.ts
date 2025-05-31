// auth.ts
import { authConfig } from "@/auth.config";
import NextAuth from "next-auth";


// Ensure session.strategy in authConfig is either "jwt" or "database", not a generic string
export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
