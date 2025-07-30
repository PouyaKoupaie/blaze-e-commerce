import { z } from "zod";
import {
  cartItemSchema,
  insertCartSchema,
  productSchema,
  shippingAddressSchema,
} from "@/lib/validator";
export type Product = z.infer<typeof productSchema> & {
  id: string;
  rating: string;
  createdAt: Date;
};

export type Cart = z.infer<typeof insertCartSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type ShippingAddress = z.infer<typeof shippingAddressSchema>;