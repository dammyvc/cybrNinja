import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        // Fetch leaderboard data from the Flask backend
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/leaderboard`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to fetch leaderboard data");
        }

        const leaderboardData = await response.json();
        res.status(200).json(leaderboardData);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        res.status(500).json({ error: `Error fetching leaderboard data: ${errorMessage}` });
    }
}