import { getAccessToken } from "@auth0/nextjs-auth0";
import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";

export const config = {
    api: {
        bodyParser: false, // Disable default body parsing for multipart/form-data
    },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "PUT") {
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
            return res.status(401).json({ error: "No access token available" });
        }

        // Parse multipart/form-data
        const form = formidable({ multiples: false });
        const [fields, files] = await new Promise<[formidable.Fields, formidable.Files]>((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) reject(err);
                else resolve([fields, files]);
            });
        });

        const formData = new FormData();
        for (const key in fields) {
            formData.append(key, fields[key]![0]); // formidable returns arrays
        }
        if (files.avatar) {
            const file = files.avatar as formidable.File;
            formData.append("avatar", fs.createReadStream(file.filepath), file.originalFilename || "avatar");
        }

        const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/update-profile`, {
            method: "PUT",
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
        return res.status(500).json({ error: "Failed to update profile" });
    }
}