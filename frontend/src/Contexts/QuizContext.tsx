"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface Score {
    totalQuestions: number;
    correctAnswers: number;
    feedback: string[];
}

interface QuizContextType {
    score: Score | null;
    setScore: (score: Score) => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: ReactNode }) {
    const [score, setScore] = useState<Score | null>(null);

    return (
        <QuizContext.Provider value={{ score, setScore }}>
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