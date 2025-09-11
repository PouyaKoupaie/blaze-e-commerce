'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInWithCredential } from "@/lib/actions/user.actions";
import { signInDefaultValues } from "@/lib/constants";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

const CredentialSignInForm = () => {
  const [data, action] = useActionState(signInWithCredential, {
    success:false,
    message: '',
  })

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const SignInButton = () => {
    const {pending} = useFormStatus();
    return (
      <Button className="w-full" type="submit" variant={'default'} disabled={pending}>
        {pending ? "Signing In..." : "Sign In"}
      </Button>
    )
  }
  return (
    <form action={action}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            required
            autoComplete="email"
            defaultValue={signInDefaultValues.email}
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            required
            autoComplete="password"
            defaultValue={signInDefaultValues.password}
          />
        </div>
        <div>
            <SignInButton/>
        </div>
        {data && !data.success && (
          <div className="text-red-500 text-center">
            {data.message || "An error occurred. Please try again."}
          </div>)}
        <div className="text-sm text-center text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="text-primary hover:underline" target="_self">
                Sign Up
            </Link>
        </div>
      </div>
    </form>
  );
};

export default CredentialSignInForm;
