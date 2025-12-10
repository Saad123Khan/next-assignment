import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { upsertUser, findUserByEmail } from "@/lib/db";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  callbacks: {
   async signIn({ user, account, query }) {
    
  const selectedRole = query?.role || "admin";

  await upsertUser({
    email: user.email,
    name: user.name,
    image: user.image,
    provider: account.provider,
    providerAccountId: account.providerAccountId,
    role: selectedRole,
  });

  return true; 
},
  async jwt({ token, trigger }) {

    // When session update triggered
    if (trigger === "update") {
      const dbUser = await findUserByEmail(token.email)
      token.roles = dbUser.roles
    }

    // Normal login
    if (token?.email) {
      const dbUser = await findUserByEmail(token.email)
      token.id = dbUser.id
      token.roles = dbUser.roles
    }

    return token
  },


    async session({ session, token }) {
    console.log("🚀 ~ token:", token)

        console.log(session , "fff")
      session.user.id = token.id;
      session.user.roles = token.roles || [];
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
