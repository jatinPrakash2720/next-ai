"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { User } from "next-auth";
import { Button } from "./ui/button";
import { LogOutIcon, Sun, Moon } from "lucide-react";
import { useTheme } from "@/helpers/themeToggle";
const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  return (
    <nav className="absolute top-0 left-0 right-0 p-4 md:p-6 bg-white/90 dark:bg-black/90 backdrop-blur-sm shadow-md z-50 border-b border-gray-200 dark:border-zinc-700">
      <div className="container mx-auto flex flex-row justify-between items-center">
        <Link className="text-xl font-bold text-black dark:text-white" href="/">
          Mystry Message
        </Link>
        <div className="flex items-center gap-4">
          <button
            onClick={() => toggleTheme()}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5 text-black dark:text-white" />
            ) : (
              <Sun className="w-5 h-5 text-black dark:text-white" />
            )}
          </button>
          <div className="relative">
            {session ? (
              <div className="flex items-center gap-4">
                <span className="hidden md:block font-bold text-black dark:text-white">
                  Welcome, {user?.username || user?.email}
                </span>
                <Button
                  className="w-10 rounded-full md:rounded-md md:w-auto"
                  onClick={handleSignOut}
                >
                  <LogOutIcon className="md:hidden" />
                  <span className="hidden md:inline">Logout</span>
                </Button>
              </div>
            ) : (
              <div className="flex flex-row items-center justify-center gap-4">
                <Link
                  href="/sign-in"
                  className="md:font-bold md:text-black md:dark:text-white"
                >
                  <Button className="md:hidden w-full">Login</Button>
                  <span className="hidden md:inline">Login</span>
                </Link>
                <Link href="/sign-up" className="hidden md:block">
                  <Button className="w-full md:w-auto">Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
