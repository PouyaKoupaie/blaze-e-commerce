import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SignUpForm from "./sign-up-form";

export const metadata: Metadata = {
  title: "Sign Up",
};
const SignUpPage = async (props:{
  searchParams:Promise<{
    callbackUrl: string;
  }>
}) => {
  const {callbackUrl} = await props.searchParams;

  const session = await auth();

  if(session) {
    // If the user is already authenticated, redirect to the home page
    redirect(callbackUrl || "/");
  }
  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader className="space-y-4">
          <Link href="/" className="flex-center">
            <Image
              src={"/images/logo.svg"}
              width={100}
              height={100}
              alt={`${APP_NAME} logo`}
              priority
            />
          </Link>
          <CardTitle className="text-center">Create Account</CardTitle>
          <CardDescription className="text-center">
            Enter You information to sign up
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
            <SignUpForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUpPage;
