"use client";

import UserInterface from "@/interface/auth/user.interface";
import { Button } from "../ui/button";
import Image from "next/image";

const FollowList = ({ users }: { users:  UserInterface[]  }) => {
  return (
    <div className="my-5 hidden gap-2 rounded-xl border px-3 px-4 py-5 md:flex md:flex-col lg:w-[19vw]">
      <div>
        <h1 className="font-instrument text-2xl">Who to Follow</h1>
        <div className="space-y-3">
          {users.length > 0 ? (
            users.map((u) => (
              <div
                key={u.id}
                className="my-5 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Image
                    src={u.image || "/user.jpg"}
                    alt="user"
                    className="size-10 rounded-full"
                    height={200}
                    width={200}
                  />
                  <div className="flex flex-col items-start">
                    <span className="text-sm">{u.visualName}</span>
                    <span className="text-xs">{u.nerdAt}</span>
                  </div>
                </div>

                <Button
                  size="sm"
                  className="border bg-transparent text-textAlternative shadow-none hover:bg-transparent dark:text-white"
                >
                  Follow
                </Button>
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
