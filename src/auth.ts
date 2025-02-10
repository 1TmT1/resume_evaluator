import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./lib/db";
import { getUserById } from "../data/user";
export const BASE_PATH = '/api/auth';

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    adapter: PrismaAdapter(db),
    session: { strategy: 'jwt' },
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider !== 'credentials') return true;

            const existingUser = await getUserById(user.id);

            if (!existingUser?.emailVerified) return false;

            return true;
        },
        // async session({ token, session }) {
        //     if (token.sub && session.user) {
        //         session.user.id = token.sub;
        //     }
        //     return session;
        // },
        // async jwt({ token }) {
        //     if (!token.sub) return token;

        //     const existingUser = getUserById(token.sub);

        //     if (!existingUser) return token;

        //     token.jobLinks = existingUser.jobLinks;

        //     return token;
        // }
    },
    events: {
        async linkAccount({ user }) {
            await db.user.update({
                where: { id: user.id },
                data: { emailVerified: new Date() }
            });
        }
    },
    pages: {
        signIn: '/auth/login',
        error: '/auth/error',
    },
    ...authConfig,
});