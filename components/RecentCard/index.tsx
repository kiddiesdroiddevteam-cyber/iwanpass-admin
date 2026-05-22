import Image from "next/image"
import { Header } from "../Header"
import { Paragraph } from "../Paragraph"
import Ellipse1 from "@/public/images/Ellipse1.png";

export const RecentCard = ({item}: any) => {
    return(
        <div>
          <div>
            <div className="flex justify-between mt-8">
            <div className="flex items-center flex-col">
               <Header text={item.activity} />
               <div className="flex justify-start w-full">
               <Paragraph text={item.subject} />
               <span className="rounded-full flex items-center mx-1">
                   <Image src={Ellipse1} alt="Ellipse 1" />
               </span>
               <Paragraph text="JAMB" />
               </div>
            </div>
              <div className="flex items-center mt-4">
               <Paragraph text={item.date} />
               <span className="text-5xl mb-4 mx-1 text-[#868C98]">.</span>
               <Paragraph text={item.time} />
            </div>
            </div>
            <hr className="border-t border-gray-300" />
          </div>
         </div>
    )
}