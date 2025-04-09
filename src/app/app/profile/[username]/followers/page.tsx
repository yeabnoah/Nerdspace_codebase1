import Follower from "@/components/user/follower";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";

export default async function FollowersPage({
  params,
}: {
  params: { username: string };
}) {
  const session = await authClient.getSession();
  if (!session) {
    redirect("/login");
  }

  return <Follower />;
} 