export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { accessToken } = await getAccessToken(req, res, {
            authorizationParams: {
                audience: process.env.AUTH0_API_AUDIENCE,
                scope: "openid profile update:user",
            },
        });

        if (!accessToken) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        // Ensure a file is being sent
        if (!req.body || !req.body.image) {
            return res.status(400).json({ error: "No image provided" });
        }

        // Forward the file to the backend
        const formData = new FormData();
        formData.append("image", req.body.image);

        const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload-avatar`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: formData,
        });

        const responseData = await backendResponse.json();

        if (!backendResponse.ok) {
            return res.status(backendResponse.status).json(responseData);
        }

        return res.status(200).json(responseData);
    } catch (error) {
        console.error("API error:", error);
        return res.status(500).json({ error: "Failed to upload avatar" });
    }
}