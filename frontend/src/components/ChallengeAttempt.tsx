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


const questions = [
    {
        question: "Which type of phishing targets specific individuals or organizations?",
        options: ["Whaling", "Spear phishing", "Clone phishing"],
        correct: 1,
        hint: "It’s a targeted attack, often impersonating someone the victim knows."
    },
    {
        question: "What is a common sign of a phishing website?",
        options: ["A padlock icon in the browser", "Misspelled URLs or domains", "A customer support chat feature"],
        correct: 1,
        hint: "Attackers often register similar-looking domains to deceive users."
    },
    {
        question: "Which of these is a method used in vishing (voice phishing)?",
        options: ["Sending fraudulent emails", "Calling victims and pretending to be a trusted entity", "Redirecting users to fake websites"],
        correct: 1,
        hint: "Vishing relies on phone calls instead of digital messages."
    },
    {
        question: "A phishing email pretending to be from your bank asks you to log in via a provided link. What should you do?",
        options: ["Click the link to check if it's real", "Log in with your details carefully", "Visit the bank’s website directly and verify"],
        correct: 2,
        hint: "Never trust links in emails—go to the official site instead."
    },
    {
        question: "What is the main goal of a phishing attack?",
        options: ["To sell legitimate products", "To steal sensitive information", "To improve cybersecurity awareness"],
        correct: 1,
        hint: "Phishers seek valuable data like passwords or financial details."
    },
    {
        question: "How can you spot a fake login page?",
        options: ["By checking the URL carefully", "By looking at the design alone", "By seeing if it has a login button"],
        correct: 0,
        hint: "Attackers may copy designs, but they can't replicate official URLs."
    },
    {
        question: "Which security measure helps prevent phishing attacks?",
        options: ["Using multi-factor authentication", "Writing down passwords", "Ignoring software updates"],
        correct: 0,
        hint: "Extra verification steps make phishing attempts less effective."
    },
    {
        question: "Which of the following is NOT a form of phishing?",
        options: ["Smishing", "Vishing", "Cryptojacking"],
        correct: 2,
        hint: "This attack method involves hijacking devices for mining cryptocurrency."
    },
    {
        question: "What should you do if you accidentally click on a phishing link?",
        options: ["Immediately enter fake credentials", "Disconnect from the internet and scan your device", "Share the link with friends to warn them"],
        correct: 1,
        hint: "Quickly cutting off access can help prevent further damage."
    },
    {
        question: "Why do phishing emails often create a sense of urgency?",
        options: ["To force quick action without thinking", "Because they need immediate responses", "Because hackers work on tight deadlines"],
        correct: 0,
        hint: "Attackers manipulate emotions to bypass rational decision-making."
    }
];


// Define a type for score tracking
interface Score {
    totalQuestions: number;
    correctAnswers: number;
    feedback: string[];
    results: { question: string; isCorrect: boolean; selectedOption: number | null }[];
}

export default function ChallengeAttempt() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [showExitConfirmation, setShowExitConfirmation] = useState(false);
    const [showHintModal, setShowHintModal] = useState(false);
    const [timeLeft, setTimeLeft] = useState(45);
    const [showTimeUpModal, setShowTimeUpModal] = useState(false);
    const [score, setScore] = useState<Score>({
        totalQuestions: questions.length,
        correctAnswers: 0,
        feedback: [],
        results: [],
    });

    const currentQuestion = questions[currentIndex];
    const progressPercentage = ((currentIndex + 1) / questions.length) * 100;
    const router = useRouter();
    const { setChallengeScore } = useQuiz();

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

        setScore((prev) => ({
            ...prev,
            correctAnswers: correct ? prev.correctAnswers + 1 : prev.correctAnswers,
            feedback: [
                ...prev.feedback,
                correct
                    ? `Q${currentIndex + 1}: Correct!`
                    : `Q${currentIndex + 1}: Incorrect. Phishing emails often use urgent language or mimic legit sources.`,
            ],
            results: [
                ...prev.results,
                { question: currentQuestion.question, isCorrect: correct, selectedOption: index },
            ],
        }));

        setTimeout(() => {
            setSelectedOption(null);
            if (currentIndex < questions.length - 1) {
                setCurrentIndex((prevIndex) => prevIndex + 1);
            } else {
                setChallengeScore({
                    ...score,
                    correctAnswers: correct ? score.correctAnswers + 1 : score.correctAnswers,
                    results: [
                        ...score.results,
                        { question: currentQuestion.question, isCorrect: correct, selectedOption: index },
                    ],
                });
                router.push("/quizzes/phishing_quiz/quiz-results");
            }
        }, 300);
    };

    const handleTimeUpClose = () => {
        setShowTimeUpModal(false);
        setChallengeScore(score);
        router.push("/quizzes/phishing_quiz/quiz-results");
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
                        <DialogTitle>Time&#39;s Up!</DialogTitle>
                        <p className="text-gray-600">
                            The quiz has ended. Let&#39;s see how you did!
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