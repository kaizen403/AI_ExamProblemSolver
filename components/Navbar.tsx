"use client";
import { useSession, signOut } from "next-auth/react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
export default function Nav() {
  const { data: session } = useSession();
  const user = session?.user;
  const handleSignOut = async () => {
    await signOut({ redirect: false });
  };

  return (
    <Navbar className="bg-black">
      <NavbarBrand>
        <p className="font-bold text-inherit">KazAI</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="#">
            How to Use
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link href="#" aria-current="page">
            History
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Pricing
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        {!session && (
          <>
            <NavbarItem className="hidden lg:flex">
              <Link href="/login" passHref>
                <Button variant="outline">Login</Button>
              </Link>
            </NavbarItem>
            <NavbarItem className="hidden lg:flex">
              <Link href="/register" passHref>
                <Button variant="outline">Create an Account</Button>
              </Link>
            </NavbarItem>
          </>
        )}
        {session && (
          <NavbarItem className="hidden lg:flex items-center gap-2">
            {user?.image ? (
              <img
                src={user.image}
                alt={user?.name ?? "User"}
                className="rounded-full w-8 h-8"
              />
            ) : (
              <span>Welcome {user?.name ?? "Unknown User"}</span>
            )}
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </NavbarItem>
        )}
      </NavbarContent>
    </Navbar>
  );
}
