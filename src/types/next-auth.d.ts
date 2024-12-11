// types/next-auth.d.ts

import 'next-auth';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    user: {
      id: number;
      email: string;
      username: string;
      is_admin: boolean;
      name?: string | null;
      image?: string | null;
    };
  }
  interface JWT {
    accessToken?: string;
  }
}
