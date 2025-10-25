"use client";

import React from "react";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { Message } from "@/model/User";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "sonner";
import { format } from "date-fns";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};
const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  const handleDeleteConfirm = async () => {
    const response = await axios.delete<ApiResponse>(
      `/api/delete-message/${message._id}`
    );
    if (!response.data.success) {
      toast.error(response.data.message);
    } else {
      toast.success(response.data.message);
      onMessageDelete(message._id as string);
    }
  };
  return (
    <Card className="relative min-h-[120px] flex flex-col bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700">
      <div className="absolute top-4 right-4">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" className="h-8 w-8 p-0">
              <X className="w-4 h-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this
                message and remove it from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center text-center p-6">
        <CardTitle className="text-1xl font-semibold leading-relaxed break-words overflow-wrap-anywhere max-w-full whitespace-normal text-black dark:text-white">
          {message.content}
        </CardTitle>
        <CardDescription className="text-sm text-gray-500 dark:text-zinc-400 mt-2">
          {format(new Date(message.createdAt), "MMM dd, yyyy 'at' h:mm a")}
        </CardDescription>
      </div>
    </Card>
  );
};

export default MessageCard;
