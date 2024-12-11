// auth.config.ts
import GoogleProvider from 'next-auth/providers/google';
import InstagramProvider from 'next-auth/providers/instagram';
import { JWT } from 'next-auth/jwt';
import { prisma } from '@/lib/prisma';
import { InstagramAuth } from './instagram/utils';
import type { NextAuthOptions, Session, Account } from 'next-auth';

interface CustomSession extends Session {
  user: {
    id: number;
    email: string;
    username: string;
    is_admin: boolean;
    name?: string | null;
    image?: string | null;
  };
  accessToken?: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    InstagramProvider({
      clientId: process.env.INSTAGRAM_APP_ID!,
      clientSecret: process.env.INSTAGRAM_APP_SECRET!,
      authorization: InstagramAuth.getAuthorizationUrl(),
      token: {
        async request(context: {
          params: { code: string };
        }): Promise<{ tokens: { access_token: string } }> {
          const { code } = context.params;
          const token = await InstagramAuth.exchangeCodeForToken(code);
          return { tokens: { access_token: token } };
        },
      },
      // Add Stories-related scopes
      scopes: [
        'public_profile',
        'instagram_manage_messages',
        'instagram_manage_comments',
        'instagram_content_publish',
        'pages_show_list',
        'instagram_basic',
        'instagram_content_publish',
      ],
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google' || account?.provider === 'instagram') {
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
    async session({ session, token }: { session: CustomSession; token: JWT }) {
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

      if (token?.accessToken) {
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
    async jwt({ token, account }: { token: JWT; account: Account | null }) {
      if (account) {
        token.accessToken = account.access_token as string;
      }
      return token;
    },
  },
};
