"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const SignInPage = () => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const router = useRouter();
  //zod implementation
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    try {
      console.log("data :", data);
      const response = await signIn("credentials", {
        ...data,
        redirect: false,
      });

      if (response?.error) {
        toast.error(response?.error);
      }

      if (response?.url) {
        router.replace("/dashboard");
      }
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error in Sign-in of user", error);
      // const axiosError = error as AxiosError<ApiResponse>;
      // let errorMessage = axiosError.response?.data.message;
      toast.warning("Error");

      setIsSubmitting(false);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-zinc-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-zinc-800 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6 text-black dark:text-white">
            Join Mystery Message
          </h1>
          <p className="mb-4 text-gray-600 dark:text-zinc-400">
            Sign up to start your anonymous adventure
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black dark:text-white">
                    Email/Username
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="email or username"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                        className="h-10 bg-white dark:bg-zinc-700 text-black dark:text-white border-gray-300 dark:border-zinc-600"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black dark:text-white">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="password"
                      {...field}
                      className="h-10 bg-white dark:bg-zinc-700 text-black dark:text-white border-gray-300 dark:border-zinc-600"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="mr-2 h-10 w-full"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" /> PLease wait
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p className="text-black dark:text-white">
            Create A New Account?{" "}
            <Link
              href="/sign-up"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
