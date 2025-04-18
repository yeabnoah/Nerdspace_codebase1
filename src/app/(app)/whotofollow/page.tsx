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
    <div className="relative mx-auto flex max-w-6xl flex-1 flex-row items-start">
      {/* Orange diagonal glow from bottom-left to top-right */}
      <div className="absolute -right-4 size-32 -rotate-45 rounded-full border border-blue-300/50 bg-gradient-to-br from-blue-300/40 via-blue-400/50 to-transparent blur-[150px] backdrop-blur-sm"></div>
      <div className="absolute -bottom-5 left-12 size-32 rotate-45 rounded-full border border-orange-300/50 bg-gradient-to-tl from-orange-300/40 via-orange-400/30 to-transparent blur-[150px] backdrop-blur-sm"></div>

      <LeftNavbar />
      <div className="container relative mx-auto max-w-4xl flex-1 px-4 py-8 backdrop-blur-sm">
        <h1 className="mb-6 font-instrument text-3xl">Who to Follow</h1>
        <UserList handleFollow={handleFollow} />
      </div>
    </div>
  );
};

export default Whotofollow;
