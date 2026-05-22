"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";

type ItemType = {
  name: string;
  link: string;
  icon: ReactNode;
};

type DashboardItemProps = {
  dashboardData: ItemType[];
};

export const DashboardItem = ({ dashboardData }: DashboardItemProps) => {
  const pathname = usePathname();

  return (
    <>
      {dashboardData.map((item, index) => {
        const isActive = pathname === item.link;
        return (
          <Link
            href={item.link}
            key={index}
            className={`group flex flex-row ml-2 justify-start items-center w-full cursor-pointer p-4 rounded-lg transition ${
              isActive ? 'bg-[rgba(96,165,250,0.2)]' : 'hover:bg-[rgba(96,165,250,0.2)]'
            }`}
          >
            {item.icon}

            <p className={`mt-1 text-lg px-2 ${isActive ? 'text-[rgba(6,91,255,1)] font-semibold' : 'text-[#525866] group-hover:text-[rgba(6,91,255,1)]'}`}>
              {item.name}
            </p>
          </Link>
        );
      })}
    </>
  );
};