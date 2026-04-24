"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Menu, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

const MENU = [
  { title: "Home", url: "/" },
  { title: "Ideas", url: "/ideas" },
  { title: "About", url: "/about-us" },
];

/* ---------------- NAVBAR ---------------- */
export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const user: IUser | null = null; // replace with your auth

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
    <header className="sticky top-0 z-[100] w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex w-11/12 md:w-10/12 items-center justify-between py-4">

        {/* LOGO */}
        <Link href="/" className="font-bold text-lg">
          GreenForge
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden lg:flex items-center gap-6">
          {/* ✅ Plain ul — eliminates NavigationMenu's phantom viewport div */}
          <ul className="flex items-center gap-1 list-none m-0 p-0">
            {MENU.map((item) => (
              <li key={item.title}>
                <Link
                  href={item.url}
                  className="relative px-4 py-2 text-sm font-medium rounded-md inline-block"
                >
                  {item.title}
                  {/* ✅ layout="position" — won't affect surrounding sizing on mount */}
                  {isActive(item.url) && (
                    <motion.span
                      layoutId="desktopActiveIndicator"
                      layout="position"
                      className="absolute left-0 right-0 -bottom-1 h-[2px] bg-primary rounded-full"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {!user ? (
            <>
              <Button variant="outline" size="sm" >
                <Link href="/login">Login</Link>
              </Button>
              <Button size="sm" >
                <Link href="/register">Register</Link>
              </Button>
            </>
          ) : (
            <UserMenu user={user} onLogout={handleLogout} />
          )}
        </nav>

        {/* MOBILE TRIGGER */}
        <div className="flex items-center gap-2 lg:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger >
              <Button size="icon" variant="outline" aria-label="Open menu">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="z-[200] p-0 flex flex-col">
              <AnimatePresence>
                {open && (
                  <motion.div
                    key="mobile-menu"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="flex flex-col gap-1 px-4 pt-14 pb-6 h-full"
                  >
                    {/* Menu Items */}
                    <div className="flex flex-col gap-1">
                      {MENU.map((item) => (
                        <Link
                          key={item.title}
                          href={item.url}
                          onClick={() => setOpen(false)}
                          className="relative flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors overflow-hidden"
                        >
                          {isActive(item.url) && (
                            <motion.span
                              layoutId="mobileActiveBackground"
                              className="absolute inset-0 bg-muted rounded-md"
                              transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 35,
                              }}
                            />
                          )}
                          {isActive(item.url) && (
                            <motion.span
                              layoutId="mobileActiveBar"
                              className="absolute left-0 top-1 bottom-1 w-[3px] bg-primary rounded-full"
                              transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 35,
                              }}
                            />
                          )}
                          <span
                            className={cn(
                              "relative z-10",
                              isActive(item.url)
                                ? "text-foreground font-semibold"
                                : "text-muted-foreground"
                            )}
                          >
                            {item.title}
                          </span>
                        </Link>
                      ))}
                    </div>

                    {/* Auth Buttons */}
                    <div className="mt-auto border-t pt-4 flex flex-col gap-2">
                      {!user ? (
                        <>
                          <Button variant="outline" >
                            <Link href="/login" onClick={() => setOpen(false)}>
                              Login
                            </Link>
                          </Button>
                          <Button >
                            <Link href="/register" onClick={() => setOpen(false)}>
                              Register
                            </Link>
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="destructive"
                          onClick={() => {
                            setOpen(false);
                            handleLogout();
                          }}
                        >
                          Logout
                        </Button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </header>
  );
}

/* ---------------- USER MENU ---------------- */
function UserMenu({ user, onLogout }: { user: IUser; onLogout: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger >
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <Avatar>
            <AvatarImage src={user.image || ""} />
            <AvatarFallback>{user.name?.[0] ?? "U"}</AvatarFallback>
          </Avatar>
        </motion.button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="z-[150]">
        <DropdownMenuItem >
          <Link
            href="/profile"
            className="flex gap-2 items-center cursor-pointer"
          >
            <User className="h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onLogout} className="cursor-pointer">
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}