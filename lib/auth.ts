import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

const providers = [];

if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  providers.push(Google);
}

if (process.env.AUTH_RESEND_KEY) {
  providers.push(Resend({ from: "noreply@saastainednumbers.com" }));
}

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
