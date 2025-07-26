import {z} from "zod";
import { cartItemSchena, insertCartSchema, productSchema } from "@/lib/validator";
export type Product = z.infer<typeof productSchema> &{
    id:string;
    rating: string
    createdAt: Date;
}

export type Cart = z.infer<typeof insertCartSchema>
export type CartItem = z.infer<typeof cartItemSchena>; 