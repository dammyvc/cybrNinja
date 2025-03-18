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
    "Pass Rate": <IconTrendingUp3 className="text-fifth" />
};


export const InfoCards = ({ type }: { type: string }) => {

    return (
        <div className="rounded-2xl bg-white dark:bg-dark p-4 flex-1 shadow-md dark:text-white border-t-4 odd:border-secondary even:border-accent">
            <div className="flex flex-row justify-between items-center">
                <h2 className='flex justify-start font-bold text-lg'>{type}</h2>
                {iconMap[type]}
            </div>
            <div className='flex flex-row gap-3 mt-8'>
                <span className='font-semibold'>1,000</span>
                <div className='flex gap-1 items-center'>
                    <IconCircleArrowUpFilled className='w-4 text-secondary dark:text-success' />
                    <span className='text-xs text-secondary dark:text-success'>5 points</span>
                </div>

            </div>
            <div>
                <span className='text-xs text-gray-400'>Compared to last week</span>
            </div>
        </div>
    )

}




// const UserCards = ({ type, currentXP, lastWeekXP }: { type: string, currentXP: number, lastWeekXP: number }) => {

//     const xpChange = currentXP - lastWeekXP;
//     let trendIcon;
//     let trendColor = "text-gray-500"; // Default neutral color

//     if (xpChange > 0) {
//         trendIcon = <IconCircleArrowUpFilled className="text-green-500 w-5" />;
//         trendColor = "text-green-500";
//     } else if (xpChange < 0) {
//         trendIcon = <IconCircleArrowDownFilled className="text-red-500 w-5" />;
//         trendColor = "text-red-500";
//     } else {
//         trendIcon = <IconMinus className="text-gray-500 w-5" />;
//     }

//     return (
//         <div className="rounded-2xl odd:bg-secondary/60 even:bg-accent/50 p-4 flex-1">
//             <div className="">
//                 <h2>{type}</h2>
//                 <IconStars className='' />
//             </div>
//             <div>
//                 <span>1,000</span>
//                 <IconCircleArrowUpFilled className='w-5' />
//                 <span>5 points</span>
//             </div>
//             <div>
//                 Compared to last week
//             </div>
//         </div>
//     )

// }

// export default UserCards