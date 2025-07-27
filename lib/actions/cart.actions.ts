"use server";

import { CartItem } from "@/types";
import { convertToPlainObject, formatError, round2 } from "../utils";
import { cookies } from "next/headers";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { cartItemSchema, insertCartSchema } from "../validator";
import { revalidatePath } from "next/cache";

// calculate cart prices
const calcPrices = (items: CartItem[]) => {
  const itemsPrice = round2(
    items.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0)
  );
  const shippingPrice = round2(itemsPrice > 100 ? 0 : 10);
  const taxPrice = round2(itemsPrice * 0.15); // assuming a tax rate of 15%
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);
  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
};

export async function addItemToCart(data: CartItem) {
  try {
    //chack for the cart cookie
    const sessionCart = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCart) {
      throw new Error("Session cart ID not found");
    }
    //get session and user id
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    //get cart
    const cart = await getMyCart();

    // parse and validate
    const item = cartItemSchema.parse(data);

    // find product from database
    const product = await prisma.product.findFirst({
      where: { id: item.productId },
    });
    if (!product) {
      throw new Error("Product not found");
    }
    if (!cart) {
      // create new cart object
      const newCart = insertCartSchema.parse({
        userId: userId,
        sessionCartId: sessionCart,
        items: [item],
        ...calcPrices([item]),
      });

      // add to database
      await prisma.cart.create({
        data: newCart,
      });

      // revalidate product page
      revalidatePath(`/product/${product.slug}`);

      return {
        success: true,
        message: "Item added to Cart",
      };
    } else {
      
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function getMyCart() {
  const sessionCart = (await cookies()).get("sessionCartId")?.value;
  if (!sessionCart) {
    throw new Error("Session cart ID not found");
  }
  //get session and user id
  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : undefined;

  // get user cart from database
  const cart = await prisma.cart.findFirst({
    where: userId ? { userId } : { sessionCartId: sessionCart },
  });
  if (!cart) {
    return undefined;
  }

  // convert decimal and return
  return convertToPlainObject({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  });
}
