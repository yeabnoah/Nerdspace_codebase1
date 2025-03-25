import React from "react";

const UserListSkeleton: React.FC = () => {
  return (
    <div className="container mx-auto my-5 max-w-4xl">
      <h1 className="mb-5 font-instrument text-3xl">Who to Follow</h1>
      <div className="rounded-lg bg-white p-5">
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between border-b border-gray-200 p-4 animate-pulse"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
                <div className="flex flex-col">
                  <div className="h-4 w-24 bg-gray-300 rounded"></div>
                  <div className="h-3 w-16 bg-gray-200 rounded mt-1"></div>
                </div>
              </div>
              <div className="h-8 w-20 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
        <div className="h-10 w-full bg-gray-300 rounded mt-4"></div>
      </div>
    </div>
  );
};

export default UserListSkeleton;
