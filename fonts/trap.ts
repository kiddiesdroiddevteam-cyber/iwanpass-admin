// src/fonts/trap.ts
import localFont from "next/font/local";

export const trap = localFont({
  src: [
    {
      path: "./Trap-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./Trap-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./Trap-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./Trap-SemiBold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./Trap-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./Trap-ExtraBold.otf",
      weight: "800",
      style: "normal",
    },
    {
      path: "./Trap-Black.otf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-trap",
});