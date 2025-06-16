import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const protectedPaths = ['/dashboard'];

  if (protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path))) {
    if (!token || !verifyToken(token)) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard'],
};
