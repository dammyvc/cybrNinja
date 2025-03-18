import { useEffect, useState, Dispatch, SetStateAction } from "react";

type ThemeMode = "light" | "dark";

const useThemeSwitcher = (): [ThemeMode, Dispatch<SetStateAction<ThemeMode>>] => {
    const preferDarkQuery = "(prefers-color-scheme: dark)";
    const [mode, setMode] = useState<ThemeMode>("light"); // Default to 'light'

    useEffect(() => {
        const mediaQuery = window.matchMedia(preferDarkQuery);
        const userPref = window.localStorage.getItem("theme") as ThemeMode | null;

        const handleChange = () => {
            const check: ThemeMode = userPref ? userPref : mediaQuery.matches ? "dark" : "light";
            setMode(check);
            document.documentElement.classList.toggle("dark", check === "dark");
        };

        handleChange(); // Run once to set initial theme
        mediaQuery.addEventListener("change", handleChange);

        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    useEffect(() => {
        window.localStorage.setItem("theme", mode);
        document.documentElement.classList.toggle("dark", mode === "dark");
    }, [mode]);

    return [mode, setMode];
};

export default useThemeSwitcher;
