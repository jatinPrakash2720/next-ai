"use client";
import React from "react";
import { useSession } from "next-auth/react";

const page = () => {
  const { data: session, status } = useSession();

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Status: {status}</p>
      <p>User: {session?.user?.username}</p>
    </div>
  );
};

export default page;
