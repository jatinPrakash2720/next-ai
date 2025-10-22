"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { toast } from "sonner"
import { useRouter } from "next/navigation";
import { signInSchema } from "@/schemas/signInSchema";

const page = () => {
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const router = useRouter()

  //zod implementation
  const form = useForm({
    resolver:zodResolver(signInSchema),
    defaultValues:{
      identifier:"",
      password:"",
    }
  })

  return <div>page</div>;
};

export default page;
