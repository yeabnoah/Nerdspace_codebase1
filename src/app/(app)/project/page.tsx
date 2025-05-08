import LeftNavbar from "@/components/navbar/left-navbar";
import MobileNavBar from "@/components/navbar/mobile-nav-bar";
import ProjectsPage from "@/components/project/project-component";

const Project = () => {
  return (
    <div className="flex flex-col flex-1 mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-6xl">
      <div className="flex flex-col flex-1 items-start gap-4 py-4 sm:py-6">
        <div className="flex sm:flex-row flex-col sm:items-start gap-4 w-full">
          <LeftNavbar />
          <div className="flex flex-col flex-1 gap-4 w-full">
            <ProjectsPage />
          </div>
        </div>
      </div>
      <MobileNavBar />
    </div>
  );
};

export default Project;
