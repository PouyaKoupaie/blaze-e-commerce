import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./db/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createHash } from "crypto";

function hashPassword(password: string) {
  return createHash("sha256").update(password).digest("hex");
}

function verifyPassword(password: string, hashed: string) {
  return hashPassword(password) === hashed;
}

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
    CredentialsProvider({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        //find user in database
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email as string,
          },
        });
        // chack user existance and password match
        if (user && user.password) {
          const isMatch = verifyPassword(
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
        token.id = user.id;
        token.role = user.role;
        
        //if user had no name then use the email
        if(user.name === 'NO_NAME'){
          token.name = user.email!.split('@')[0];

          //update database to reflect the token name
          await prisma.user.update({
            where: {id: user.id},
            data: {name: token.name}
          })
        }
        if (trigger === 'signIn' || trigger === 'signUp'){
          const cookiesObject = await cookies()
          const sessionCartId = cookiesObject.get('sessionCartId')?.value;

          if(sessionCartId){
            const sessionCart = await prisma.cart.findFirst({
              where: {sessionCartId}
            });

            if (sessionCart) {
              // delete current user cart
              await prisma.cart.deleteMany({
                where: {userId: user.id}
              });

              // assign new cart
              await prisma.cart.update ({
                where: {id: sessionCart.id},
                data: {userId: user.id}
              })
            }
          }
        }
      }
      
      // handle session updates
      if (session?.user.name && trigger === 'update'){
        token.name = session.user.name
      }
      return token
    },
    authorized({request, auth} : any) {
      // array of regex patterns of paths we want to protect
      const protectedPaths = [
        /\/shipping-address/,
        /\/payment-method/,
        /\/place-order/,
        /\/profile/,
        /\/user\/(.*)/,
        /\/order\/(.*)/,
        /\/admin/
      ]

      //get pathname from the req url object
      const { pathname } = request.nextUrl;

      // check if user is not authenticated and accessing a protected path
      if (!auth && protectedPaths.some((path) => path.test(pathname))) {
        return Response.redirect(new URL('/sign-in', request.url))
      }
      // check for session cart cookie
      if (!request.cookies.get("sessionCartId")){
        // generate new session cart id cookie
        const sessionCartId = crypto.randomUUID();

        //clone request headers
        const newRequestHeaders = new Headers(request.headers);

        //create a new response
        const response = NextResponse.next({
          request: {
            headers: newRequestHeaders,
          },
        });

        //set newly generated session cart id cookie
        response.cookies.set({
          name: "sessionCartId",
          value: sessionCartId,
        });
        return response;
      } else {
        return true;
      }
    }
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
