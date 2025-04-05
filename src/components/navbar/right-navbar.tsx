import { authClient } from "@/lib/auth-client";
import { prisma } from "@/lib/prisma";
import FollowList from "../user/followList";
import RecomendedProjects from "../user/recommend-project";

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
      <FollowList />
      <RecomendedProjects />
      
    </div>
  );
};

export default RightNavbar;
