import { getAccessToken } from '@auth0/nextjs-auth0';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { accessToken } = await getAccessToken(req, res, {
            authorizationParams: {
                audience: process.env.AUTH0_API_AUDIENCE,
                scope: 'openid profile update:user'
            }
        });

        if (!accessToken) {
            return res.status(401).json({ error: 'No access token available' });
        }

        const updateData = req.body;

        
        const backendResponse = await fetch('http://127.0.0.1:5000/api/update-profile', {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData),
        });

        const responseData = await backendResponse.json();

        if (!backendResponse.ok) {
            return res.status(backendResponse.status).json(responseData);
        }

        return res.status(200).json(responseData);
    } catch (error) {
        console.error('API error:', error);
        return res.status(500).json({ error: 'Failed to update profile' });
    }
}