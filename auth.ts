import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Validate against environment variables
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        console.log("Auth attempt:", { 
          providedEmail: credentials?.email, 
          envEmail: adminEmail,
          passwordMatch: credentials?.password === adminPassword
        });

        if (
          credentials?.email === adminEmail &&
          credentials?.password === adminPassword
        ) {
          console.log("Auth successful");
          return {
            id: "admin",
            email: adminEmail as string,
            name: "Admin",
            role: "admin",
          };
        }

        console.log("Auth failed - credentials do not match");
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = "admin";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
});
