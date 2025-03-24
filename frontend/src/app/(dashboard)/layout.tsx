import type { Metadata } from "next";
import { Sora, Space_Grotesk } from "next/font/google";
import { MainSidebar } from "@/components/Sidebar";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import "../globals.css";
import { InfoHeader } from "@/components/InfoHeader";
import { QuizProvider } from "@/Contexts/QuizContext";
import { UserProvider } from "@auth0/nextjs-auth0/client";

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
    },
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <UserProvider>
            <div className={`${soraFont.variable} ${spaceGroteskFont.variable} antialiased font-body flex h-screen`}>
                <div>
                    <MainSidebar />
                </div>
                <div className="overflow-y-scroll w-full">
                    <InfoHeader />
                    <QuizProvider>{children}</QuizProvider>
                </div>
                <ThemeSwitcher />
            </div>
        </UserProvider>
    );
}