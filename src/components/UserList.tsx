import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import UserInterface from "@/interface/auth/user.interface";

interface UserListProps {
  users: UserInterface[];
  nextCursor: string | null;
  handleFollow: (userId: string) => void;
  setCursor: (cursor: string | null) => void;
}

const UserList: React.FC<UserListProps> = ({
  users,
  nextCursor,
  handleFollow,
  setCursor,
}) => {
  return (
    <div className="container mx-auto my-5 max-w-4xl">
      <h1 className="mb-5 font-instrument text-3xl">Who to Follow</h1>
      <div className="rounded-lg bg-white p-5">
        <div className="space-y-4">
          {users.length > 0 ? (
            users.map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between border-b border-gray-200 p-4"
              >
                <div className="flex items-center gap-4">
                  <Image
                    src={u.image || "/user.jpg"}
                    alt="user"
                    className="size-10 rounded-full"
                    height={200}
                    width={200}
                  />
                  <div className="flex flex-col">
                    <span className="font-semibold">{u.visualName}</span>
                    <span className="text-sm text-gray-500">
                      Nerd@{u.nerdAt}
                    </span>
                  </div>
                </div>
                <Button
                  size="sm"
                  className="border bg-transparent text-blue-500 shadow-none hover:bg-blue-50"
                  onClick={() => handleFollow(u.id)}
                >
                  Follow
                </Button>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No suggestions available</p>
          )}
        </div>
        {nextCursor && (
          <Button onClick={() => setCursor(nextCursor)} className="mt-4 w-full">
            Load More
          </Button>
        )}
      </div>
    </div>
  );
};

export default UserList;
