import { z } from "zod";
import { formatNumberWithDecimal } from "./utils";

const currency = z
  .string()
  .refine(
    (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value))),
    "Price must be a valid number with two decimal places"
  );

//schema for product validation
export const productSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters"),
  slug: z.string().min(3, "Product slug must be at least 3 characters"),
  category: z.string().min(3, "Product category must be at least 3 characters"),
  brand: z.string().min(3, "Product brand must be at least 3 characters"),
  description: z
    .string()
    .min(3, "Product description must be at least 3 characters"),
  stock: z.coerce.number(),
  images: z.array(z.string()).min(1, "At least one image is required"),
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
  price: currency,
});

//schema for signing users in
export const signInFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password should contain at least 6 character"),
});

//schema for signing up user
export const signUpFormSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password should contain at least 6 character"),
    confirmPassword: z
      .string()
      .min(6, "confirmPassword should contain at least 6 character"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

  //cart schemas
  export const cartItemSchena = z.object({
    productId: z.string().min(1, "Product ID is required"),
    quantity: z.coerce.number().min(1, "Quantity must be a positive number"),
    name: z.number().nonnegative( "Product name is required"),
    slug: z.string().min(1, "Product slug is required"),
    image: z.string().min(1, "Product image is required"),
    price: currency,
  });

  export const insertCartSchema = z.object({
    items: z.array(cartItemSchena).min(1, "At least one item is required"),
    totalPrice: currency,
    itemsPrice: currency,
    shippingPrice: currency,
    taxPrice: currency,
    sessionCartId: z.string().min(1, "Session Cart ID is required"),
    userId: z.string().optional().nullable(),
  });