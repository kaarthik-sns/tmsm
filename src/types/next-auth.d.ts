// In `src/types/next-auth.d.ts` or wherever your custom types are declared
import NextAuth, { DefaultUser, DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    _id?: string; // Make _id optional
    is_admin?: boolean;
  }

  interface Session extends DefaultSession {
    user: User & {
      id: string;
      is_admin?: boolean;
    };
  }
}
