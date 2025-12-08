/* eslint-disable @typescript-eslint/no-explicit-any */
import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import environment from './config/environment';

export async function proxy(request: NextRequest) {
    const token = await getToken({
        req: request,
        // cookieName: process.env.VERCEL_ENV === "development"
        //              ? "authjs.session-token"
        //              : "__Secure-authjs.session-token",
        secret: environment.AUTH_SECRET,
    });

    let user = null;
    let userRole = null;
    
    const protectedPathsPrefix = "/admin";
    const protectedPathsUser = ['/', '/katalog', '/keranjang', '/peminjaman'];
    const protectedPathAuth = "/auth";
    
    const isProtectedUser = protectedPathsUser.some(path => request.nextUrl.pathname === path);
    
    if (!token && request.nextUrl.pathname.startsWith(protectedPathsPrefix)) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    
    if (!token && isProtectedUser) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }   

    if (token) {
        user = (token as any).user;
        userRole = user.status_user;
    }

    if (token && userRole !== "admin" && request.nextUrl.pathname.startsWith(protectedPathsPrefix)) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    if (token && userRole === "admin" && request.nextUrl.pathname === protectedPathsPrefix) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }

    if (token && userRole === "admin" && isProtectedUser) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }

    if (token && request.nextUrl.pathname.startsWith(protectedPathAuth)) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/auth/:path*', '/peminjaman', '/', '/keranjang', '/katalog'],
}