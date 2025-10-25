"use client";

import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Message } from "@/model/User";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { useSession } from "next-auth/react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const DashboardPage = () => {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = React.useState(false);

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const { data: session } = useSession();
  const form = useForm<z.infer<typeof acceptMessageSchema>>({
    resolver: zodResolver(acceptMessageSchema),
  });

  const { watch, register, setValue } = form;

  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessageStatus = React.useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("acceptMessages", response.data.isAcceptingMessage as boolean);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message);
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = React.useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(false);
      try {
        const response = await axios.get<ApiResponse>("/api/get-messages");
        console.log("response :", response.data);
        setMessages(response.data.messages || []);
        if (refresh) {
          toast.success("Showing latest messages");
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast.error(axiosError.response?.data.message);
      } finally {
        setIsSwitchLoading(false);
        setIsLoading(false);
      }
    },
    [setIsLoading, setMessages]
  );

  React.useEffect(() => {
    if (!session || !session.user) {
      return;
    }
    fetchMessages();
    fetchAcceptMessageStatus();
  }, [session, setValue, fetchAcceptMessageStatus, fetchMessages]);

  //handle switch change
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      if (!response.data.success) {
        toast.error(response.data.message);
      } else {
        toast.success(response.data.message);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message);
    }
  };

  // const { username } = session?.user as User | undefined;
  // if (!username) {
  //   return <div>No username found</div>;
  // }

  // Check if we're on the client side before accessing window
  const baseUrl =
    typeof window !== "undefined"
      ? `${window.location.protocol}//${window.location.host}`
      : "";
  const profileUrl = `${baseUrl}/u/${session?.user?.username}`;

  const copyToClipboard = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(profileUrl);
      toast.success("Profile URL copied");
    }
  };
  if (!session || !session.user) {
    return <div>PLease login</div>;
  }
  return (
    <div className="my-8 mx-auto p-8 bg-white  dark:bg-black rounded-lg w-full max-w-6xl pt-24">
      <h1 className="text-4xl font-bold mb-4 text-black dark:text-white">
        User Dashboard
      </h1>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-22 text-black dark:text-white">
          Copy Your Unique Link
        </h2>{" "}
        <div className="flex items-center gap-0">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 h-10  bg-gray-100 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-700 text-black dark:text-white rounded-l-md "
          />
          <Button
            className="bg-primary dark:text-black text-white hover:bg-primary/90 h-10 rounded-r-md rounded-l-none border-none "
            onClick={copyToClipboard}
          >
            Copy
          </Button>
        </div>
      </div>
      <div className="mb-4">
        <Switch
          {...register("acceptMessages")}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2 text-black dark:text-white">
          Accept Messages: {acceptMessages ? "On" : "Off"}
        </span>
      </div>
      <Separator className="bg-gray-300 dark:bg-zinc-600" />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageCard
              key={message._id as string}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p className="text-black dark:text-white">No messages to display.</p>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
