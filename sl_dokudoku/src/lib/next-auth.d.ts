import NextAuth, { DefaultSession, DefaultUser } from "next-auth"
import { JWT, DefaultJWT } from "next-auth/jwt"

// Augment the built-in session types
declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's id. */
      id: string; 
    } & DefaultSession["user"]; // Keep the default properties
  }

  /** Augment the default User type */
  interface User extends DefaultUser {
    // Add any other custom properties you want on the User object
    // e.g., role?: string;
  }
}

// Augment the built-in JWT types
declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT extends DefaultJWT {
    /** Add user ID to the JWT */
    id?: string;
    // Add any other custom properties you want on the JWT token
    // e.g., role?: string;
  }
}
