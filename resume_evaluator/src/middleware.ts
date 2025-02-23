import authConfig from "./auth.config";
import NextAuth from "next-auth";
import { authRoutes, apiAuthPrefix, DEFAULT_LOGIN_REDIRECT, protectedRoutes } from "./routes";
import { NextResponse } from "next/server";

export const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;
    const email = req.auth?.user?.email;

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);
    const isProtectedRoute = protectedRoutes.includes(nextUrl.pathname);

    if (isApiAuthRoute) return NextResponse.next();

    let isUserExist = false;
    if (isLoggedIn && email) {
        try {
            const res = await fetch(`${process.env.BASE_PATH}/api/find-user?email=${email}`, {
                method: "GET",
                headers: {
                    "x-Custom-Middleware-Check-w-header": "middleware-check",
                },
            });
            isUserExist = res.ok;
        } catch {
            return Response.redirect(new URL('/auth/login', nextUrl));
        }
    }

    if (isAuthRoute && isLoggedIn && isUserExist) {
        return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }

    if (!isLoggedIn || !isUserExist) {
        if (isProtectedRoute) {
            return NextResponse.redirect(new URL('/auth/login', nextUrl));
        }
    }

    return NextResponse.next();
});

export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}