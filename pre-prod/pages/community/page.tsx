import CommunityComponent from "../../community/communityComponent";
import LeftNavbar from "@/components/navbar/left-navbar";
import MobileNavBar from "@/components/navbar/mobile-nav-bar";

const Project = () => {
  return (
    <div className="mx-auto flex max-w-6xl flex-1 flex-row items-start">
      <LeftNavbar />
      <div className="my-5 flex min-h-fit flex-1 flex-row items-center md:mx-10">
        <CommunityComponent />.
      </div>

      <MobileNavBar />
    </div>
  );
};

export default Project;
