import { getAccessToken } from '@auth0/nextjs-auth0';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { accessToken } = await getAccessToken(req, res, {
            authorizationParams: {
                audience: process.env.AUTH0_API_AUDIENCE,
                scope: 'openid profile read:user',
            },
        });

        if (!accessToken) {
            return res.status(401).json({ error: 'No access token available' });
        }

        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/quizzes/statistics`;

        const backendResponse = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        const contentType = backendResponse.headers.get('content-type');
        if (!backendResponse.ok) {
            if (contentType && contentType.includes('application/json')) {
                const errorData = await backendResponse.json();
                return res.status(backendResponse.status).json(errorData);
            } else {
                const errorText = await backendResponse.text();
                console.error('Non-JSON error response:', errorText);
                return res.status(backendResponse.status).json({ error: 'Backend error: Invalid response format' });
            }
        }

        if (!contentType || !contentType.includes('application/json')) {
            const errorText = await backendResponse.text();
            console.error('Non-JSON success response:', errorText);
            return res.status(500).json({ error: 'Backend error: Expected JSON response' });
        }

        const data = await backendResponse.json();
        return res.status(200).json(data);
    } catch (error) {
        console.error('Quiz Statistics API error:', error);
        return res.status(500).json({ error: 'Failed to fetch quiz statistics' });
    }
}