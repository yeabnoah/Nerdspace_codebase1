import React from 'react'
import { Button } from '../ui/button'
import { HomeIcon, Search } from 'lucide-react'

const LeftNavbar = () => {
  return (
    <div className=" hidden sticky top-20 left-0 md:w-fit  lg:w-[17vw]  md:flex md:flex-col px-5 py-5 gap-2">
    <Button variant="outline" className=" gap-3 justify-start bg-transparent">
      <HomeIcon className=" hidden md:block" size={20} />
      <span className=" hidden lg:block">Home</span>
    </Button>
    <Button variant="outline" className=" gap-3 justify-start bg-transparent">
      <Search  className=" hidden md:block" size={20} />
      <span className=" hidden lg:block">search</span>
    </Button>
    <Button variant="outline" className=" gap-3 justify-start bg-transparent">
      <HomeIcon  className=" hidden md:block" size={20} />
      <span className=" hidden lg:block">Home</span>
    </Button>
    <Button variant="outline" className=" gap-3 justify-start bg-transparent">
      <HomeIcon  className=" hidden md:block" size={20} />
      <span className=" hidden lg:block">Home</span>
    </Button>
  </div>
  )
}

export default LeftNavbar
