"use client";

import Image from "next/image";
import Link from "next/link";
import { useUser } from '@auth0/nextjs-auth0/client';
import { useState, useEffect } from "react";


export const InfoHeader = () => {
    
    const { user, error, isLoading } = useUser();
    const [greeting, setGreeting] = useState("Good Day");

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) {
            return "Good Morning";
        } else if (hour < 18) {
            return "Good Afternoon";
        } else {
            return "Good Evening";
        }
    };

    useEffect(() => {
        setGreeting(getGreeting());
    }, []);

    

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>{error.message}</div>;

    return (
        user && <div className="flex items-center justify-between p-5">
            {/* Welcome and username */}
            <div className="flex flex-col justify-start w-full">
                <h1 className="lg:text-lg text-sm font-semibold text-left leading-tight text-dark dark:text-white">{greeting}, {user.name}!</h1>
                <h2 className="lg:text-sm text-xs text-left leading-tight text-dark dark:text-white">Welcome to CybrNinja</h2>
            </div>
            {/* user details */}
            <div className="flex items-center lg:gap-2 gap-1 justify-end w-full">

                <div className="flex flex-col">

                    <span className="lg:text-base text-xs text-right font-medium">{user.name}</span>
                    <span className="lg:text-xs text-[10px] text-gray-500 text-right">Genin</span>

                </div>
                <Link href={"/profile"}>
                    <Image src={user.picture || "/assets/images/avatar.png"} alt={user.picture || "User Profile Picture"} width={36} height={36} className="rounded-full" />
                </Link>

            </div>

        </div>
    )
}
