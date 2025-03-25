import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LeftNavbar from "@/components/navbar/left-navbar";

const communities = [
  {
    name: "Tech Enthusiasts",
    description: "A community for tech lovers",
    image: "/hu.webp",
  },
  {
    name: "Book Club",
    description: "Discuss and share your favorite books",
    image: "/game.jpg",
  },
  {
    name: "Fitness Freaks",
    description: "Stay fit and healthy together",
    image: "/logo.jpg",
  },
];

const Community = () => {
  return (
    <div className="mx-auto flex max-w-6xl flex-1 flex-row items-start justify-center">
      <LeftNavbar />
      <div className="p-5">
        <h1 className="mb-5 text-2xl font-bold">Communities</h1>
        <div className="flex flex-wrap gap-5">
          {communities.map((community, index) => (
            <div key={index} className="min-w-[300px] flex-1">
              <Card className="bg-gray-800 text-white">
                <CardHeader>
                  <div className="mb-3 flex items-center">
                    <img
                      src={community.image}
                      alt={community.name}
                      className="mr-3 h-12 w-12 rounded-full"
                    />
                    <div>
                      <CardTitle>{community.name}</CardTitle>
                      <CardDescription className="text-gray-400">
                        Community
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p>{community.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between text-gray-400">
                  <span>1,023</span>
                  <span>86</span>
                  <span>42</span>
                  <span>12.42.21</span>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Community;
