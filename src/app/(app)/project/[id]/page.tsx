"use client ";

import LeftNavbar from "@/components/navbar/left-navbar";

export default function StuffPage({ params }: { params: { id: string } }) {
  return (
    <div className="mx-auto flex max-w-6xl flex-1 flex-row items-start">
      <LeftNavbar />
      <div className="my-5 min-h-fit flex-1 md:mx-10">
        procect id : {params.id}
      </div>
    </div>
  );
}
