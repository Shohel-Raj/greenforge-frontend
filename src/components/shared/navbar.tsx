"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Menu, LogOut, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { getUserInfo } from "@/services/auth.services";
import { logoutAction } from "@/app/(commonLayout)/(authRouteGroup)/login/_action";

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

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await getUserInfo();
        setCurrentUser(user);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const isActive = (url: string) =>
    url === "/" ? pathname === "/" : pathname.startsWith(url);

  const handleLogout = async () => {
    await logoutAction();
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-[100] w-full border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex w-11/12 md:w-10/12 items-center justify-between py-4">

        {/* LOGO */}
        <Link href="/" className="font-bold text-lg">
          GreenForge
        </Link>

        {/* DESKTOP */}
        <nav className="hidden lg:flex items-center gap-6">
          <ul className="flex items-center gap-1">
            {MENU.map((item) => (
              <li key={item.title}>
                <Link
                  href={item.url}
                  className="relative px-4 py-2 text-sm font-medium rounded-md"
                >
                  {item.title}
                  {isActive(item.url) && (
                    <motion.span
                      layoutId="desktopActiveIndicator"
                      layout="position"
                      className="absolute left-0 right-0 -bottom-1 h-[2px] bg-primary"
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* 🔥 ONLY AUTH PART HANDLES LOADING */}
          {loading ? (
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
          ) : !currentUser ? (
            <>
              <Button  variant="outline" size="sm">
                <Link href="/login">Login</Link>
              </Button>
              <Button  size="sm">
                <Link href="/register">Register</Link>
              </Button>
            </>
          ) : (
            <UserMenu user={currentUser} onLogout={handleLogout} />
          )}
        </nav>

        {/* MOBILE */}
        <div className="flex items-center gap-2 lg:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger >
              <Button size="icon" variant="outline">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="p-6 flex flex-col">
              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ x: 40, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 40, opacity: 0 }}
                    className="flex flex-col gap-4 h-full"
                  >
                    {MENU.map((item) => (
                      <Link
                        key={item.title}
                        href={item.url}
                        onClick={() => setOpen(false)}
                        className="px-3 py-2 rounded-md"
                      >
                        {item.title}
                      </Link>
                    ))}

                    <div className="mt-auto flex flex-col gap-2">
                      {loading ? (
                        <div className="h-10 bg-muted animate-pulse rounded-md" />
                      ) : !currentUser ? (
                        <>
                          <Button  variant="outline">
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
        <motion.button whileHover={{ scale: 1.05 }}>
          <Avatar>
            <AvatarImage src={user.image || ""} />
            <AvatarFallback>
              {user.name?.[0] ?? "U"}
            </AvatarFallback>
          </Avatar>
        </motion.button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem >
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