import { getAccessToken } from "@auth0/nextjs-auth0";
import type { NextApiRequest, NextApiResponse } from "next";
import Busboy from "busboy";

export const config = {
    api: {
        bodyParser: false, // Disable bodyParser to handle file uploads manually
    },
};

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

        // Initialize Busboy to parse the form-data request
        const busboy = Busboy({ headers: req.headers });

        let fileBuffer: Buffer | null = null;

        busboy.on("file", (_fieldname, file) => {
            const chunks: Buffer[] = [];
            file.on("data", (chunk) => chunks.push(chunk));
            file.on("end", () => {
                fileBuffer = Buffer.concat(chunks);
            });
        });

        busboy.on("finish", async () => {
            if (!fileBuffer) {
                return res.status(400).json({ error: "No image provided" });
            }

            const formData = new FormData();
            formData.append("image", new Blob([fileBuffer]));

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
        });

        req.pipe(busboy); // Pipe request data into Busboy
    } catch (error) {
        console.error("API error:", error);
        return res.status(500).json({ error: "Failed to upload avatar" });
    }
}