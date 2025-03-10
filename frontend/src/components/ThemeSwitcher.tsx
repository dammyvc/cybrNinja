"use client";

import useThemeSwitcher from "@/app/hooks/useThemeSwitcher";
import { SunIcon, MoonIcon } from "./Icons";

export const ThemeSwitcher = () => {
    const [mode, setMode] = useThemeSwitcher();

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <button
                onClick={() => setMode(mode === "light" ? "dark" : "light")}
                className={`mr-3 flex items-center justify-center rounded-full p-3 shadow-xl
                ${mode === "light" ? "bg-dark text-light" : "bg-light text-dark"}`}
            >
                {mode === "dark" ? (
                    <SunIcon className="fill-dark dark:fill-light" />
                ) : (
                    <MoonIcon className="fill-dark dark:fill-light" />
                )}
            </button>

        </div>

    );
};