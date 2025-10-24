"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { LogOutIcon } from "lucide-react";
const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (session) {
      setShowWelcome(true);
      const timer = setTimeout(() => setShowWelcome(false), 500);
      return () => clearTimeout(timer);
    }
  }, [session]);
  return (
    <nav className="p-4 md:p-6 shadow-md">
      <div className="container mx-auto flex flex-row justify-between items-center">
        <a className="text-xl font-bold " href="#">
          Mystry Message
        </a>
        <div className="relative">
          {session ? (
            <>
              <span className="mr-4 font-bold ">
                Welcome, {user?.username || user?.email}
              </span>
              <Button
                className="w-10 rounded-full md:rounded-md md:w-auto"
                onClick={() => signOut()}
              >
                <LogOutIcon className="md:hidden" />
                <span className="hidden md:inline">Logout</span>
              </Button>
            </>
          ) : (
            <div className="flex flex-row items-center justify-center gap-4">
              <Link href="/sign-in" className="font-bold">
                Login
              </Link>
              <Link href="/sign-up">
                <Button className="w-full md:w-auto">Get Started</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
