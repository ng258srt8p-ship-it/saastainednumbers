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
  providers.push(Resend({ from: "noreply@webcalc.io" }));
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
      if (credentials?.username === "admin@saasifactory.com" && credentials?.password === "admin") {
        return { id: "admin", email: "admin@saasifactory.com", name: "Admin", subscriptionTier: "pro", isAdmin: true };
      }
      return null;
    },
  })
);

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: process.env.DATABASE_URL ? PrismaAdapter(prisma) : undefined,
  providers,
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.subscriptionTier = (user as Record<string, unknown>).subscriptionTier as string ?? "free";
        token.isAdmin = (user as Record<string, unknown>).isAdmin as boolean ?? false;
      }
      return token;
    },
    session({ session, token, user }) {
      if (session.user) {
        const src = token as Record<string, unknown>;
        session.user.id = src.sub as string ?? session.user.email ?? "admin";
        session.user.subscriptionTier = (src.subscriptionTier as string) === "pro" ? "pro" : "free";
      }
      return session;
    },
  },
});
