'use client'

import { CartItem } from "@/types";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { addItemToCart } from "@/lib/actions/cart.actions";
import { toast } from "sonner";

const AddToCart = ({item}: {item: CartItem}) => {
    const router = useRouter();
    const handleAddToCart = async () => {
        const res =await addItemToCart(item);
        if (res.success) {
            toast.success(`${item.name} added to cart`,{
                action:{
                    label: "Go to Cart",
                    onClick: () => router.push("/cart"),
                }
            });
        } else {
            toast.error(res.message);
        }

    }
    return ( <Button className="w-full" type="button" onClick={handleAddToCart}>
        Add To Cart
    </Button> );
}
 
export default AddToCart;