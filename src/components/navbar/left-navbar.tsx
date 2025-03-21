import { Bookmark, Clock, Computer, HomeIcon, Search, TrendingUp, Users } from 'lucide-react'
import { Button } from '../ui/button'

const LeftNavbar = () => {
  return (
    <div className=" hidden sticky top-20 left-0 md:w-fit  lg:w-[17vw]  md:flex md:flex-col px-5 py-5 gap-2">
    <Button variant="outline" className=" shadow-none  gap-3 justify-start bg-transparent border-gray-100 dark:border-gray-500/5">
      <HomeIcon className=" hidden md:block" size={20} />
      <span className=" hidden lg:block">Home</span>
    </Button>
    <Button variant="outline" className=" shadow-none  gap-3 justify-start bg-transparent border-gray-100 dark:border-gray-500/5">
      <Search  className=" hidden md:block" size={20} />
      <span className=" hidden lg:block">search</span>
    </Button>
    <Button variant="outline" className=" shadow-none  gap-3 justify-start bg-transparent border-gray-100 dark:border-gray-500/5">
      <Users  className=" hidden md:block" size={20} />
      <span className=" hidden lg:block">Communities</span>
    </Button>
    <Button variant="outline" className=" shadow-none  gap-3 justify-start bg-transparent border-gray-100 dark:border-gray-500/5">
      <TrendingUp  className=" hidden md:block" size={20} />
      <span className=" hidden lg:block">Explore</span>
    </Button>
    <Button variant="outline" className=" shadow-none  gap-3 justify-start bg-transparent border-gray-100 dark:border-gray-500/5">
      <Bookmark  className=" hidden md:block" size={20} />
      <span className=" hidden lg:block">Bookmark</span>
    </Button>
    <Button variant="outline" className=" shadow-none  gap-3 justify-start bg-transparent border-gray-100 dark:border-gray-500/5">
      <Clock  className=" hidden md:block" size={20} />
      <span className=" hidden lg:block">Events</span>
    </Button>
    <Button variant="outline" className=" shadow-none  gap-3 justify-start bg-transparent border-gray-100 dark:border-gray-500/5">
      <Computer  className=" hidden md:block" size={20} />
      <span className=" hidden lg:block">Nerd AI</span>
    </Button>
  </div>
  )
}

export default LeftNavbar
