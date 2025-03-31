"use client";

import { useState, useEffect } from "react";

interface Leader {
    rank: number;
    name: string;
    xp: number;
}

export const LeaderBoard = () => {
    const [leaders, setLeaders] = useState<Leader[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await fetch("/api/auth/leaderboard", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Failed to fetch leaderboard data");
                }

                const data = await response.json();
                setLeaders(data);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
                setError(`Error fetching leaderboard: ${errorMessage}`);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="bg-white dark:bg-dark p-4 rounded-xl shadow-md w-full border-t-4 border-secondary">
            <h2 className="font-bold text-lg pb-4">Leaderboard</h2>
            <table className="w-full text-left border-collapse">
                {/* Table Headings */}
                <thead>
                    <tr className="border-b border-gray-300 dark:border-gray-700">
                        <th className="p-2 font-semibold">Rank</th>
                        <th className="p-2 font-semibold">User</th>
                        <th className="p-2 font-semibold text-right">XP</th>
                    </tr>
                </thead>
                {/* Table Body */}
                <tbody>
                    {leaders.length > 0 ? (
                        leaders.map((leader) => (
                            <tr key={leader.rank} className="border-b border-gray-200 dark:border-gray-700">
                                <td className="p-2">{leader.rank}</td>
                                <td className="p-2">{leader.name}</td>
                                <td className="p-2 text-right">{leader.xp}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={3} className="p-2 text-center">
                                No leaderboard data available.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};