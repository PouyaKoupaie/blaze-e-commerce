// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecrypt } from "jose"; // Ensure this is jwtDecrypt for encrypted tokens

// Use NEXTAUTH_SECRET as it's the standard for next-auth (Auth.js)
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;

// Ensure the secret is available and correctly encoded
if (!NEXTAUTH_SECRET) {
  throw new Error('NEXTAUTH_SECRET environment variable is not set!');
}
// const JWT_DECRYPTION_SECRET = Buffer.from(NEXTAUTH_SECRET, 'base64');
// // --- JWT Decryption Function ---
// async function decryptJWT(token: string) {
//   try {
//     const { payload } = await jwtDecrypt(token, JWT_DECRYPTION_SECRET);
//     return payload; // The payload will be your session data
//   } catch (err) {
//     // Log the error here only for debugging, ensure it doesn't break production
//     console.error("JWT Decryption Failed (likely invalid token or secret):", err);
//     return null; // Return null if decryption fails
//   }
// }

export async function middleware(req: NextRequest) {

  // --- Handle Anonymous Cart ---
  const sessionCartId = req.cookies.get("sessionCartId");
  if (!sessionCartId) {
    console.log('No sessionCartId found, generating a new one...');
    const response = NextResponse.next();
    response.cookies.set("sessionCartId", crypto.randomUUID(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
    console.log('New sessionCartId set in response.');
    return response; // Return early after setting the cookie
  }

  // --- Global Token Retrieval and Decryption (RUNS ON EVERY REQUEST) ---
  // const userTokenValue = req.cookies.get("authjs.session-token")?.value
  // console.log("userTokenValue",userTokenValue)
  // let session // Declare session variable
  // if (userTokenValue) {
  //   console.log('Raw Auth Token Value from Cookie:', userTokenValue);
  //   session = await decryptJWT(userTokenValue); // Decrypt the token if it exists
  // } else {
  //   console.log('No authentication token found in cookies.');
  // }

  // --- Unconditional Session Payload Log ---
  // console.log('Decrypted Session Payload (unconditional):', session);

  // return NextResponse.next();
}

export const config = {
  matcher: [
    // Apply middleware to all paths except API routes, static files, etc.
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};