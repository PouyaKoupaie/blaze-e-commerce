"use server";
import { signInFormSchema } from "../validator";
import { signUpFormSchema } from "../validator";
import { signIn, signOut } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import {hashSync } from "bcrypt-ts-edge";
import { prisma } from "@/db/prisma";
import { formatError } from "../utils";

//Sign in the user with credentials

export async function signInWithCredential(
  prevState: unknown,
  formData: FormData
) {
  try {
    const user = signInFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });
    await signIn("credentials", user);
    return { success: true, message: "Signed in successfully" };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return { success: false, message: "Invalid email or password" };
  }
}

// Sign userOut 
export async function signOutUser() {
    await signOut();
}

//Sign up user
export async function signUpUser(
  prevState: unknown,
  formData: FormData
) {
  try {
    const user = signUpFormSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    const plainPassword = user.password;
    // Hash the password before saving to the database
    user.password = hashSync(user.password, 10);

    // Create user in the database
    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });

    await signIn("credentials", {
      email: user.email,
      password: plainPassword,
    });
    return { success: true, message: "User created successfully" };
  } catch (error) {    
    if (isRedirectError(error)) throw error;
    return { success: false, message: formatError(error) };
  }
}

// get user ny the ID
export async function getUserById(userId: string){
  const user = await prisma.user.findFirst({
    where: {id: userId}
  });
  if (!user) throw new Error('user not found');
  return user;
}