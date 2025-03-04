import { HomeIcon, Search } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'

const MobileNavBar = () => {
  return (
    <div className="  md:hidden fixed bottom-0 flex flex-row bg-white dark:bg-textAlternative border px-3 mb-5 py-2 rounded-lg gap-2">
        <Button variant="outline" className=" border-none justify-start bg-transparent">
          <HomeIcon className="  md:block" size={20} />
        </Button>
        <Button variant="outline" className=" border-none justify-start bg-transparent">
          <Search  className="  md:block" size={20} />
        </Button>
        <Button variant="outline" className=" border-none justify-start bg-transparent">
          <HomeIcon  className="  md:block" size={20} />
        </Button>
        <Button variant="outline" className=" border-none justify-start bg-transparent">
          <HomeIcon  className="  md:block" size={20} />
        </Button>
      </div>
  )
}

export default MobileNavBar
