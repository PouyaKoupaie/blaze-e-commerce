// // auth.config.ts

// import type { NextAuthConfig } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";

// // Notice we do NOT import prisma or the adapter here.
// // The authorize function will still be called on the server, not the edge.

// export const config = {
//   pages: {
//     signIn: "/sign-in",
//     error: "/sign-in",
//   },
//   session: {
//     strategy: "jwt",
//   },
//   providers: [
//     CredentialsProvider({
//       // The authorize function is part of the server-only logic, 
//       // but defining it here is fine. The middleware itself doesn't execute it.
//       async authorize(credentials) {
//         // This logic will be bundled with your [...nextauth] API route, not the middleware.
//         // We will need to define it properly in the main `auth.ts` file.
//         // For the config, we can return null as a placeholder, or define it fully.
//         // To keep this file truly separate, we will move authorize to the main file.
//         return null; // Placeholder, the real logic will be in auth.ts
//       },
//     }),
//   ],
//   callbacks: {
//     // These callbacks are edge-safe and can be used in the middleware.
//     async jwt({ token, user }) {
//       if (user) {
//         token.sub = user.id;
//         token.role = user.role;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (session.user) {
//         session.user.id = token.sub as string;
//         session.user.role = token.role as string;
//       }
//       return session;
//     },
//   },
// } satisfies NextAuthConfig;