import { Header } from "@/sections/Header";

import { Footer } from "@/sections/Footer";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

export default function Home() {
    return (
        <>
            <Header />
            <Footer />
            <ThemeSwitcher />
        </>
    );
}