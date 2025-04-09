import Following from "@/components/user/following";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";

export default async function FollowingPage({
  params,
}: {
  params: { username: string };
}) {
  const session = await authClient.getSession();
  if (!session) {
    redirect("/login");
  }

  return <Following />;
} 