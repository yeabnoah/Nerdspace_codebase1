import { authClient } from "@/lib/auth-client";
import { prisma } from "@/lib/prisma";
import CommunitiesList from "../user/community";
import FollowList from "../user/followList";

const RightNavbar = async () => {
  const user = await authClient.getSession();
  const users: any = await prisma.user.findMany({
    where: {
      NOT: { id: user?.data?.user.id },
    },
    take: 5,
  });

  return (
    <div className="sticky left-0 top-20 md:pr-5 lg:pr-0">
      <FollowList users={users} />
      <CommunitiesList />
      {/* <TrendingTopics /> */}
    </div>
  );
};

export default RightNavbar;
