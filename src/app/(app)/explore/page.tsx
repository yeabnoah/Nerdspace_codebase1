"use client";

import ExploreEntry from "@/components/explore/explore-entry";
import LeftNavbar from "@/components/navbar/left-navbar";
import MobileNavBar from "@/components/navbar/mobile-nav-bar";
import { useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import useSearchStore from "@/store/search.store";

const ExploreContent = () => {
  const searchParams = useSearchParams();
  const { setQuery } = useSearchStore();

  useEffect(() => {
    if (searchParams) {
      const query = searchParams.get("q");
      if (query) {
        setQuery(query);
      }
    }
  }, [searchParams, setQuery]);

  return (
    <div className="flex flex-col flex-1 mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-6xl">
      <div className="flex flex-col flex-1 items-start gap-4 py-4 sm:py-6">
        <div className="flex sm:flex-row flex-col sm:items-center gap-4 w-full">
          <LeftNavbar />
          <div className="flex flex-col flex-1 gap-4 w-full">
            <ExploreEntry />
          </div>
        </div>
      </div>
      <MobileNavBar />
    </div>
  );
};

const Explore = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ExploreContent />
    </Suspense>
  );
};

export default Explore;
