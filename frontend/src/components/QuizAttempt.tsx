"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/Button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogTitle, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuiz } from "@/contexts/QuizContext";
import { useUserData } from "@/contexts/UserContext";

export default function QuizAttempt() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [showHintModal, setShowHintModal] = useState(false);
    const [questions, setQuestions] = useState<any[]>([]);
    const [results, setResults] = useState<
        { question: string; isCorrect: boolean; selectedOption: number | null }[]
    >([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();
    const searchParams = useSearchParams();
    const quizId = searchParams?.get("quiz_id");
    const { setQuizScore } = useQuiz();
    const { dbUser } = useUserData();

    useEffect(() => {
        const fetchQuiz = async () => {
            if (!quizId || !dbUser) return;

            try {
                const res = await fetch(`/api/auth/quiz?quiz_id=${quizId}`, {
                    method: "GET",
                    credentials: "include",
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.error || "Failed to fetch quiz");
                }

                const { questions } = await res.json();
                setQuestions(questions);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Unknown error");
            } finally {
                setLoading(false);
            }
        };

        fetchQuiz();
    }, [quizId, dbUser]);

    if (loading) return <div>Loading quiz...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!questions.length) return <div>No questions available</div>;

    const currentQuestion = questions[currentIndex];
    const progressPercentage = ((currentIndex + 1) / questions.length) * 100;

    const handleAnswer = (index: number) => {
        setSelectedOption(index);
        const correct = currentQuestion.options[index].is_correct;
        setIsCorrect(correct);
        setResults((prev) => [
            ...prev,
            { question: currentQuestion.text, isCorrect: correct, selectedOption: index },
        ]);
        setShowModal(true);
    };

    const handleNext = () => {
        setShowModal(false);
        setSelectedOption(null);
        if (currentIndex < questions.length - 1) setCurrentIndex((prev) => prev + 1);
    };

    const handleFinishQuiz = async () => {
        setShowModal(false);
        const attemptData = {
            quiz_id: quizId,
            question_attempts: results.map((r, i) => ({
                question_id: questions[i].question_id,
                user_answer: r.selectedOption,
                is_correct: r.isCorrect,
            })),
            time_taken: 300, // Placeholder; track real time in production
        };
    
        try {
            const res = await fetch("/api/auth/quiz?endpoint=attempt", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(attemptData),
            });
    
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to submit attempt");
            }
    
            const { xp_earned, new_rank } = await res.json();
            const quizScore = {
                totalQuestions: questions.length,
                correctAnswers: results.filter((r) => r.isCorrect).length + (isCorrect ? 1 : 0),
                feedback: results.map((r, i) => {
                    const question = questions[i];
                    const correctOption = question.options.find((opt: any) => opt.is_correct);
                    return r.isCorrect
                        ? `Q${i + 1}: Correct!`
                        : `Q${i + 1}: Incorrect - Your answer: "${question.options[r.selectedOption!].text}". Correct answer: "${correctOption.text}". ${question.options[r.selectedOption!].feedback}`;
                }),
                results: [...results, { question: currentQuestion.text, isCorrect, selectedOption }],
            };
            setQuizScore(quizScore);
            router.push(`/quizzes/phishing_quiz/quiz-results?xp=${xp_earned}&rank=${new_rank}`);
        } catch (err) {
            console.error("Error submitting attempt:", err);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
            <Progress value={progressPercentage} className="w-full max-w-lg mb-4" />
            <div className="text-gray-600 text-sm mb-2">
                {currentIndex + 1} / {questions.length}
            </div>
            <div className="bg-white dark:bg-dark shadow-md rounded-lg p-6 max-w-lg w-full">
                <h2 className="text-lg font-bold mb-4">{currentQuestion.text}</h2>
                <div className="space-y-2">
                    {currentQuestion.options.map((option: any, index: number) => (
                        <button
                            key={index}
                            className={`block w-full px-4 py-2 border rounded-lg text-left ${
                                selectedOption !== null
                                    ? option.is_correct
                                        ? "bg-green-100 border-green-400"
                                        : "bg-red-100 border-red-400"
                                    : "border-gray-300 hover:bg-gray-100"
                            }`}
                            onClick={() => handleAnswer(index)}
                            disabled={selectedOption !== null}
                        >
                            {option.text}
                        </button>
                    ))}
                </div>
                <div className="mt-4">
                    <button
                        className="text-sm text-blue-600 hover:underline"
                        onClick={() => setShowHintModal(true)}
                    >
                        Need a hint?
                    </button>
                </div>
            </div>

            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{isCorrect ? "Correct!" : "Wrong Answer"}</DialogTitle>
                        <p className={`font-bold ${isCorrect ? "text-green-600" : "text-red-600"}`}>
                            {currentQuestion.options[selectedOption!]?.feedback}
                        </p>
                    </DialogHeader>
                    <DialogFooter>
                        {currentIndex < questions.length - 1 ? (
                            <Button onClick={handleNext}>Next Question</Button>
                        ) : (
                            <Button onClick={handleFinishQuiz}>Finish Quiz</Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showHintModal} onOpenChange={setShowHintModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hint</DialogTitle>
                        <p className="text-gray-600">{currentQuestion.hint}</p>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={() => setShowHintModal(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}