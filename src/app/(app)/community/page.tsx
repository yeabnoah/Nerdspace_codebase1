<<<<<<< HEAD
import CommunityManager from "@/components/community/communities";
import LeftNavbar from "@/components/navbar/left-navbar";
import MobileNavBar from "@/components/navbar/mobile-nav-bar";

export default function CommunityPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-1 flex-row items-start justify-center">
      <LeftNavbar />

      <div className="my-5 flex min-h-fit flex-1 flex-row items-center md:mx-10">
        <CommunityManager />
      </div>
      <MobileNavBar />
    </div>
  );
}
=======
import CommunitiesPage from "@/components/community/communities";
import LeftNavbar from "@/components/navbar/left-navbar";
import MobileNavBar from "@/components/navbar/mobile-nav-bar";

const Project = () => {
  return (
    <div className="mx-auto flex max-w-6xl flex-1 flex-row items-start">
      <LeftNavbar />
      <div className="my-5 flex min-h-fit flex-1 flex-row items-center md:mx-10">
        <CommunitiesPage />
      </div>

      <MobileNavBar />
    </div>
  );
};

export default Project;
>>>>>>> 5672c434978e57a665ac1b270b223a057ef9ff7d
