"use client";


import UserInterface from "@/interface/auth/user.interface";
import { Button } from "../ui/button";
import Image from "next/image";

const FollowList = ({ users }: { users: UserInterface[] }) => {
  return (
    <div className=" hidden gap-2 px-4 py-5 md:flex md:flex-col border shadow-none dark:border-gray-500/5 border-gray-100 my-5 rounded-xl lg:w-[19vw]">
      <div>
        <h1 className="text-2xl font-instrument italic">Who to Follow</h1>
        <div className="space-y-3">
          {users.length > 0 ? (
            users.map((u) => (
              <div key={u.id} className="flex items-center my-5 justify-between">
                <div className=" flex items-center gap-2">
                <Image
                  src={u.image || "/user.jpg"}
                  alt="user"
                  className="size-10 rounded-full"
                  height={200}
                  width={200}
                />
                <div className="flex flex-col items-start">
                  <span className="text-sm">{u.visualName}</span>
                  <span className="text-[12px]">Nerd@{u.nerdAt}</span>
                </div>
                </div>

                <Button size="sm" className=" bg-transparent border dark:text-white hover:bg-transparent text-textAlternative shadow-none">Follow</Button>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No suggestions available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowList;
