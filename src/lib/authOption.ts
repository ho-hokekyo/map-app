import { PrismaAdapter } from '@next-auth/prisma-adapter'
import bcrypt from 'bcrypt'
import type { NextAuthOptions } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import GitHubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'

import prismadb from '@/lib/prisma'

const options: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    Credentials({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'text',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error('Email and password required')
        }

        const user = await prismadb.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !user.hashedpassword) {
          throw new Error('Email does not exists')
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedpassword,
        )

        if (!isCorrectPassword) {
          throw new Error('Incorrect password')
        }

        return user
      },
    }),
  ],
  pages: {
    signIn: '/auth',
  },
  debug: process.env.NODE_ENV === 'development',
  adapter: PrismaAdapter(prismadb),
  session: {
    strategy: 'jwt',
  },
  jwt: {
    secret: process.env.NEXTAUTH_JWT_SECRET,
  },
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.user = user
        // const u = user as any
        token.role = "admin" // u.role
      }
      if (account) {
        token.accessToken = account.access_token
      }
      console.log("token", token)

      return token
    },
    session: ({ session, token }) => {
      // token.accessToken
      return {
        ...session,
        user: {
          ...session.user,
          role: token.role,
        },
      }
    },
  },
}

export default options
