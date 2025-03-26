"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useUserData } from "@/contexts/UserContext";

export const InfoHeader = () => {
    const { dbUser, loading, error } = useUserData();
    const [greeting, setGreeting] = useState("Good Day");

    useEffect(() => {
        const getGreeting = () => {
            const hour = new Date().getHours();
            return hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";
        };
        setGreeting(getGreeting());
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        dbUser && (
            <div className="flex items-center justify-between p-5">
                {/* Welcome and username */}
                <div className="flex flex-col justify-start w-full">
                    <h1 className="lg:text-lg text-sm font-semibold text-left leading-tight text-dark dark:text-white">
                        {greeting}, @{dbUser.username}!
                    </h1>
                    <h2 className="lg:text-sm text-xs text-left leading-tight text-dark dark:text-white">
                        Welcome to CybrNinja
                    </h2>
                </div>
                {/* User details */}
                <div className="flex items-center lg:gap-2 gap-1 justify-end w-full">
                    <div className="flex flex-col">
                        <span className="lg:text-base text-xs text-right font-medium">@{dbUser.username}</span>
                        <span className="lg:text-xs text-[10px] text-gray-500 text-right">
                            {dbUser.rank?.title || "Unranked"}
                        </span>
                    </div>
                    <Link href={"/profile"}>
                        <Image
                            src={dbUser.avatar || "/assets/images/avatar.png"}
                            alt={dbUser.avatar || "User Profile Picture"}
                            width={36}
                            height={36}
                            className="rounded-full"
                        />
                    </Link>
                </div>
            </div>
        )
    );
};