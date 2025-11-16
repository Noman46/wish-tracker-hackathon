import { getServerSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
};

export async function getSession() {
  return await getServerSession(authOptions as any);
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user;
}

