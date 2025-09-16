import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // Optional: Call your Flask backend to record user
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.email,
            name: user.name,
            image: user.image,
          }),
        });
      } catch (err) {
        console.error("Failed to sync user to backend:", err);
      }
      return true; // allow sign-in
    },
  },
});

export { handler as GET, handler as POST };
