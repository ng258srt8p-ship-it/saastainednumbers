import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import type { Provider } from "next-auth/providers/index";

const providers: Provider[] = [];

if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  providers.push(Google);
}

if (process.env.AUTH_RESEND_KEY) {
  providers.push(Resend({ from: "noreply@saastainednumbers.com" }));
}

providers.push(
  Credentials({
    id: "admin",
    name: "Admin",
    credentials: {
      username: { label: "Username", type: "text" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (credentials?.username === "admin@saastainednumbers.com" && credentials?.password === "admin") {
        return { id: "admin", email: "admin@saastainednumbers.com", name: "Admin" };
      }
      return null;
    },
  })
);

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: process.env.DATABASE_URL ? PrismaAdapter(prisma) : undefined,
  providers,
  pages: {},
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.isAdmin = (user as Record<string, unknown>).isAdmin as boolean ?? false;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        const src = token as Record<string, unknown>;
        session.user.id = src.sub as string ?? session.user.email ?? "admin";
      }
      return session;
    },
  },
});
