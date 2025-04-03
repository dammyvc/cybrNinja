import { getAccessToken } from "@auth0/nextjs-auth0";
import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import FormData from "form-data";
import fetch from 'node-fetch';

export const config = {
    api: {
        bodyParser: false, 
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

        
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, _, files) => { 
            if (err) {
                console.error("Form parsing error:", err);
                return res.status(500).json({ error: "Failed to process file" });
            }

            const file = files.image?.[0];
            if (!file) {
                return res.status(400).json({ error: "No image provided" });
            }

            
            const formData = new FormData();
            formData.append("image", fs.createReadStream(file.filepath), {
                filename: file.originalFilename ?? " " ,
                contentType: file.mimetype ?? " " ,
            });

            
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
    } catch (error) {
        console.error("API error:", error);
        return res.status(500).json({ error: "Failed to upload avatar" });
    }
}