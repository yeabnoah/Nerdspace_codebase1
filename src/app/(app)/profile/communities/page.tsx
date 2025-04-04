import { CommunityDashboard } from "@/components/community-dashboard";
import LeftNavbar from "@/components/navbar/left-navbar";
import MobileNavBar from "@/components/navbar/mobile-nav-bar";

const Project = () => {
  console.log("Project page loaded");
  return (
    <div className="mx-auto flex max-w-6xl flex-1 flex-row items-start">
      <LeftNavbar />
      <div className="my-5 flex min-h-fit flex-1 flex-row items-center md:mx-10">
        <CommunityDashboard />
      </div>

      <MobileNavBar />
    </div>
  );
};

export default Project;

