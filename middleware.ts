import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/auth'; // This imports the 'auth' object from your auth.ts configuration

// Define the paths you want to protect
const PROTECTED_PATHS = ['/cart', '/shipping-cart']; // ONLY /cart is protected now
const LOGIN_PATH = '/sign-in';

// This is the single middleware function exported by Next.js
export default auth((req: NextRequest & { auth: any }) => {
  const { auth: session, nextUrl } = req; // 'auth' here is the session object from next-auth
  const sessionCartId = req.cookies.get("sessionCartId");

  if (!sessionCartId) {
    const newRequestHeaders = new Headers(req.headers);
    const newSessionCartId = crypto.randomUUID();

    const response = NextResponse.next({
      request: {
        headers: newRequestHeaders,
      },
    });

    response.cookies.set({
      name: "sessionCartId",
      value: newSessionCartId,
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response; // Respond with the cookie set
  }

  const isProtectedPath = PROTECTED_PATHS.some(path => nextUrl.pathname.startsWith(path));
  if (isProtectedPath && !session?.user) {
    return NextResponse.redirect(new URL(LOGIN_PATH, nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/cart', // Explicitly include the protected path
    '/shipping-cart',
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};