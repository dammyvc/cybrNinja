"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";

type User = {
    username: string;
    email: string;
    avatar: string;
};

export const InfoHeader = () => {
    const { user, isLoading: authLoading, error: authError } = useUser();
    const [greeting, setGreeting] = useState("Good Day");
    const [dbUser, setDbUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getGreeting = () => {
            const hour = new Date().getHours();
            return hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";
        };
        setGreeting(getGreeting());

        const fetchUserData = async () => {
            console.log("Starting fetchUserData...");
            if (authLoading) {
                console.log("Auth still loading...");
                return;
            }
            if (authError) {
                setError("Authentication error: " + authError.message);
                setLoading(false);
                return;
            }
            if (!user) {
                console.log("User not authenticated, redirecting to login...");
                window.location.href = "/api/auth/login";
                return;
            }
            console.log("User authenticated:", user);

            try {
                console.log("Fetching user data from API...");
                const res = await fetch("/api/auth/user", {
                    credentials: "include", // Send cookies to the API route
                    signal: AbortSignal.timeout(30000),
                });
                console.log("Fetch response status:", res.status);

                if (!res.ok) {
                    const errorData = await res.json();
                    console.log("Error data:", errorData);
                    throw new Error(errorData.error || "Failed to fetch user data");
                }

                const data = await res.json();
                console.log("User data received:", data);
                setDbUser(data); // Assuming Flask returns the user object directly
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
                setError(`Error fetching user data: ${errorMessage}`);
                console.error("Error details:", err);
            } finally {
                console.log("Finally block reached, setting loading to false");
                setLoading(false);
            }
        };

        fetchUserData();
    }, [user, authLoading, authError]);

    if (loading || authLoading) {
        console.log("Rendering loading state...");
        return <div>Loading...</div>;
    }
    if (error) {
        console.log("Rendering error state:", error);
        return <div>{error}</div>;
    }
    return (
        dbUser && <div className="flex items-center justify-between p-5">
            {/* Welcome and username */}
            <div className="flex flex-col justify-start w-full">
                <h1 className="lg:text-lg text-sm font-semibold text-left leading-tight text-dark dark:text-white">{greeting}, {dbUser.username}!</h1>
                <h2 className="lg:text-sm text-xs text-left leading-tight text-dark dark:text-white">Welcome to CybrNinja</h2>
            </div>
            {/* user details */}
            <div className="flex items-center lg:gap-2 gap-1 justify-end w-full">

                <div className="flex flex-col">

                    <span className="lg:text-base text-xs text-right font-medium">{dbUser.username}</span>
                    <span className="lg:text-xs text-[10px] text-gray-500 text-right">Genin</span>

                </div>
                <Link href={"/profile"}>
                    <Image src={dbUser.avatar || "/assets/images/avatar.png"} alt={dbUser.avatar || "User Profile Picture"} width={36} height={36} className="rounded-full" />
                </Link>

            </div>

        </div>
    )
}
