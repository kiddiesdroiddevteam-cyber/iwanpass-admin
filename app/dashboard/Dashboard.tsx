import { DashbaordComponent } from "@/components/dashboard";
import { Header } from "@/components/Header";
import { Paragraph } from "@/components/Paragraph";
import { TopBar } from "@/components/TopBar";
import { HugeiconsIcon } from '@hugeicons/react'
import { BookOpen02Icon, StudentsIcon, Target01Icon, AiBookIcon } from '@hugeicons/core-free-icons'
import WeeklyActivityChart from "@/components/charts";
import Charts2 from "@/components/charts2";
import { Card } from "@/components/Card";
import { RecentCard } from "@/components/RecentCard";
import { getActiveUsers, getTotalPracticeTests, getTotalUsers } from "@/services/analytics";

const recentActivities = [
  {
    activity: "Question Upload",
    subject: "Mathematics",
    date: "2/23/2026",
    time: "2:27 PM"
  },
  {
    activity: "New Questions Added",
    subject: "English",
    date: "2/23/2026",
    time: "2:27 PM"
  },
  {
    activity: "Question Upload",
    subject: "Physics",
    date: "3/23/2026",
    time: "2:27 PM"
  }
]

export const Dashboard = async () => {
  const [totalUsersData, activeUsersData, totalPracticeTestsData] = await Promise.all([
    getTotalUsers(),
    getActiveUsers(),
    getTotalPracticeTests(),
  ]);

  const cardData = [
    {
      bg: "rgba(6,91,255,0.3)",
      number: totalUsersData.totalUsers.toLocaleString(),
      text: "Total Users",
      icon: <HugeiconsIcon icon={BookOpen02Icon} style={{ color: "rgb(6,91,255)" }} className="w-6 h-6" />
    },
    {
      bg: "rgba(56, 199, 147, 0.3)",
      number: activeUsersData.activeUsers.toLocaleString(),
      text: "Active Students",
      icon: <HugeiconsIcon icon={StudentsIcon} style={{ color: "#38C793" }} className="w-6 h-6" />
    },
    {
      bg: "rgba(242, 174, 64, 0.3)",
      number: totalPracticeTestsData.totalPracticeTests.toLocaleString(),
      text: "Practice Tests",
      icon: <HugeiconsIcon icon={Target01Icon} style={{ color: "#F2AE40" }} className="w-6 h-6" />
    },
    {
      bg: "rgba(241, 123, 44, 0.3)",
      number: "890",
      text: "AI Generated",
      icon: <HugeiconsIcon icon={AiBookIcon} style={{ color: "#F17B2C" }} className="w-6 h-6" />
    }
  ];

  return (
    <>
      <TopBar />
      <div className="flex h-full">

        {/* Sidebar */}
        <div style={{ border: "1px solid #E4E7EC" }} className="bg-white h-auto">
          <DashbaordComponent />
        </div>

        {/* Main Content */}
        <div className="p-4 w-full">

          <Header text="Dashboard Overview" />
          <Paragraph text="Welcome back! Here's what's happening with your exam platform." />

          <section className="mt-6">
            <div className="flex gap-4 flex-wrap">
              {cardData.map((item, index) => (
                <Card item={item} index={index} key={index} />
              ))}
            </div>

            <div className="flex h-[32rem] mt-4 gap-4">
              <WeeklyActivityChart />
              <Charts2 />
            </div>
          </section>

          <section className="mt-8 bg-white p-8 rounded-3xl border border-[#E4E7EC]">
            <Header text="Recent Activities" />
            {recentActivities.map((item, index) => (
              <RecentCard item={item} key={index} />
            ))}
          </section>

        </div>
      </div>
    </>
  )
}
