import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: "Authorization header is missing" });
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/check-trivia`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": authHeader, 
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to check trivia status");
        }

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        res.status(500).json({ error: `Error checking trivia status: ${errorMessage}` });
    }
}