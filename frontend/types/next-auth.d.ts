// types/next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

// Extend the default User type
declare module "next-auth" {
  interface Session {
    user: {
      userId: number; // your backend userId
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    userId: number; // added to User object
  }

  interface JWT {
    userId?: number; // added to JWT
  }
}
