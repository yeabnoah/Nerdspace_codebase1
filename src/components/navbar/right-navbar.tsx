import { prisma } from "@/lib/prisma";
import FollowList from "../user/followList";
import { authClient } from "@/lib/auth-client";
import { auth } from "@/lib/auth";
import { TrendingTopics } from "../user/trending";

const RightNavbar = async () => {
  const user = await authClient.getSession();
  const users = await prisma.user.findMany({
    where: {
      NOT: { id: user?.data?.user.id },
    },
    take: 5,
  });

  return (
    <div className=" sticky left-0 top-20 md:pr-5 lg:pr-0">
      <FollowList users={users} />
      <TrendingTopics />
    </div>
  );
};

export default RightNavbar;
