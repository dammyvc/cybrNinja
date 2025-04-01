import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: "Authorization header is missing" });
    }

    const { xpToAdd } = req.body;

    if (!xpToAdd) {
        return res.status(400).json({ error: "xpToAdd is required" });
    }

    try {
        const response = await fetch("http://127.0.0.1:5000/api/update-xp", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": authHeader,
            },
            body: JSON.stringify({ xpToAdd }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to update XP");
        }

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        res.status(500).json({ error: `Error updating XP: ${errorMessage}` });
    }
}