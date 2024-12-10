import GoogleProvider from 'next-auth/providers/google';
import { prisma } from '@/lib/prisma';
import type { NextAuthOptions } from 'next-auth';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        try {
          let dbUser = await prisma.users.findUnique({
            where: { email: user.email! },
          });

          if (!dbUser) {
            dbUser = await prisma.users.create({
              data: {
                email: user.email!,
                username: user.email!.split('@')[0],
                password_hash: '',
                is_admin: false,
              },
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
    async session({ session }) {
      if (session.user?.email) {
        const dbUser = await prisma.users.findUnique({
          where: { email: session.user.email },
          select: {
            id: true,
            username: true,
            email: true,
            is_admin: true,
          },
        });

        if (dbUser) {
          session.user = {
            ...session.user,
            id: dbUser.id,
            username: dbUser.username,
            is_admin: dbUser.is_admin ?? false,
          };
        }
      }
      return session;
    },
  },
};
