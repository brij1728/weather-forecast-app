import "./globals.css";

import { Inter } from "next/font/google";
import type { Metadata } from "next";
import { ThemePicker } from "../components";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Weather Forecast App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={
          inter.className +
          ` bg-[#F7F7F8] dark:bg-[#292B32] text-black dark:text-white`
        }
      >
        {/* <div className="flex justify-between pt-4 pr-12">
          <div></div>
          <ThemePicker />
        </div> */}
        <div>{children}</div>
      </body>
    </html>
  );
}
