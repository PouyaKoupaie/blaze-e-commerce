"use server";
import { prisma } from "@/db/prisma";
import { LATEST_PRODUCTS_LIMIT } from "../constants";

export async function getLatestProducts() {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      take: LATEST_PRODUCTS_LIMIT,
    });
    return products.map((product) => ({
      ...product,
      price: product.price.toString(),
      rating: product.rating.toString(),
    }));

}

// Get single product by its slug
export async function getProductBySlug(slug: string) {
    return await prisma.product.findFirst({
        where: { slug },
    })
}