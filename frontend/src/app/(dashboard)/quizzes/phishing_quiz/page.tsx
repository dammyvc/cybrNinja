"use client";

import { Button } from "@/components/Button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUserData } from "@/contexts/UserContext";
import { useState } from "react";

export default function PhishingQuizzes() {
    const router = useRouter();
    const { dbUser, loading, error } = useUserData();
    const [isStarting, setIsStarting] = useState(false); 

    const startQuiz = async () => {
        if (!dbUser) {
            console.error("User not authenticated");
            return;
        }
        setIsStarting(true);

        try {
            const res = await fetch("/api/auth/quiz?endpoint=start", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include", 
                body: JSON.stringify({}), 
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to start quiz");
            }

            const { quiz_id } = await res.json();
            router.push(`/quizzes/phishing_quiz/attempt?quiz_id=${quiz_id}`);
        } catch (err) {
            console.error("Error starting quiz:", err);
        } finally {
            setIsStarting(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="pl-4 flex gap-4 flex-col md:flex-row mr-3 lg:mr-0 md:mr-0">
            <div className="w-full lg:2-2/3">
                <div className="flex flex-col items-center justify-center min-h-screen">
                    <Image
                        src="/assets/images/quiz_illustration.png"
                        alt="Quiz Illustration"
                        width={400}
                        height={400}
                        className="mx-auto"
                    />
                    <h2 className="text-xl font-bold mt-4">Ready for quiz</h2>
                    <p className="text-gray-600 text-sm mt-2">
                        Test yourself on phishing threats and earn mastery points!
                    </p>
                    <p className="text-gray-500 text-xs mt-1">10 questions</p>
                    {isStarting ? (
                        <p className="mt-4 text-gray-600">Creating AI GPT-Generated quiz, please wait...</p>
                    ) : (
                        <Button variant="primary" className="mt-4" onClick={startQuiz}>
                            Let's Start
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}