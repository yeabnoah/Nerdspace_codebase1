import ExploreEntry from "@/components/explore/explore-entry";
import LeftNavbar from "@/components/navbar/left-navbar";
import MobileNavBar from "@/components/navbar/mobile-nav-bar";

const Explore = () => {
  return (
    <div className="mx-auto flex max-w-6xl flex-1 flex-row items-start">
      <LeftNavbar />
      <div className="my-5 flex min-h-fit flex-1 flex-row items-center md:mx-10">
        <ExploreEntry />
      </div>

      <MobileNavBar />
    </div>
  );
};

export default Explore;
