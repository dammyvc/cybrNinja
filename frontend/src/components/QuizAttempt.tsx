"use client";

import { useState } from "react";
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
import { useQuiz } from "@/contexts/QuizContext";


const questions = [
    {
        question: "What is a common tactic used in phishing emails?",
        options: ["Providing customer support", "Asking for personal information", "Sending security updates"],
        correct: 1,
        hint: "Phishing emails often trick users into revealing sensitive details."
    },
    {
        question: "Which of these is a red flag in an email link?",
        options: ["A well-known company domain", "A secure HTTPS link", "A shortened URL"],
        correct: 2,
        hint: "Attackers often use URL shorteners to obscure malicious links."
    },
    {
        question: "How can you verify if an email is from a legitimate sender?",
        options: ["Reply to the email to ask", "Check the sender's email address carefully", "Click the links to check the website"],
        correct: 1,
        hint: "The sender's email domain can reveal potential impersonation."
    },
    {
        question: "What should you do if you receive an unexpected email asking for sensitive information?",
        options: ["Report it to IT or security team", "Ignore and delete it", "Reply to verify the sender"],
        correct: 0,
        hint: "Organizations encourage reporting phishing attempts for security."
    },
    {
        question: "Which of the following websites might be a phishing site?",
        options: ["paypal.com", "gov.bank-secure.com", "bankofamerica.com"],
        correct: 1,
        hint: "Look for suspicious subdomains or slight misspellings."
    },
    {
        question: "What is a common social engineering tactic in phishing?",
        options: ["Creating urgency or fear", "Offering free security software", "Asking for general feedback"],
        correct: 0,
        hint: "Attackers manipulate emotions to make victims act quickly."
    },
    {
        question: "Which of these is a way to protect yourself from phishing attacks?",
        options: ["Disable browser security settings", "Enable multi-factor authentication", "Use the same password everywhere"],
        correct: 1,
        hint: "Extra layers of security make phishing attempts less effective."
    },
    {
        question: "What does a phishing email typically contain?",
        options: ["Professional language and correct branding", "A personal greeting and no links", "Grammatical errors and urgent requests"],
        correct: 2,
        hint: "Phishers often rely on urgency and poorly written content."
    },
    {
        question: "What should you do before entering credentials on a website?",
        options: ["Only enter details if the email looks official", "Check the URL for accuracy", "Ignore security warnings"],
        correct: 1,
        hint: "Always verify the domain before logging in."
    },
    {
        question: "How do attackers commonly distribute phishing scams?",
        options: ["Only through email", "Only through social media", "Phone calls, emails, and fake websites"],
        correct: 2,
        hint: "Phishing can occur across multiple communication platforms."
    }
];

export default function QuizAttempt() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [showExitConfirmation, setShowExitConfirmation] = useState(false);
    const [showHintModal, setShowHintModal] = useState(false);
    const [showChallengePrompt, setShowChallengePrompt] = useState(false);
    const [results, setResults] = useState<
        { question: string; isCorrect: boolean; selectedOption: number | null }[]
    >([]);

    const currentQuestion = questions[currentIndex];
    const progressPercentage = ((currentIndex + 1) / questions.length) * 100;
    const router = useRouter();
    const { setQuizScore } = useQuiz();

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
        // Save quiz results to context
        const quizScore = {
            totalQuestions: questions.length,
            correctAnswers: results.filter((r) => r.isCorrect).length + (isCorrect ? 1 : 0),
            feedback: results.map((r, idx) =>
                r.isCorrect
                    ? `Q${idx + 1}: Correct!`
                    : `Q${idx + 1}: Incorrect. Phishing emails often use urgent language or mimic legit sources.`
            ),
            results: [...results, { question: currentQuestion.question, isCorrect, selectedOption }],
        };
        setQuizScore(quizScore);
        setShowChallengePrompt(true);
    };

    const handleChallengeChoice = (participate: boolean) => {
        setShowChallengePrompt(false);
        if (participate) {
            router.push("/quizzes/phishing_quiz/challenge");
        } else {
            router.push("/quizzes/phishing_quiz/quiz-results");
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
                            className={`block w-full px-4 py-2 border rounded-lg text-left ${selectedOption !== null
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