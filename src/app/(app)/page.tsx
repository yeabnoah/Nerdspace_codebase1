import LeftNavbar from "@/components/navbar/left-navbar";
import MobileNavBar from "@/components/navbar/mobile-nav-bar";
import RightNavbar from "@/components/navbar/right-navbar";

export default function Home() {

  return (
    <div className="mx-auto flex max-w-6xl flex-1 flex-row items-start justify-center">
      <LeftNavbar />
      <div className="my-5 min-h-screen flex-1 md:mx-10">
        {/* <PostInput /> */}
        {/* <RenderPOst /> */}

        {/* <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {fetchedusers.map((user, index) => (
            <div key={index} className="flex flex-col items-center justify-center py-3 px-2 rounded-lg shadow-md">
              <img src={"/user.jpg"} alt={user.name} className="w-24 h-24 rounded-full mb-4" />
              <p className=" font-bold">{user.name.split(" ")[0]}</p>
                <p className="text-sm text-gray-500 text-center">{user.bio.split(" ").slice(0, 4).join(" ")}</p>
              <Button className="mt-4  bg-white/10 text-white rounded hover:bg-white/5">
          Follow
              </Button>
            </div>
          ))}
        </div> */}

      </div>
      <RightNavbar />
      <MobileNavBar />
    </div>
  );
}
