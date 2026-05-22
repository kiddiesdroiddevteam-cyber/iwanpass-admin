import { Header } from "@/components/Header";
import { Paragraph } from "@/components/Paragraph";
import { ReactNode } from "react";

type CardType = {
  item: {
    icon: ReactNode,
    text: string,
    number: string,
    bg: string,
  };
  index: number;
};


export const Card = ({item, index}: CardType) => {
    return(
        <>
          <div
              key={index}
              style={{ border: "1px solid #E4E7EC" }}
              className="cursor-pointer bg-white w-[16rem] h-[7rem] rounded-xl flex items-center p-4"
            >

              <div
                className="h-10 w-10 flex items-center justify-center rounded-2xl mr-4"
                style={{ background: item.bg }}
              >
                {item.icon}
                
              </div>

              <div>
                <Paragraph text={item.text} />
                <Header text={item.number} />
              </div>

            </div>
        </>
    )
}