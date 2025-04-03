import { getAccessToken } from "@auth0/nextjs-auth0";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Ensure that the method is PUT
    if (req.method !== "PUT") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        // Get the access token from Auth0
        const { accessToken } = await getAccessToken(req, res, {
            authorizationParams: {
                audience: process.env.AUTH0_API_AUDIENCE,
                scope: "openid profile update:user",
            },
        });

        // Check if the access token is available
        if (!accessToken) {
            return res.status(401).json({ error: "No access token available" });
        }

        // Get the update data from the request body (e.g., mimeType for the image)
        const updateData = req.body;

        // Call the backend API to get the SAS URL
        const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/generate-upload-url`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updateData),
        });

        // Parse the backend response
        const responseData = await backendResponse.json();

        // If the backend response is not ok, return the error
        if (!backendResponse.ok) {
            return res.status(backendResponse.status).json(responseData);
        }

        // Return the response to the frontend
        return res.status(200).json(responseData);
    } catch (error) {
        // Handle errors and return a 500 status if something goes wrong
        console.error("API error:", error);
        return res.status(500).json({ error: "Failed to update profile" });
    }
}