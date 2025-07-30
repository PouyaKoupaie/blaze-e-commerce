import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./db/prisma";
import CredsentialsProvider from "next-auth/providers/credentials";
import { compareSync } from "bcrypt-ts-edge";
import type { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";

export const config = {
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredsentialsProvider({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (credentials == null) return null;

        //find user in database
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email as string,
          },
        });
        // chack user existance and password match
        if (user && user.password) {
          const isMatch = compareSync(
            credentials.password as string,
            user.password
          );

          // if password is correct, retutn user
          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
        }
        // if user not exist or password unmatched
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token, user, trigger }: any) {
        // set the user ID from the token
        session.user.id = token.sub;
        session.user.role = token.role;
        session.user.name = token.name;
        
        // if there is an update, set the name
        if (trigger === 'update') {
            session.user.name = user.name
        }
      return session;
    },
    async jwt({token, user, trigger, session}: any) {
      if (user) {
        token.role = user.role
        
        //if user had no name then use the email
        if(user.name === 'NO_NAME'){
          token.name = user.email!.split('@')[0];

          //update database to reflect the token name
          await prisma.user.update({
            where: {id: user.id},
            data: {name: token.name}
          })
        }
      }
      return token
    },
    // authorized({request, auth} : any) {
    //   // check for session cart cookie
    //   if (!request.cookies.get("sessionCartId")){
    //     // generate new session cart id cookie
    //     const sessionCartId = crypto.randomUUID();

    //     //clone request headers
    //     const newRequestHeaders = new Headers(request.headers);

    //     //create a new response
    //     const response = NextResponse.next({
    //       request: {
    //         headers: newRequestHeaders,
    //       },
    //     });

    //     //set newly generated session cart id cookie
    //     response.cookies.set({
    //       name: "sessionCartId",
    //       value: sessionCartId,
    //     });
    //     return response;
    //   } else {
    //     return true;
    //   }
    // }
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
