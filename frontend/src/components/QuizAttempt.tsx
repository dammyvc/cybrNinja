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

export default function QuizAttempt() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [showExitConfirmation, setShowExitConfirmation] = useState(false);
    const [showHintModal, setShowHintModal] = useState(false);
    const [showChallengePrompt, setShowChallengePrompt] = useState(false);
    const [results, setResults] = useState<{ question: string; isCorrect: boolean; selectedOption: number | null }[]>([]);

    const currentQuestion = questions[currentIndex];
    const progressPercentage = ((currentIndex + 1) / questions.length) * 100;

    const router = useRouter();

    const handleAnswer = (index: number) => {
        setSelectedOption(index);
        const correct = index === currentQuestion.correct;
        setIsCorrect(correct);
        setResults((prev) => [
            ...prev,
            { question: currentQuestion.question, isCorrect: correct, selectedOption: index },
        ]);
        setShowModal(true);
    };

    const handleNext = () => {
        setShowModal(false);
        setSelectedOption(null);
        if (currentIndex < questions.length - 1) {
            setCurrentIndex((prevIndex) => prevIndex + 1);
        }
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

    const handleDialogClose = (open: boolean) => {
        setShowModal(open);
        if (!open && currentIndex < questions.length - 1) {
            setCurrentIndex((prevIndex) => prevIndex + 1);
            setSelectedOption(null);
        }
    };

    const handleFinishQuiz = () => {
        setShowModal(false);
        setShowChallengePrompt(true);
    };

    const handleChallengeChoice = (participate: boolean) => {
        setShowChallengePrompt(false);
        if (participate) {
            router.push("/quizzes/phishing_quiz/challenge"); // Redirect to timed challenge page
        } else {
            router.push("/quizzes");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
            <Progress value={progressPercentage} className="w-full max-w-lg mb-4" />
            <div className="text-gray-600 text-sm mb-2">
                {currentIndex + 1} / {questions.length}
            </div>
            <div className="bg-white dark:bg-dark shadow-md rounded-lg p-6 max-w-lg w-full">
                <h2 className="text-lg font-bold mb-4">{currentQuestion.question}</h2>
                <div className="space-y-2">
                    {currentQuestion.options.map((option, index) => (
                        <button
                            key={index}
                            className={`block w-full px-4 py-2 border rounded-lg text-left ${
                                selectedOption !== null
                                    ? index === currentQuestion.correct
                                        ? "bg-green-100 border-green-400"
                                        : "bg-red-100 border-red-400"
                                    : "border-gray-300 hover:bg-gray-100"
                            }`}
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

            {/* AI Feedback Modal */}
            <Dialog open={showModal} onOpenChange={handleDialogClose}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{isCorrect ? "Correct!" : "Wrong Answer"}</DialogTitle>
                        <p className={`font-bold ${isCorrect ? "text-green-600" : "text-red-600"}`}>
                            {isCorrect
                                ? "Great job! You identified the correct answer."
                                : "Phishing emails often contain urgent language, misspellings, and suspicious links. Be cautious!"}
                        </p>
                    </DialogHeader>
                    <DialogFooter className="flex justify-between items-center">
                        <Button onClick={handleExit} variant="destructive">
                            Exit Quiz
                        </Button>
                        {currentIndex < questions.length - 1 ? (
                            <Button onClick={handleNext}>Next Question</Button>
                        ) : (
                            <Button onClick={handleFinishQuiz}>Finish Quiz</Button>
                        )}
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
                        <Button onClick={() => setShowHintModal(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Exit Confirmation Dialog */}
            <Dialog open={showExitConfirmation} onOpenChange={setShowExitConfirmation}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you sure you want to exit?</DialogTitle>
                        <p className="text-gray-600">
                            If you exit now, your progress will not be saved, and the questions you’ve answered will not be recorded.
                        </p>
                    </DialogHeader>
                    <DialogFooter className="flex justify-between items-center">
                        <Button onClick={cancelExit} variant="secondary">
                            No, Continue Quiz
                        </Button>
                        <Button onClick={confirmExit} variant="destructive">
                            Yes, Exit
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Challenge Prompt Dialog */}
            <Dialog open={showChallengePrompt} onOpenChange={setShowChallengePrompt}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Take on a Timed Challenge?</DialogTitle>
                        <p className="text-gray-600">
                            Would you like to participate in a timed quiz challenge to test your skills further?
                        </p>
                    </DialogHeader>
                    <DialogFooter className="flex justify-between items-center">
                        <Button onClick={() => handleChallengeChoice(false)} variant="secondary">
                            No, View Results
                        </Button>
                        <Button onClick={() => handleChallengeChoice(true)}>
                            Yes, Start Challenge
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}