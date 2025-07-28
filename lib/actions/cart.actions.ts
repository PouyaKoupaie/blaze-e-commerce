"use server";

import { CartItem } from "@/types";
import { convertToPlainObject, formatError, round2 } from "../utils";
import { cookies } from "next/headers";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { cartItemSchema, insertCartSchema } from "../validator";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

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
        message: `${product.name} added to Cart`,
      };
    } else {
      // chack if item already in the cart
      const existItem = (cart.items as CartItem[]).find(
        (x) => x.productId === item.productId
      );

      if (existItem) {
        // check stock
        if (product.stock < existItem.quantity + 1) {
          throw new Error("Not enough stock");
        }

        //increase the quantity
        (cart.items as CartItem[]).find(
          (x) => x.productId === item.productId
        )!.quantity = existItem.quantity + 1;
      } else {
        // if item does not exist in cart
        // chack stock
        if (product.stock < 1) {
          throw new Error("Not enough stock");
        }
        // add item to the cart.items
        cart.items.push(item);
      }
      // save to database
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items as Prisma.CartUpdateitemsInput[],
          ...calcPrices(cart.items as CartItem[]),
        },
      });
      revalidatePath(`/product/${product.slug}`);

      return {
        success: true,
        message: `${product.name} ${
          existItem ? "updated in" : "added to"
        } Cart`,
      };
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

export async function removeItemFromCart(productId: string) {
  try {
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart session not found");

    //get product
    const product = await prisma.product.findFirst({
      where: { id: productId },
    });
    if (!product) throw new Error("product not found");

    // get user cart
    const cart = await getMyCart();
    if (!cart) throw new Error("cart not found");

    const exist = (cart.items as CartItem[]).find(
      (item) => item.productId === productId
    );
    if (!exist) throw new Error("item not found");

    // check if only one in quantity
    if (exist.quantity === 1) {
      cart.items = (cart.items as CartItem[]).filter(
        (item) => item.productId !== exist.productId
      );
    } else {
      //decrease
      (cart.items as CartItem[]).find(
        (x) => x.productId === productId
      )!.quantity = exist.quantity - 1;
    }

    // update cart in db
    await prisma.cart.update({
      where: {id:cart.id},
      data: {
        items: cart.items as Prisma.CartUpdateitemsInput[],
        ...calcPrices(cart.items as CartItem[]),
      },
    });
    revalidatePath(`/product/${product.slug}`);

    return{
      success: true,
      message: `${product.name} removed from Cart`,
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
