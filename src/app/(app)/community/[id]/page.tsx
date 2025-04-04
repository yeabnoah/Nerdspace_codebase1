"use client";

import LeftNavbar from "@/components/navbar/left-navbar";
import { use } from "react";
import ProjectDetail from "@/components/project/project-detail";

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <div className="mx-auto flex max-w-6xl flex-1 flex-row items-start">
      <LeftNavbar />
      <div className="my-5 min-h-fit flex-1 md:mx-10">
        <ProjectDetail projectId={id} />
      </div>
    </div>
  );
}
