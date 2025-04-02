import { NextAuthOptions, User as NextAuthUser, DefaultSession } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';
import { User as PrismaUser } from '@prisma/client';
import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { Session } from "next-auth"
import CredentialsProvider from 'next-auth/providers/credentials'
import { NextRequest } from 'next/server';

// Define base types for consistent modifiers
interface BaseUser {
  id?: string;
  role?: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
}

// Augment NextAuth types to include id and role
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: string;
    role: string;
    email?: string | null;
    name?: string | null;
    image?: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends BaseUser {}
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          select: {
            id: true,
            email: true,
            name: true,
            password: true,
            role: true,
          }
        })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.role = token.role as string
      }
      return session
    }
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET
}

export type AuthResult = Session | NextResponse<{ error: string }>

export async function requireAuth(
  req?: NextRequest,
  options: { redirectTo?: string; role?: 'USER' | 'ADMIN' } = {}
): Promise<AuthResult | NextResponse | null> {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      if (req && options.redirectTo) {
        const url = new URL(options.redirectTo, req.nextUrl.origin)
        url.searchParams.append('callbackUrl', req.nextUrl.pathname)
        return NextResponse.redirect(url)
      }
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (options.role && session.user.role !== options.role) {
      if (req) {
        return NextResponse.redirect(new URL('/unauthorized', req.nextUrl.origin))
      }
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return session
  } catch (error) {
    console.error('requireAuth error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function requireOwnership(userId: string): Promise<AuthResult> {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user.id !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    return session
  } catch (error) {
    console.error('requireOwnership error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export function isSession(result: AuthResult): result is Session {
  return 'user' in result
} 