"use client";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
const NotfoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Image
        src="/images/logo.svg"
        alt={`${APP_NAME} logo`}
        width={52}
        height={52}
        priority
      />
      <h1 className="text-2xl font-bold mt-4">Page Not Found</h1>
      <p className="mt-2 text-destructive">
        The page you are looking for does not exist.
      </p>
      <Button
        className="mt-4 ml-2"
        variant={"outline"}
        onClick={() => (window.location.href = "/")}
      >
        Go to Home
      </Button>
    </div>
  );
};

export default NotfoundPage;
