"use client";

import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { Cart } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowRight, Loader, Minus, Plus } from "lucide-react";
import OpacityAnimate from "@/components/animations/Opacity";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

const CartTable = ({ cart }: { cart?: Cart }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const handleRemove = ({ productId }) =>
    startTransition(async () => {
      const res = await removeItemFromCart(productId);
      if (!res.success) {
        toast.error(res.message);
      }
    });
  const handleAddToCart = ({ item }) => {
    startTransition(async () => {
      const res = await addItemToCart(item);
      if (!res.success) {
        toast.error(res.message);
      }
    });
  };
  return (
    <OpacityAnimate>
      <h1 className="py-4 h2-bold">Shopping Cart</h1>
      {!cart || cart.items.length === 0 ? (
        <div>
          Your Cart is empty. <Link href={"/"}>Go Shopping</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-Right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.items.map((item) => (
                  <TableRow key={item.slug}>
                    <TableCell>
                      <Link
                        href={`/product/${item.slug}`}
                        className="flex items-center"
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={50}
                          height={50}
                          className="rounded-lg"
                        />
                        <span className="px-3">{item.name}</span>
                      </Link>
                    </TableCell>
                    <TableCell className="flex-center gap-2.5">
                      <Button
                        disabled={isPending}
                        variant={"outline"}
                        type="button"
                        onClick={() =>
                          handleRemove({ productId: item.productId })
                        }
                      >
                        {isPending ? (
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                          <Minus className="w-4 h-4" />
                        )}
                      </Button>
                      <span>{item.quantity}</span>
                      <Button
                        disabled={isPending}
                        variant={"outline"}
                        type="button"
                        onClick={() => handleAddToCart({ item })}
                      >
                        {isPending ? (
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                          <Plus className="w-4 h-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>
                      {Number(item.price) * item.quantity} $
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Card>
            <CardContent className="p-4 gap-4">
              <div className="pb-3 text-xl">
                Subtotal ({cart.items.reduce((a, c) => a + c.quantity, 0)})
                <span className="px-2 font-bold">
                  {formatCurrency(cart.itemsPrice)}
                </span>
              </div>
              <Button className="w-full" onClick={() => router.push("/shipping-address")}>
                <ArrowRight /> Proceed to checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </OpacityAnimate>
  );
};

export default CartTable;
