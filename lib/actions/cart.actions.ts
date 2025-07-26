'use server';

import {CartItem} from "@/types";

export async function addItemToCart(item: CartItem) {
    return {
        success: false,
        message: "ther was an issue",
    }

    console.log('Item added to cart:', item);
}