import { auth } from "@/auth";
import { getMyCart } from "@/lib/actions/cart.actions";
import { getUserById } from "@/lib/actions/user.actions";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata ={
    title: 'Shipping Address'
}
const ShippingAddressPage = async() => {
    const cart = await getMyCart();

    if(!cart || cart.items.length) redirect('/cart');

    const session = await auth();
    const userId = session?.user?.id

    if(!userId) throw new Error('No user Id')
    const user = await getUserById(userId)
    return ( <>address</>);
}
 
export default ShippingAddressPage;