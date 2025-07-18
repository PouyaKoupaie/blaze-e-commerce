import { nullable, z } from "zod";
import { formatNumberWithDecimal } from "./utils";

const currency = z
    .string()
    .refine((value) =>
      /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value))),
    "Price must be a valid number with two decimal places"
    )

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
  isFeatured: z.boolean().optional(),
  banner: z.string().nullable(),
  price:currency ,
});
