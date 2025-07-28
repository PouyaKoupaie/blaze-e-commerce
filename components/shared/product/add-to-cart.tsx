"use client";

import { Cart, CartItem } from "@/types";
import { Button } from "../../ui/button";
import { useRouter } from "next/navigation";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { toast } from "sonner";
import { Minus, Plus } from "lucide-react";

const AddToCart = ({ item, cart }: { item: CartItem; cart?: Cart }) => {
  const router = useRouter();
  const handleAddToCart = async () => {
    const res = await addItemToCart(item);
    if (res.success) {
      toast.success(res.message, {
        action: {
          label: "Go to Cart",
          onClick: () => router.push("/cart"),
        },
      });
    } else {
      toast.error(res.message);
    }
  };
  async function handleRemoveFromCart() {
    const res = await removeItemFromCart(item.productId);
    if (res.success) {
      toast.success(res.message, {
        action: {
          label: "Go to Cart",
          onClick: () => router.push("/cart"),
        },
      });
    } else {
      toast.error(res.message);
    }
  }

  // check if item is in cart
  const existItem =
    cart && cart.items.find((x) => x.productId === item.productId);
  if (existItem) {
    return (
      <div>
        <Button
          type="button"
          variant={"outline"}
          onClick={handleRemoveFromCart}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="px-2">{existItem.quantity} in Cart</span>
        <Button type="button" variant={"outline"} onClick={handleAddToCart}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    );
  }
  return (
    <Button className="w-full" type="button" onClick={handleAddToCart}>
      Add To Cart
    </Button>
  );
};

export default AddToCart;
