import { Button } from "@/components/ui/button";
import ModeToggle from "./mode-toggle";
import Link from "next/link";
import { EllipsisVertical, ShoppingCart, User } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import UserButton from "./user-button";

const Menu = () => {
  return (
    <div className="flex justify-end gap-3">
      <nav className="hidden md:flex w-full max-w-xs">
        <ModeToggle />
        <Button asChild variant={"ghost"}>
          <Link href={"/cart"}>
            <ShoppingCart /> Cart
          </Link>
        </Button>
        <UserButton />
      </nav>
      <nav className="md:hidden">
        <Sheet>
          <SheetTrigger className="align-middle">
            <EllipsisVertical />
          </SheetTrigger>
          <SheetContent className="flex flex-col items-start ">
            <SheetTitle>Menu</SheetTitle>
            <ModeToggle />
            <Button asChild variant={"ghost"}>
              <Link href={"/cart"}>
                <ShoppingCart /> Cart
              </Link>
            </Button>
            <Button asChild variant={"ghost"}>
              <Link href={"/sign-in"}>
                <User /> Sign In
              </Link>
            </Button>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};

export default Menu;
