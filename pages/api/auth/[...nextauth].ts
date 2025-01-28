import NextAuth, { NextAuthOptions, Session } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { JWT } from 'next-auth/jwt';
import { prisma } from '../../../lib/prisma';

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'test@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // This is a simple example for development
        if (credentials?.email === 'test@example.com' && credentials?.password === 'test') {
          return {
            id: '1',
            name: 'Test User',
            email: 'test@example.com',
          };
        }
        return null;
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? '',
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
    // ...add more providers here
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      // Create or update user in database
      await prisma.user.upsert({
        where: { email: user.email },
        update: {
          name: user.name,
          image: user.image,
        },
        create: {
          email: user.email,
          name: user.name,
          image: user.image,
        },
      });

      return true;
    },
    async jwt({ token, account, user }: { token: JWT; account?: any; user?: any }): Promise<JWT> {
      // Persist the OAuth access_token and user data to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
      }
      if (user) {
        token.name = user.name;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }): Promise<Session> {
      session.accessToken = token.accessToken;

      if (session.user) {
        session.user.name = token.name as string;
        session.user.image = token.image as string;
      }

      return session;
    },
  },
};

export default NextAuth(authOptions);
