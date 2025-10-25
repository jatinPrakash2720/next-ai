"use client";

import { messageSchema } from "@/schemas/messageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import React from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { ApiResponse } from "@/types/ApiResponse";
import { useTheme } from "@/helpers/themeToggle";
import { Sun, Moon, Loader2 } from "lucide-react";
import Link from "next/link";

const UserProfilePage = () => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [suggestedMessages, setSuggestedMessages] = React.useState<string[]>(
    []
  );
  const [isFetchingSuggestedMessages, setIsFetchingSuggestedMessages] =
    React.useState(false);
  const [refreshCooldown, setRefreshCooldown] = React.useState(0);
  const [isRefreshDisabled, setIsRefreshDisabled] = React.useState(false);
  const params = useParams<{ username: string }>();
  const { theme, toggleTheme } = useTheme();
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });
  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        content: data.content,
        username: params.username,
      });

      if (!response.data?.success) {
        toast.error(response.data.message);
      } else {
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error("Error while sending message :", error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Prebuilt messages as fallback
  const prebuiltMessages = [
    "What's something that always makes you smile?",
    "If you could have dinner with anyone, who would it be?",
    "What's a skill you'd love to learn?",
    "What's your favorite way to spend a weekend?",
    "If you could travel anywhere, where would you go?",
    "What's a book or movie that changed your perspective?",
    "What's something you're grateful for today?",
    "If you could give advice to your younger self, what would it be?",
    "What's a hobby you've always wanted to try?",
    "What's the best compliment you've ever received?",
  ];

  const getRandomMessages = () => {
    const shuffled = [...prebuiltMessages].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };

  const startCooldown = () => {
    setIsRefreshDisabled(true);
    setRefreshCooldown(30);

    const interval = setInterval(() => {
      setRefreshCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsRefreshDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const fetchSuggestedMessages = async () => {
    if (isRefreshDisabled) return;

    setIsFetchingSuggestedMessages(true);
    let fullText = "";

    const eventSource = new EventSource("/api/suggest-messages");
    eventSource.onmessage = (event) => {
      console.log("event :", event);
      if (event.data === "[DONE]") {
        eventSource.close();
        // Parse the final response and split by '||'
        const questions = fullText
          .split("||")
          .map((q) => q.trim())
          .filter((q) => q);
        setSuggestedMessages(questions);
        setIsFetchingSuggestedMessages(false);
        startCooldown();
      } else {
        const data = JSON.parse(event.data);
        if (data.type === "text-delta") {
          fullText += data.delta;
          console.log("Received chunk:", data.delta);
        }
      }
    };
    eventSource.onerror = (event) => {
      console.error("Error while fetching suggested messages:", event);
      eventSource.close();
      setIsFetchingSuggestedMessages(false);
      toast.error("Failed to fetch suggested messages");
      // Use prebuilt messages as fallback
      setSuggestedMessages(getRandomMessages());
      startCooldown();
    };
  };

  React.useEffect(() => {
    // Load prebuilt messages initially
    setSuggestedMessages(getRandomMessages());
    return () => {};
  }, []);
  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col">
      {/* Theme Toggle - Fixed Position */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-50 p-3 rounded-full bg-white/90 dark:bg-black/90 backdrop-blur-sm shadow-lg hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
      >
        {theme === "light" ? (
          <Moon className="w-5 h-5 text-black dark:text-white" />
        ) : (
          <Sun className="w-5 h-5 text-black dark:text-white" />
        )}
      </button>

      <div className="flex-1 max-w-4xl mx-auto px-8 py-0 md:pt-8  my-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black dark:text-white mb-2">
            Public Profile Link
          </h1>
        </div>

        {/* Message Form */}
        <div className="mb-8">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label
                htmlFor="content"
                className="block text-sm font-semibold text-black dark:text-white mb-2"
              >
                Send Anonymous Message to @{params.username}
              </label>
              <textarea
                {...form.register("content")}
                id="content"
                rows={3}
                className="w-full px-4 py-3 border-1 border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-950 text-black dark:text-white rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white focus:border-black dark:focus:border-white resize-none"
                placeholder="Write your anonymous message here"
                disabled={isSubmitting}
              />
              {form.formState.errors.content && (
                <p className="mt-1 text-sm text-red-600">
                  {form.formState.errors.content.message}
                </p>
              )}
            </div>

            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-black hover:bg-gray-700  dark:bg-white/90 dark:hover:bg-white text-white dark:text-black font-medium py-3 px-8 rounded-lg text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending..." : "Send It"}
              </button>
            </div>
          </form>
        </div>

        {/* Suggested Messages Section */}
        <div className="mb-8">
          <p className="text-sm text-gray-500 dark:text-zinc-400 text-center mb-4">
            Click on any message below to select it.
          </p>

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Messages
            </h2>
            <button
              onClick={fetchSuggestedMessages}
              disabled={isRefreshDisabled || isFetchingSuggestedMessages}
              className="bg-gray-100 hover:bg-gray-200 dark:bg-white dark:hover:bg-gray-100 text-gray-700 dark:text-black px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isFetchingSuggestedMessages ? (
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Loading...
                </div>
              ) : isRefreshDisabled ? (
                `Refresh (${refreshCooldown}s)`
              ) : (
                "Refresh"
              )}
            </button>
          </div>

          {suggestedMessages.length > 0 ? (
            <div className="space-y-3">
              {suggestedMessages.map((message, index) => (
                <button
                  key={index}
                  onClick={() => form.setValue("content", message)}
                  className="w-full text-left p-4 bg-gray-50 hover:bg-gray-100 dark:bg-zinc-950 dark:hover:bg-gray-900 border border-gray-200 dark:border-zinc-600 rounded-lg transition-colors group"
                >
                  <span className="text-gray-700 dark:text-zinc-300 text-lg group-hover:text-gray-900 dark:group-hover:text-white">
                    {message}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              {isFetchingSuggestedMessages ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="ml-2">Generating suggestions...</span>
                </div>
              ) : (
                <p>No suggestions available. Click refresh to generate some!</p>
              )}
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <p className="text-gray-600 dark:text-zinc-400 mb-4">
            Get Your Message Board
          </p>
          <Link href="/sign-up">
            <button className="bg-black hover:bg-gray-800  dark:bg-white/90 dark:hover:bg-white text-white dark:text-black font-medium py-3 px-8 rounded-lg text-lg transition-colors">
              Create Your Account
            </button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-950/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-zinc-400 mb-2">
              Built by{" "}
              <span className="text-black dark:text-white font-semibold">
                Jatin Prakash
              </span>{" "}
              • Project inspired by{" "}
              <a
                href="https://www.youtube.com/@HiteshChoudharydotcom"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black dark:text-white font-semibold hover:underline"
              >
                Hitesh Choudhary Sir
              </a>
            </p>
            <p className="text-xs text-gray-500 dark:text-zinc-500">
              Built following the tutorial:{" "}
              <a
                href="https://www.youtube.com/watch?v=YOUR_VIDEO_ID"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:underline"
              >
                Anonymous Messages App Tutorial
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserProfilePage;
