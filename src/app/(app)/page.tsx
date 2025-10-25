"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { UserPlus, Share2, Mail } from "lucide-react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="bg-white dark:bg-black flex flex-col justify-center z-0 pt-30">
      {/* Hero Section - Centered */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-black dark:text-white mb-4 md:mb-6">
              Anonymous
              <span className="block text-gray-600 dark:text-zinc-400">
                Messages
              </span>
            </h1>
            <p className="text-base md:text-xl text-gray-600 dark:text-zinc-400 mb-6 md:mb-8 max-w-3xl mx-auto px-2">
              Share your unique link and receive anonymous messages from
              friends, family, or anyone. Get honest feedback without revealing
              your identity.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4">
              {session ? (
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    className="bg-black hover:bg-gray-800 text-white px-6 md:px-8 py-2 md:py-3 text-base md:text-lg w-full sm:w-auto"
                  >
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/sign-up">
                    <Button
                      size="lg"
                      className="bg-black hover:bg-gray-800 text-white px-6 md:px-8 py-2 md:py-3 text-base md:text-lg w-full sm:w-auto"
                    >
                      Get Started
                    </Button>
                  </Link>
                  <Link href="/sign-in">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-black text-black dark:text-white hover:bg-gray-50 px-6 md:px-8 py-2 md:py-3 text-base md:text-lg w-full sm:w-auto"
                    >
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="max-w-7xl mx-auto mb-6 md:mb-10 mx-4 border border-gray-200 dark:border-zinc-700 rounded-lg">
        <div className="flex flex-col items-center justify-center bg-gray-100 dark:bg-zinc-950/90 rounded-lg ">
          <div className="text-center px-4 py-2 mb-2 w-full border-b border-gray-300 dark:border-zinc-600">
            <h2 className="text-2xl md:text-3xl font-bold text-black dark:text-white ">
              How It Works
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 p-4 md:p-8">
            <div className="flex flex-col items-center justify-center">
              <UserPlus className="w-8 h-8 md:w-10 md:h-10 text-black dark:text-white mb-3 md:mb-4" />
              <h3 className="text-lg md:text-2xl font-bold text-black dark:text-white mb-2">
                Create Your Account
              </h3>
              <p className="text-sm md:text-base text-gray-600 dark:text-zinc-400 text-center">
                Create an account to get started and share your unique link.
              </p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <Share2 className="w-8 h-8 md:w-10 md:h-10 text-black dark:text-white mb-3 md:mb-4" />
              <h3 className="text-lg md:text-2xl font-bold text-black dark:text-white mb-2">
                Share Your Link
              </h3>
              <p className="text-sm md:text-base text-gray-600 dark:text-zinc-400 text-center">
                Share your unique link with your friends, family, or anyone.
              </p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <Mail className="w-8 h-8 md:w-10 md:h-10 text-black dark:text-white mb-3 md:mb-4" />
              <h3 className="text-lg md:text-2xl font-bold text-black dark:text-white mb-2">
                Receive Messages
              </h3>
              <p className="text-sm md:text-base text-gray-600 dark:text-zinc-400 text-center">
                Receive anonymous messages from your friends, family, or anyone.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
