"use client";

import { User } from "better-auth";
import { Button } from "../ui/button";
import Image from "next/image";

const FollowList = ({ users }: { users: User[] }) => {
  return (
    <div className=" hidden gap-2 py-5 md:flex md:flex-col lg:w-[17vw]">
      <div>
        <h1 className="text-lg ">Who to Follow</h1>
        <div className="space-y-3">
          {users.length > 0 ? (
            users.map((u) => (
              <div key={u.id} className="flex items-center my-2 justify-between">
                <div className=" flex items-center gap-2">
                <Image
                  src={u.image || "/user.jpg"}
                  alt="user"
                  className="size-10 rounded-full"
                  height={200}
                  width={200}
                />
                <div className="flex flex-col items-start">
                  <span className="text-sm">{u.name.split(" ")[0]}</span>
                  <span className="text-xs">{u.email.split("@")[0]}</span>
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
