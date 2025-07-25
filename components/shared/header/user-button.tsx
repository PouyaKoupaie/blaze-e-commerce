import Link from "next/link";
import { auth } from "@/auth";
import { signOutUser } from "@/lib/actions/user.actions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";

const UserButton = async () => {
  const session = await auth();

  if (!session) {
    return (
      <Button asChild variant={"default"}>
        <Link href={"/sign-in"}>
          <User /> Sign In
        </Link>
      </Button>
    );
  }

  const firstInitial = session.user?.name?.charAt(0).toUpperCase() ?? "U";

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center">
            <Button
              variant={"ghost"}
              className=" w-8 h-8 reounded-full 
              flex items-center justify-center 
              ml-2 bg-gray-200 text-neutral-950"
            >
              {firstInitial}
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                    <div className="text-sm font-medium leading-none">
                        {session.user?.name}
                    </div>
                    <div className="text-sm text-muted-foreground leading-none">
                        {session.user?.email}
                    </div>
                </div>
            </DropdownMenuLabel>
            <DropdownMenuItem asChild className="p-0 mb-1">
                <form action={signOutUser} className="w-full">
                    <Button
                        type="submit"
                        variant={"ghost"}
                        className="w-full text-left"
                    >
                        Sign Out
                    </Button>
                </form>
            </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserButton;
