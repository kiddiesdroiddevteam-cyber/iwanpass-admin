import Image from 'next/image';
import Logo from '../public/images/vector1.png';
import { DashboardItem } from './dashboard/dashboardItem';
import { Squares2X2Icon, ArrowUpTrayIcon, CircleStackIcon } from '@heroicons/react/24/solid'
import { ViewProfile } from './dashboard/ViewProfile';
import { HugeiconsIcon } from '@hugeicons/react'
import { DashboardSquare01Icon, Upload04Icon, DatabaseIcon, StudentsIcon } from '@hugeicons/core-free-icons'

<HugeiconsIcon icon={DatabaseIcon} />
const dashboardData = [
    {
        name: "Dashboard",
        icon: <HugeiconsIcon icon={DashboardSquare01Icon} className="w-6 h-6 mr-2 text-[#525866] group-hover:text-[rgba(6,91,255,1)]" />,
        link: "/dashboard"
    },
     {
        name: "Upload",
        icon: <HugeiconsIcon icon={Upload04Icon} className="w-6 h-6 mr-2 text-[#525866] group-hover:text-[rgba(6,91,255,1)]" />,
        link: "/upload"
    },
    {
        name: "Questions",
        icon: <HugeiconsIcon icon={DatabaseIcon} className="w-6 h-6 mr-2 text-[#525866] group-hover:text-[rgba(6,91,255,1)]" />,
        link: "/questions"
    },
     {
        name: "Students",
        icon: <HugeiconsIcon icon={StudentsIcon} className="w-6 h-6 mr-2 text-[#525866] group-hover:text-[rgba(6,91,255,1)]" />,
        link: "/students"
    }
]
export const DashbaordComponent = () => {
    return(
        <div className="w-[17rem] h-full bg-white pr-2 mr-1 flex flex-col">
  <div className="flex justify-center py-12 mb-4">
    <Image src={Logo} alt="" width={60} height={18} />
    <p
      style={{ color: "#404040" }}
      className="text-black text-lg font-bold"
    >
      IwanPass
    </p>
  </div>
  <div className="flex flex-col w-full bg-white">
    <DashboardItem dashboardData={dashboardData} />
  </div>
  <div className="mt-auto w-full">
    <ViewProfile />
  </div>

</div>
    )
}
