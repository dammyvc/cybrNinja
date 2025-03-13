"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { useRouter } from "next/navigation";
import { useQuiz } from "@/Contexts/QuizContext";

interface Score {
    totalQuestions: number;
    correctAnswers: number;
    feedback: string[];
}

export default function QuizResults() {
    const { score } = useQuiz();
    const router = useRouter();

    const calculateXP = () => {
        return score ? score.correctAnswers * 10 : 0;
    };

    const handleBackToQuizzes = () => {
        router.push("/quizzes");
    };

    if (!score) {
        return <div>Loading results...</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
            <div className="bg-white shadow-md rounded-lg p-6 max-w-lg w-full">
                <h1 className="text-2xl font-bold mb-4 text-center">Quiz Results</h1>
                <div className="text-center mb-6">
                    <p className="text-lg">
                        You got <span className="font-bold text-green-600">{score.correctAnswers}</span> out of{" "}
                        <span className="font-bold">{score.totalQuestions}</span> questions correct!
                    </p>
                    <p className="text-lg mt-2">
                        XP Earned: <span className="font-bold text-blue-600">{calculateXP()}</span>
                    </p>
                </div>

                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Feedback</h2>
                    <ul className="list-disc pl-5 space-y-2">
                        {score.feedback.map((item, index) => (
                            <li key={index} className={item.includes("Correct") ? "text-green-600" : "text-red-600"}>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex justify-center">
                    <Button onClick={handleBackToQuizzes} variant="primary">
                        Back to Quizzes
                    </Button>
                </div>
            </div>
        </div>
    );
}