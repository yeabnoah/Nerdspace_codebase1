import LeftNavbar from "@/components/navbar/left-navbar";
import ProjectsPage from "@/components/project/project-component";
import ProjectComponent from "@/components/project/project-component";
import React from "react";

const Project = () => {
  return (
    <div className="mx-auto flex max-w-6xl gap-5 flex-1 flex-row items-start">
      <LeftNavbar />
      <ProjectsPage />
    </div>
  );
};

export default Project;
