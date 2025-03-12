"use client"

import { useState } from 'react';
import Calendar from 'react-calendar';
import { CardButton } from "./CardButton";
import Link from "next/link";
import 'react-calendar/dist/Calendar.css';

export type QuizCardProps = {
    
    quizLink?: string;
};

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];


export const CalendarView = ({quizLink }: QuizCardProps) => {
    const [value, onChange] = useState<Value>(new Date());
    return (
        <div className="bg-white dark:bg-dark p-4 rounded-xl shadow-md border-t-4 border-fifth">
            <Calendar onChange={onChange} value={value} />
            <div className='flex flex-col gap-4'>
                <div className='border-t border-gray-950/30 dark:border-gray-200/30 pt-4'>
                    <h2 className="font-bold text-lg">Daily Trivia</h2>
                </div>
                <div className='flex items-center'>
                    Answer daily trivia cybersecurity questions and earn points.
                </div>
                <div className="flex justify-between items-center pt-2">
                    {quizLink ? (
                        <Link href={quizLink}>
                            <CardButton variant="primary">23:00:57</CardButton>
                        </Link>
                    ) : (
                        <CardButton variant="disabled">23:00:57</CardButton>
                    )}
                </div>
            </div>
        </div>
    )
}