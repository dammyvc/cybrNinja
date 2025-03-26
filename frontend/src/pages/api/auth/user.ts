import { getAccessToken } from '@auth0/nextjs-auth0';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Get the access token from the request context
        const { accessToken } = await getAccessToken(req, res, {
            authorizationParams: {
                audience: process.env.AUTH0_API_AUDIENCE,
                scope: 'openid profile read:user'
            }
        });

        if (!accessToken) {
            return res.status(401).json({ error: 'No access token available' });
        }

        // Proxy the request to Flask backend
        const backendResponse = await fetch('http://127.0.0.1:5000/api/user', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (!backendResponse.ok) {
            const errorData = await backendResponse.json();
            return res.status(backendResponse.status).json(errorData);
        }

        const data = await backendResponse.json();
        return res.status(200).json(data);
    } catch (error) {
        console.error('API error:', error);
        return res.status(500).json({ error: 'Failed to fetch user data' });
    }
}
