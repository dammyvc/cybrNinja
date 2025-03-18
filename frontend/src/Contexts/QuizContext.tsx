"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface QuizScore {
    totalQuestions: number;
    correctAnswers: number;
    feedback: string[];
    results: { question: string; isCorrect: boolean; selectedOption: number | null }[];
}

interface QuizContextType {
    quizScore: QuizScore | null;
    challengeScore: QuizScore | null;
    setQuizScore: (score: QuizScore) => void;
    setChallengeScore: (score: QuizScore) => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: ReactNode }) {
    const [quizScore, setQuizScore] = useState<QuizScore | null>(null);
    const [challengeScore, setChallengeScore] = useState<QuizScore | null>(null);

    return (
        <QuizContext.Provider value={{ quizScore, challengeScore, setQuizScore, setChallengeScore }}>
            {children}
        </QuizContext.Provider>
    );
}

export function useQuiz() {
    const context = useContext(QuizContext);
    if (!context) {
        throw new Error("useQuiz must be used within a QuizProvider");
    }
    return context;
}