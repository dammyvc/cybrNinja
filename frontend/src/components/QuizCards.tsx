"use client"

import Image from "next/image"
import { useState } from "react";
import { IconDots } from '@tabler/icons-react';
import { CardButton } from "./CardButton";
import Link from "next/link";


export type QuizCardProps = {
    imageSrc: string;
    title: string;
    description: string;
    moreDescription: string;
    quizLink?: string;

};


export const QuizCards = ({ imageSrc, title, description, moreDescription, quizLink }: QuizCardProps) => {
    const [isModalOpen, setModalOpen] = useState(false);
    return (
        <>
            <div className="rounded-xl bg-white dark:bg-dark p-4 max-w-[345px] h-[400px] flex flex-col flex-1 shadow-md border-t-4 even:border-secondary odd:border-accent">
                {/* Header Image */}
                <div className="pb-8">
                    <Image src={imageSrc} alt={title} width={345} height={350} className="rounded-md" />
                </div>
                {/* Title and Description */}
                <div className="flex-grow">
                    <h2 className="font-bold text-lg pb-4">{title}</h2>
                    <p className="text-sm"> {description}</p>
                </div>
                {/* Button and More */}
                <div className="flex justify-between items-center pt-4">
                    <button onClick={() => setModalOpen(true)} className="bg-gray-200 dark:bg-slate-200/10 rounded-full p-1">
                        <IconDots className="cursor-pointer" />
                    </button>
                    {quizLink ? (
                        <Link href={quizLink}>
                            <CardButton variant="primary">Start Quiz</CardButton>
                        </Link>
                    ) : (
                        <CardButton variant="disabled">Start Quiz</CardButton>
                    )}
                </div>
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out animate-fadeIn">
                        <div className="bg-white dark:bg-dark p-6 rounded-lg w-[90%] max-w-md transform transition-all duration-300 scale-95 opacity-1 animate-slideUp">
                            <h2 className="text-xl font-bold">{title}</h2>
                            <p className="mt-2">{moreDescription}</p>
                            <button
                                className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
                                onClick={() => setModalOpen(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}