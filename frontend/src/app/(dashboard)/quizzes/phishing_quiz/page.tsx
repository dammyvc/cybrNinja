"use client"

import { CalendarView } from "@/components/CalendarView";
import { LeaderBoard } from "@/components/LeaderBoard";
import { Button } from "@/components/Button";
import Image from "next/image";
import Link from "next/link";


export default function PhishingQuizzes() {
    
    return (
        <>
            <div className="pl-4 flex gap-4 flex-col md:flex-row mr-3 lg:mr-0 md:mr-0">
                {/* LEFT */}
                <div className="w-full lg:2-2/3">
                    <div className="flex flex-col items-center justify-center min-h-screen">
                        <Image src="/assets/images/quiz_illustration.png" alt="Quiz Illustration" width={400} height={400} className="mx-auto" />
                        <h2 className="text-xl font-bold mt-4">Ready for quiz</h2>
                        <p className="text-gray-600 text-sm mt-2">
                            Test yourself on phishing threats and earn mastery points!
                        </p>
                        <p className="text-gray-500 text-xs mt-1">10 questions • 30 - 45 minutes</p>
                        <Button variant="primary" className="mt-4">
                            <Link href="/quizzes/phishing_quiz/attempt">Let's start</Link>
                        </Button>

                    </div>

                </div>
                {/* RIGHT */}
                <div className="w-full lg:w-1/3 flex flex-col gap-8 mr-2">
                    <CalendarView />
                    
                </div>

            </div>
        </>
    )
}