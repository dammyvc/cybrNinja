import type { Metadata } from "next";
import { Sora, Space_Grotesk } from "next/font/google";
import { MainSidebar } from "@/components/Sidebar";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import "../globals.css";
import { InfoHeader } from "@/components/InfoHeader";

const soraFont = Sora({
    subsets: ["latin"],
    variable: "--font-sora",
    weight: "variable",
});
const spaceGroteskFont = Space_Grotesk({
    subsets: ["latin"],
    variable: "--font-space-grotesk",
    weight: "variable",
});


export const metadata: Metadata = {
    title: "CybrNinja",
    description: "Master the art of cyber security",
    icons: {
        icon: "/web_icon.ico",
    }
};


export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (

        <div className={`${soraFont.variable} ${spaceGroteskFont.variable} antialiased font-body flex h-screen`}>
            <div className="">
                <MainSidebar />
            </div>
            <div className="overflow-y-scroll w-full">
                <InfoHeader />
                {children}

            </div>

            <ThemeSwitcher />
        </div>


    );
}