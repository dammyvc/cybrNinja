"use client";
import { cn } from "@/lib/utils";
import React from "react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import {
    IconBoxAlignRightFilled,
    IconFileBroken,
    IconHighlight,
    IconZoomScan,
    IconShield,
    IconFishHook,
    IconUsersGroup,
    IconShieldLock,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import Link from "next/link";

export function ResourceGrid() {
    return (
        <BentoGrid className="mx-auto md:auto-rows-[20rem]">
            {items.map((item, i) => (
                <BentoGridItem
                    key={i}
                    title={item.title}
                    description={item.description}
                    header={item.header}
                    className={cn("[&>p:text-lg]", item.className)}
                    icon={item.icon}
                    read={item.read}
                />
            ))}
        </BentoGrid>
    );
}

const SkeletonOne = () => {
    const variants = {
        initial: {
            backgroundPosition: "0 50%",
        },
        animate: {
            backgroundPosition: ["0, 50%", "100% 50%", "0 50%"],
        },
    };
    return (
        <motion.div
            initial="initial"
            animate="animate"
            variants={variants}
            transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
            }}
            className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] rounded-lg bg-dot-black/[0.2] flex-col space-y-2"
            style={{
                background:
                    "linear-gradient(-45deg, #15D17F, #1566D1, #15D150, #C4D115)",
                backgroundSize: "400% 400%",
            }}
        >
            <motion.div className="h-full w-full rounded-lg"></motion.div>
        </motion.div>
    );
};
const SkeletonTwo = () => {
    const variants = {
        initial: {
            backgroundPosition: "0 50%",
        },
        animate: {
            backgroundPosition: ["0, 50%", "100% 50%", "0 50%"],
        },
    };
    return (
        <motion.div
            initial="initial"
            animate="animate"
            variants={variants}
            transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
            }}
            className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] rounded-lg bg-dot-black/[0.2] flex-col space-y-2"
            style={{
                background:
                    "linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)",
                backgroundSize: "400% 400%",
            }}
        >
            <motion.div className="h-full w-full rounded-lg"></motion.div>
        </motion.div>
    );
};

const items = [
    {
        title: (
            <Link href="https://www.iso.org/insights" target="_blank"> 
            <span>ISO Information Security Insights</span> 
            </Link>
        ),
        description: (
            <span className="text-sm">
                Stay up-to-date with the latest security insights from the ISO.
            </span>
        ),
        header: <SkeletonOne />,
        className: "md:col-span-1",
        icon: <IconHighlight className="h-4 w-4 text-neutral-500" />,
        read: (
            <Link href="https://www.iso.org/insights" target="_blank"> 
            <span>Explore</span> 
            </Link>
        ),
    },
    {
        title: (
            <Link href="https://www.youtube.com/watch?v=UTrW-tDJQbQ" target="_blank"> 
            <span>Cyber Security Best Practices</span> 
            </Link>
        ),
        description: (
            <span className="text-sm">
                Watch this short video to learn the best practices for cyber security.
            </span>
        ),
        header: <SkeletonTwo />,
        className: "md:col-span-1",
        icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
        read: (
            <Link href="https://www.youtube.com/watch?v=UTrW-tDJQbQ" target="_blank"> 
            <span>Watch Video</span> 
            </Link>
        ),
    },
    {
        title: (
            <Link href="https://youtu.be/o0btqyGWIQw" target="_blank"> 
            <span>How to Spot a Phishing Email</span> 
            </Link>
        ),
        description: (
            <span className="text-sm">
                Watch this video to learn how to spot a phishing email.
            </span>
        ),
        header: <SkeletonOne />,
        className: "md:col-span-1",
        icon: <IconZoomScan className="h-4 w-4 text-neutral-500" />,
        read: (
            <Link href="https://youtu.be/o0btqyGWIQw" target="_blank"> 
            <span>Watch Video</span> 
            </Link>
        ),
    },

    {
        title: (
            <Link href="https://www.ncsc.gov.uk/collection/top-tips-for-staying-secure-online/" target="_blank"> 
            <span>NCSC Top Tips for Staying Secure Online</span> 
            </Link>
        ),
        description: (
            <span className="text-sm">
                Top tips to ensure you are doing all you can to secure you and your family online
            </span>
        ),
        header: <SkeletonTwo />,
        className: "md:col-span-2",
        icon: <IconShield className="h-4 w-4 text-neutral-500" />,
        read: (
            <Link href="https://www.ncsc.gov.uk/collection/top-tips-for-staying-secure-online/" target="_blank"> 
            <span>Explore</span> 
            </Link>
        ),
    },

    {
        title: (
            <Link href="https://www.ncsc.gov.uk/section/respond-recover/citizen-phishing" target="_blank"> 
            <span>How do I know if I&#39;ve been phished?</span> 
            </Link>
        ),
        description: (
            <span className="text-sm">
                If you&#39;ve received a suspicious message, it is probably a phishing attempt.
            </span>
        ),
        header: <SkeletonOne />,
        className: "md:col-span-1",
        icon: <IconFishHook className="h-4 w-4 text-neutral-500" />,
        read: (
            <Link href="https://www.ncsc.gov.uk/section/respond-recover/citizen-phishing" target="_blank"> 
            <span>Explore</span> 
            </Link>
        ),
    },
    
    {
        title: (
            <Link href="https://www.bcs.org/articles-opinion-and-research/" target="_blank"> 
            <span>BCS Information Security Insights</span> 
            </Link>
        ),
        description: (
            <span className="text-sm">
                The latest insights, ideas and perspectives from BCS and its community.
            </span>
        ),
        header: <SkeletonTwo />,
        className: "md:col-span-1",
        icon: <IconBoxAlignRightFilled className="h-4 w-4 text-neutral-500" />,
        read: (
            <Link href="https://www.bcs.org/articles-opinion-and-research/" target="_blank"> 
            <span>Explore</span> 
            </Link>
        ),
    },
    
    {
        title: (
            <Link href="https://community.isc2.org/" target="_blank"> 
            <span>ISC2 Community</span> 
            </Link>
        ),
        description: (
            <span className="text-sm">
                Join and share your cybersecurity knowledge and experience with others.
            </span>
        ),
        header: <SkeletonOne />,
        className: "md:col-span-1",
        icon: <IconUsersGroup className="h-4 w-4 text-neutral-500" />,
        read: (
            <Link href="https://community.isc2.org/" target="_blank"> 
            <span>Explore</span> 
            </Link>
        ),
    },
    
    {
        title: (
            <Link href="https://www.ncsc.gov.uk/collection/10-steps" target="_blank"> 
            <span>10 Steps to Cyber Security</span> 
            </Link>
        ),
        description: (
            <span className="text-sm">
                Guidance on how organisations can protect themselves in cyberspace.
            </span>
        ),
        header: <SkeletonTwo />,
        className: "md:col-span-1",
        icon: <IconShieldLock className="h-4 w-4 text-neutral-500" />,
        read: (
            <Link href="https://www.ncsc.gov.uk/collection/10-steps" target="_blank"> 
            <span>Explore</span> 
            </Link>
        ),
    },
];
