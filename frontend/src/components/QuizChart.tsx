"use client";

import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useUserData } from "@/contexts/UserContext";

interface ChartData {
    name: string;
    questions: number;
}

export const QuizChart = () => {
    const [data, setData] = useState<ChartData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { dbUser } = useUserData();

    useEffect(() => {
        const fetchQuizStatistics = async () => {
            if (!dbUser) return;

            try {
                const res = await fetch("/api/auth/quiz-statistics", {
                    method: "GET",
                    credentials: "include",
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.error || "Failed to fetch quiz statistics");
                }

                const { data }: { data: ChartData[] } = await res.json();
                setData(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Unknown error");
            } finally {
                setLoading(false);
            }
        };

        fetchQuizStatistics();
    }, [dbUser]);

    if (loading) return <div>Loading chart...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="bg-white dark:bg-dark rounded-xl w-full h-full p-4 shadow-md border-t-4 border-primary">
            <div className="flex justify-between items-center pb-2">
                <h2 className="font-bold text-lg">Quiz Statistics</h2>
            </div>
            <ResponsiveContainer width="100%" height="90%">
                <LineChart
                    width={500}
                    height={300}
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#d1d5db" }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "#d1d5db" }} label={{ value: "Questions Answered", angle: -90, position: "insideLeft" }} />
                    <Tooltip />
                    <Legend align="center" verticalAlign="top" wrapperStyle={{ paddingTop: "10px", paddingBottom: "30px" }} />
                    <Line type="monotone" dataKey="questions" stroke="#15D17F" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

