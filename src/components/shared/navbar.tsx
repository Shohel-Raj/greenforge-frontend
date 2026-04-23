"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";

import { Menu, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/* ---------------- TYPES ---------------- */
type IUser = {
  name?: string;
  image?: string;
};

/* ---------------- NAVBAR ---------------- */

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const user: IUser | null = null; // example: useUser()

  const menu = [
    { title: "Home", url: "/" },
    { title: "Ideas", url: "/ideas" },
    // { title: "About", url: "/about" },
  ];

  const isActive = (url: string) =>
    url === "/" ? pathname === "/" : pathname.startsWith(url);

  const handleLogout = async () => {
    try {
      // await logoutUser();

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <header className="border-b bg-background sticky top-0 z-50 backdrop-blur"
    >
      <div className="mx-auto flex w-11/12 md:w-10/12 items-center justify-between py-4">

        {/* LOGO */}
        <Link href="/" className="font-bold text-lg">
          GreenForge
        </Link>

        {/* DESKTOP */}
        <nav className="hidden lg:flex items-center gap-6">
          <NavigationMenu>
            <NavigationMenuList>
              {menu.map((item) => (
                <NavigationMenuItem key={item.title}>
                  <NavigationMenuLink >
                    <motion.div whileHover={{ scale: 1.05 }}>
                      <Link
                        href={item.url}
                        className="relative px-4 py-2 text-sm font-medium rounded-md"
                      >
                        {item.title}

                        {isActive(item.url) && (
                          <motion.span
                            layoutId="nav-active"
                            className="absolute left-0 right-0 -bottom-1 h-[2px] bg-primary"
                          />
                        )}
                      </Link>
                    </motion.div>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {!user ? (
            <>
              <Button  variant="outline" size="sm">
                <Link href="/login">Login</Link>
              </Button>
              <Button  size="sm">
                <Link href="/register">Register</Link>
              </Button>
            </>
          ) : (
            <UserMenu user={user} onLogout={handleLogout} />
          )}
        </nav>

        {/* MOBILE */}
        <div className="flex items-center gap-2 lg:hidden">
          <Sheet>
            <SheetTrigger >
              <Button size="icon" variant="outline">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="p-6">
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col gap-4"
              >
                {menu.map((item) => (
                  <div key={item.title}
                  >
                    <Link
                      href={item.url}
                      className={cn(
                        "block px-3 py-2 rounded-md",
                        isActive(item.url)
                          ? "bg-muted"
                          : "hover:bg-muted"
                      )}
                    >
                      {item.title}
                    </Link>
                  </div>
                ))}

                {!user ? (
                  <>
                    <Button  variant="outline">
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button >
                      <Link href="/register">Register</Link>
                    </Button>
                  </>
                ) : (
                  <Button variant="destructive" onClick={handleLogout}>
                    Logout
                  </Button>
                )}
              </motion.div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

/* ---------------- USER MENU ---------------- */

function UserMenu({
  user,
  onLogout,
}: {
  user: IUser;
  onLogout: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger >
        <motion.button whileHover={{ scale: 1.1 }}>
          <Avatar>
            <AvatarImage src={user.image || ""} />
            <AvatarFallback>
              {user.name?.[0] ?? "U"}
            </AvatarFallback>
          </Avatar>
        </motion.button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Link href="/profile" className="flex gap-2 items-center">
            <User className="h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={onLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}