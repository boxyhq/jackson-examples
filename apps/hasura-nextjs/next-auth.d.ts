import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    id: string | undefined;
    token: string | undefined;
    role: unknown;
  }

  interface Profile {
    requested: {
      tenant: string;
    };
    roles: string[];
    groups: string[];
  }
}
