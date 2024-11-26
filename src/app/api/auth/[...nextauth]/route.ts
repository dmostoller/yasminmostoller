// app/api/auth/[...nextauth]/route.ts

import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { prisma } from '@/lib/prisma';
import type { NextAuthOptions } from 'next-auth';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        try {
          // Check if user exists
          let dbUser = await prisma.users.findUnique({
            where: { email: user.email! }
          });

          // If user doesn't exist, create new user
          if (!dbUser) {
            dbUser = await prisma.users.create({
              data: {
                email: user.email!,
                username: user.email!.split('@')[0], // Create username from email
                password_hash: '', // Empty as using OAuth
                is_admin: false
              }
            });
          }

          return true;
        } catch (error) {
          console.error('Error during sign in:', error);
          return false;
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user?.email) {
        const dbUser = await prisma.users.findUnique({
          where: { email: session.user.email },
          select: {
            id: true,
            username: true,
            email: true,
            is_admin: true
          }
        });

        if (dbUser) {
          session.user = {
            ...session.user,
            id: dbUser.id,
            username: dbUser.username,
            is_admin: dbUser.is_admin ?? false
          };
        }
      }
      return session;
    }
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
