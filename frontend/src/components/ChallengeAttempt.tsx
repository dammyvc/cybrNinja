"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/Button";
import { Progress } from "@/components/ui/progress";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogHeader,
    DialogFooter,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useQuiz } from "@/Contexts/QuizContext";

// Updated questions array with hints
const questions = [
    {
        question: "What is the main indicator of a phishing email?",
        options: ["A personal email address", "Poor grammar and urgency", "A government email domain"],
        correct: 1,
        hint: "Look for signs that create a sense of panic or contain obvious errors."
    },
    {
        question: "Which of the following is a common phishing technique?",
        options: ["Sending fake invoices", "Using HTTPS on all websites", "Blocking pop-up ads"],
        correct: 0,
        hint: "Consider tactics that trick users into providing sensitive information."
    },
    {
        question: "Which of the following is a common phishing technique?",
        options: ["Sending fake invoices", "Using HTTPS on all websites", "Blocking pop-up ads"],
        correct: 0,
        hint: "Think about methods that impersonate legitimate businesses."
    },
    {
        question: "Which of the following is a common phishing technique?",
        options: ["Sending fake invoices", "Using HTTPS on all websites", "Blocking pop-up ads"],
        correct: 0,
        hint: "Focus on techniques that exploit trust in official communications."
    },
];

// Define a type for score tracking
interface Score {
    totalQuestions: number;
    correctAnswers: number;
    feedback: string[];
}

export default function ChallengeAttempt() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [showExitConfirmation, setShowExitConfirmation] = useState(false);
    const [showHintModal, setShowHintModal] = useState(false);
    const [timeLeft, setTimeLeft] = useState(45); // 45 seconds timer
    const [showTimeUpModal, setShowTimeUpModal] = useState(false);
    const [score, setScore] = useState<Score>({ 
        totalQuestions: questions.length, 
        correctAnswers: 0, 
        feedback: [] 
    });

    const currentQuestion = questions[currentIndex];
    const progressPercentage = ((currentIndex + 1) / questions.length) * 100;
    const router = useRouter();
    const { setScore: setGlobalScore } = useQuiz();

    // Timer effect
    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else {
            setShowTimeUpModal(true);
        }
    }, [timeLeft]);

    const handleAnswer = (index: number) => {
        setSelectedOption(index);
        const correct = index === currentQuestion.correct;
        
        // Update score
        setScore((prev) => ({
            ...prev,
            correctAnswers: correct ? prev.correctAnswers + 1 : prev.correctAnswers,
            feedback: [
                ...prev.feedback,
                correct
                    ? `Q${currentIndex + 1}: Correct!`
                    : `Q${currentIndex + 1}: Incorrect. Phishing emails often use urgent language or mimic legit sources.`
            ]
        }));

        // Immediately move to next question or end quiz
        setTimeout(() => {
            setSelectedOption(null);
            if (currentIndex < questions.length - 1) {
                setCurrentIndex((prevIndex) => prevIndex + 1);
            } else {
                // If last question, go to results
                setGlobalScore({
                    ...score,
                    correctAnswers: correct ? score.correctAnswers + 1 : score.correctAnswers
                });
                router.push("/quizzes/phishing_quiz/quiz-results");
            }
        }, 300); // Small delay for better UX
    };

    const handleExit = () => {
        setShowExitConfirmation(true);
    };

    const confirmExit = () => {
        setShowExitConfirmation(false);
        router.push("/quizzes");
    };

    const cancelExit = () => {
        setShowExitConfirmation(false);
    };

    const handleTimeUpClose = () => {
        setShowTimeUpModal(false);
        setGlobalScore(score);
        router.push("/quizzes/phishing_quiz/quiz-results");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
            <div className="w-full max-w-lg mb-4">
                <div className="text-center text-lg font-semibold mb-2">
                    Time Left: {timeLeft} seconds
                </div>
                <Progress value={progressPercentage} className="w-full" />
            </div>
            <div className="text-gray-600 text-sm mb-2">
                {currentIndex + 1} / {questions.length}
            </div>
            <div className="bg-white shadow-md rounded-lg p-6 max-w-lg w-full">
                <h2 className="text-lg font-bold mb-4">{currentQuestion.question}</h2>
                <div className="space-y-2">
                    {currentQuestion.options.map((option, index) => (
                        <button
                            key={index}
                            className="block w-full px-4 py-2 border rounded-lg text-left border-gray-300 hover:bg-gray-100"
                            onClick={() => handleAnswer(index)}
                            disabled={selectedOption !== null}
                        >
                            {option}
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
                <div className="flex justify-center items-center mt-4">
                    <Button onClick={handleExit} variant="destructive">
                        Exit Quiz
                    </Button>
                </div>
            </div>

            {/* Time Up Modal */}
            <Dialog open={showTimeUpModal} onOpenChange={setShowTimeUpModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Time's Up!</DialogTitle>
                        <p className="text-gray-600">
                            The quiz has ended. Let's see how you did!
                        </p>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={handleTimeUpClose}>View Results</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Exit Confirmation Modal */}
            <Dialog open={showExitConfirmation} onOpenChange={setShowExitConfirmation}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you sure you want to exit?</DialogTitle>
                        <p className="text-gray-600">
                            Your progress will not be saved if you exit now.
                        </p>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={cancelExit} variant="secondary">                          Cancel
                        </Button>
                        <Button onClick={confirmExit} variant="destructive">
                            Exit
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Hint Modal */}
            <Dialog open={showHintModal} onOpenChange={setShowHintModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hint</DialogTitle>
                        <p className="text-gray-600">{currentQuestion.hint}</p>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={() => setShowHintModal(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}