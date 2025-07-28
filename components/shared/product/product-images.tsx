"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

const ProductImages = ({ images }: { images: string[] }) => {
  const [current, setCurrent] = useState(0);
  return (
    <div className="space-y-4">
      <Image
        src={images[current]}
        alt="product image"
        width={1000}
        height={1000}
        className="min-h-[300px] object-cover"
      />
      <div className="flex">
        {images.map((image, index) => (
          <div
            key={image}
            className={cn("border mr-2 cursor-pointer hover:border-orange-600",
                current === index && "border-orange-500"
            )}
            onClick={() => setCurrent(index)}
          >
            <Image
              src={image}
              alt={`product thumbnail ${index + 1}`}
              width={100}
              height={100}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;
