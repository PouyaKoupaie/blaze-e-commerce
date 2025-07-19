'use server'
import { prisma } from "@/lib/prisma";
import { convertToPlainObject } from "../utils";
import { LATEST_PRODUCTS_LIMIT } from "../constants";

export async function getLatestProducts() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      take: LATEST_PRODUCTS_LIMIT,
    });
    return convertToPlainObject(products);
  } catch (error) {
    console.error("Error fetching latest products:", error);
    throw error;
  }
}
