"use client";

import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { CardButton } from "./CardButton";
import "react-calendar/dist/Calendar.css";
import { useUserData } from "@/contexts/UserContext";

export type QuizCardProps = {
    quizLink?: string;
};

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export const CalendarView = ({ quizLink }: QuizCardProps) => {
    const { dbUser, accessToken, loading: userLoading, error: userError } = useUserData();
    const [value, onChange] = useState<Value>(new Date());
    const [timeLeft, setTimeLeft] = useState<string>("");
    const [isButtonEnabled, setIsButtonEnabled] = useState(false);
    const [hasAnsweredToday, setHasAnsweredToday] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [triviaQuestion, setTriviaQuestion] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const calculateTimeUntilMidnight = () => {
        const now = new Date();
        const midnight = new Date(now);
        midnight.setHours(24, 0, 0, 0);
        const diff = midnight.getTime() - now.getTime();

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        return `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    };

    useEffect(() => {
        const checkTriviaStatus = async () => {
            if (!dbUser || !accessToken) return;

            try {
                const response = await fetch("/api/auth/check-trivia", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${accessToken}`,
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Failed to check trivia status");
                }

                const data = await response.json();
                setHasAnsweredToday(data.hasAnsweredToday);
            } catch (err) {
                console.error("Error checking trivia status:", err);
                setError("Error checking trivia status");
            }
        };

        if (!userLoading && dbUser && accessToken) {
            checkTriviaStatus();
        }
    }, [dbUser, accessToken, userLoading]);

    // Update the timer and button state
    useEffect(() => {
        const updateTimer = () => {
            const time = calculateTimeUntilMidnight();
            setTimeLeft(time);
            setIsButtonEnabled(!hasAnsweredToday && time !== "00:00:00");
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [hasAnsweredToday]);

    // Fetch the trivia question when the button is clicked
    const fetchTriviaQuestion = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch("/api/auth/trivia-question", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to fetch trivia question");
            }

            const data = await response.json();
            setTriviaQuestion(data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
            setError(`Error fetching trivia question: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    // Handle button click to show the modal and fetch the trivia question
    const handleButtonClick = async () => {
        if (isButtonEnabled) {
            await fetchTriviaQuestion();
            if (!error && !loading) {
                setShowModal(true);
                setSelectedAnswer(null);
                setFeedback(null);
            }
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedAnswer(null);
        setFeedback(null);
        setTriviaQuestion(null);
    };

    const handleAnswerSubmit = async () => {
        if (!selectedAnswer) {
            setFeedback("Please select an answer.");
            return;
        }

        const isCorrect = selectedAnswer === triviaQuestion.correctAnswer;
        setFeedback(isCorrect ? "Correct! You've earned 10 XP." : "Incorrect. Try again tomorrow!");

        if (isCorrect) {
            try {
                const response = await fetch("/api/auth/update-xp", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({ xpToAdd: 10 }),
                });

                if (!response.ok) {
                    throw new Error("Failed to update XP");
                }
            } catch (err) {
                console.error("Error updating XP:", err);
                setFeedback("Correct! But there was an error updating your XP.");
            }
        }

        setHasAnsweredToday(true);
        setIsButtonEnabled(false);

        setTimeout(() => {
            setShowModal(false);
            setSelectedAnswer(null);
            setFeedback(null);
            setTriviaQuestion(null);
        }, 2000);
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape" && showModal) {
                handleCloseModal();
            }
        };

        if (showModal) {
            window.addEventListener("keydown", handleKeyDown);
            const modal = document.getElementById("trivia-modal");
            if (modal) {
                modal.focus();
            }
        }

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [showModal]);

    if (userLoading) return <div>Loading...</div>;
    if (userError || error) return <div>{userError || error}</div>;
    if (!dbUser || !accessToken) return <div>Please log in to access the daily trivia</div>;

    return (
        <div className="bg-white dark:bg-dark p-4 rounded-xl shadow-md border-t-4 border-fifth">
            <Calendar onChange={onChange} value={value} />
            <div className="flex flex-col gap-4">
                <div className="border-t border-gray-950/30 dark:border-gray-200/30 pt-4">
                    <h2 className="font-bold text-lg">Daily Trivia</h2>
                </div>
                <div className="flex items-center">
                    Answer daily trivia cybersecurity questions and earn points.
                </div>
                <div className="flex justify-between items-center pt-2">
                    <CardButton
                        variant={isButtonEnabled && !loading ? "primary" : "disabled"}
                        onClick={handleButtonClick}
                        disabled={!isButtonEnabled || loading}
                        aria-label={
                            isButtonEnabled
                                ? "Open daily trivia question"
                                : "Daily trivia question unavailable until next reset"
                        }
                    >
                        {loading ? "Loading..." : timeLeft}
                    </CardButton>
                </div>
            </div>

            {showModal && triviaQuestion && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="trivia-modal-title"
                    id="trivia-modal"
                    tabIndex={-1}
                >
                    <div className="bg-white dark:bg-dark p-6 rounded-lg shadow-lg max-w-md w-full border-t-4 border-fifth">
                        <div className="flex justify-between items-center mb-4">
                            <h3
                                id="trivia-modal-title"
                                className="text-lg font-bold text-gray-900 dark:text-gray-100"
                            >
                                Daily Trivia Question
                            </h3>
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1"
                                aria-label="Close daily trivia modal"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                        <p className="mb-4 text-gray-700 dark:text-gray-300">{triviaQuestion.question}</p>
                        <div className="space-y-3">
                            {triviaQuestion.options.map((option: string, index: number) => (
                                <button
                                    key={option}
                                    onClick={() => setSelectedAnswer(option)}
                                    className={`w-full p-3 text-left rounded-lg transition-colors duration-200 ${
                                        selectedAnswer === option
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600"
                                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    aria-label={`Select answer option ${index + 1}: ${option}`}
                                    aria-pressed={selectedAnswer === option}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={handleCloseModal}
                                className="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                aria-label="Cancel and close daily trivia modal"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAnswerSubmit}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                aria-label="Submit selected answer for daily trivia"
                            >
                                Submit
                            </button>
                        </div>
                        {feedback && (
                            <p
                                className={`mt-4 text-center ${
                                    feedback.includes("Correct") ? "text-green-500" : "text-red-500"
                                }`}
                                role="alert"
                            >
                                {feedback}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};