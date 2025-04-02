import type { Metadata } from "next";
import { Sora, Space_Grotesk } from "next/font/google";
import { MainSidebar } from "@/components/Sidebar";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import "../globals.css";
import { InfoHeader } from "@/components/InfoHeader";
import { QuizProvider } from "@/contexts/QuizContext";
import { UserProvider } from "@/contexts/UserContext";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
                    <QuizProvider>{children}
                    <ToastContainer
                            position="top-right"
                            autoClose={5000}
                            hideProgressBar={false}
                            newestOnTop={false}
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                            theme="light"
                        />
                    </QuizProvider>
                </div>
                <ThemeSwitcher />
            </div>
        </UserProvider>
    );
}