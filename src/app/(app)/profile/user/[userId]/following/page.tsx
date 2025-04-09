import LeftNavbar from "@/components/navbar/left-navbar";
import MobileNavBar from "@/components/navbar/mobile-nav-bar";
import FollowersFollowingList from "@/components/settings/followers-following-list";

export default function FollowingPage({
  params,
}: {
  params: { userId: string };
}) {
  return (
    <div className="mx-auto flex max-w-6xl flex-1 flex-row items-start">
      <LeftNavbar />
      <div className="my-5 flex min-h-fit flex-1 flex-row items-start px-[.3px]">
        <div className="container mx-auto max-w-4xl py-8">
          <h1 className="mb-6 text-3xl font-instrument">Following</h1>
          <FollowersFollowingList userId={params.userId} type="following" />
        </div>
      </div>

      <MobileNavBar />
    </div>
  );
}
