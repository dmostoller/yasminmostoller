// types/next-auth.d.ts

import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: number;
      email: string;
      username: string;
      is_admin: boolean;
      name?: string | null;
      image?: string | null;
    };
  }
}
