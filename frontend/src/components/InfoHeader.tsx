"use client";

import Image from "next/image";


export const InfoHeader = () => {
    
    return (
        <div className="flex items-center justify-between p-5">
            {/* Welcome and username */}
            <div className="flex flex-col justify-start w-full">
                <h1 className="lg:text-lg text-sm font-semibold text-left leading-tight text-dark dark:text-white">Good Afternoon, John!</h1>
                <h2 className="lg:text-sm text-xs text-left leading-tight text-dark dark:text-white">Welcome to CybrNinja</h2>
            </div>
            {/* user details */}
            <div className="flex items-center lg:gap-2 gap-1 justify-end w-full">
                <div className="flex flex-col">
                    <span className="lg:text-base text-xs text-right font-medium">John Doe</span>
                    <span className="lg:text-xs text-[10px] text-gray-500 text-right">Genin</span>
                </div>
                <Image src="/assets/images/avatar.png" alt="user avatar" width={36} height={36} className="rounded-full" />
            </div>
            
        </div>
    )
}
