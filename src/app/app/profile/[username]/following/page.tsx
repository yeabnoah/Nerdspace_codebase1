import LeftNavbar from "@/components/navbar/left-navbar";
import MobileNavBar from "@/components/navbar/mobile-nav-bar";
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

  return (
    <div className="mx-auto flex max-w-6xl flex-1 flex-row items-start">
      <LeftNavbar />
      <div className="my-5 flex min-h-fit flex-1 flex-row items-start px-[.3px]">
        <Following />
      </div>

      <MobileNavBar />
    </div>
  );
}
