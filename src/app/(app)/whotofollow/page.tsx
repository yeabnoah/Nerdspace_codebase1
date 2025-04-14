"use client";

import LeftNavbar from "@/components/navbar/left-navbar";
import UserList from "@/components/UserList";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

const Whotofollow = () => {
  const session = authClient.useSession();

  const handleFollow = (userId: string) => {
    if (session.data?.user.id === userId) {
      toast.error("You cannot follow yourself");
      return;
    }
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-1 flex-row items-start">
      <LeftNavbar />
      <UserList handleFollow={handleFollow} />
    </div>
  );
};

export default Whotofollow;
