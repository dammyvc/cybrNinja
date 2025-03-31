"use client";

import { Button } from "@/components/Button";
import { useRouter } from "next/navigation";
import { useQuiz } from "@/contexts/QuizContext";

interface Score {
    totalQuestions: number;
    correctAnswers: number;
    feedback: string[];
    results: { question: string; isCorrect: boolean; selectedOption: number | null }[];
}

export default function QuizResults() {
    const { quizScore } = useQuiz();
    const router = useRouter();

    const calculateXP = (score: Score | null) => {
        return score ? score.correctAnswers * 10 : 0;
    };

    const handleBackToQuizzes = () => {
        router.push("/quizzes");
    };

    if (!quizScore) {
        return <div>Loading results...</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
            <div className="bg-white shadow-md rounded-lg p-6 max-w-lg w-full">
                <h1 className="text-2xl font-bold mb-4 text-center">Quiz Results</h1>

                
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Quiz Results</h2>
                    <p className="text-lg">
                        You got <span className="font-bold text-green-600">{quizScore.correctAnswers}</span> out of{" "}
                        <span className="font-bold">{quizScore.totalQuestions}</span> questions correct!
                    </p>
                    <p className="text-lg mt-2">
                        XP Earned: <span className="font-bold text-blue-600">{calculateXP(quizScore)}</span>
                    </p>
                    <ul className="list-disc pl-5 space-y-2 mt-2 text-sm">
                        {quizScore.feedback.map((item, index) => (
                            <li
                                key={index}
                                className={item.includes("Correct") ? "text-green-600" : "text-red-600"}
                            >
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                

                {/* Total XP */}
                <div className="text-center mb-6">
                    <p className="text-lg font-semibold">
                        Total XP Earned:{" "}
                        <span className="font-bold text-blue-600">
                            {calculateXP(quizScore)}
                        </span>
                    </p>
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