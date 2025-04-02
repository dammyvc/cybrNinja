"use client";

import {
    IconStars,
    IconCircleArrowUpFilled,
    IconBadgeFilled,
    IconShieldCheckFilled,
    IconTrendingUp3,
} from '@tabler/icons-react';

const iconMap: Record<string, React.ReactNode> = {
    "Experience Points": <IconStars className="text-primary" />,
    "Leaderboard Position": <IconBadgeFilled className="text-secondary" />,
    "No. of Quizzes Taken": <IconShieldCheckFilled className="text-accent" />,
    "Achievements": <IconTrendingUp3 className="text-fifth" />,
};

export const InfoCards = ({ type, value}: { type: string, value: string | number }) => {
    return (
        <div className={`rounded-2xl bg-white dark:bg-dark p-4 flex-1 shadow-md dark:text-white border-t-4 ${type === "Experience Points" || type === "Streak" ? "border-secondary" : "border-accent"}`}>
            <div className="flex flex-row justify-between items-center">
                <h2 className="flex justify-start font-bold text-lg">{type}</h2>
                {iconMap[type]}
            </div>
            <div className="flex flex-row gap-3 mt-8">
                <span className="font-semibold">{value}</span>
                <div className="flex gap-1 items-center">
                    <IconCircleArrowUpFilled className="w-4 text-secondary dark:text-success" />
                    <span className="text-xs text-secondary dark:text-success">
                        {"N/A (Feature Coming Soon)"} 
                    </span>
                </div>
            </div>
            <div>
                <span className="text-xs text-gray-400">Compared to last week</span>
            </div>
        </div>
    );
};