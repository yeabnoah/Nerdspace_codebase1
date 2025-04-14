import LeftNavbar from "@/components/navbar/left-navbar";
import MobileNavBar from "@/components/navbar/mobile-nav-bar";
import SoonComponent from "@/components/soon/soon";

const Project = () => {
  return (
    <div className="mx-auto flex max-w-6xl flex-1 flex-row items-start">
      <LeftNavbar />
      <div className="my-5 min-h-fit flex-1 px-[.3px] flex flex-row items-start">
        <SoonComponent />
      </div>

      <MobileNavBar />
    </div>
  );
};

export default Project;
