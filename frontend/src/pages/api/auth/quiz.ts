import { getAccessToken } from '@auth0/nextjs-auth0';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { accessToken } = await getAccessToken(req, res, {
            authorizationParams: {
                audience: process.env.AUTH0_API_AUDIENCE,
                scope: 'openid profile read:user' 
            }
        });

        if (!accessToken) {
            return res.status(401).json({ error: 'No access token available' });
        }

        const { method, query, body } = req;
        let url = 'http://127.0.0.1:5000/api'; 

        
        if (method === 'POST' && query.endpoint === 'start') {
            url += '/quizzes/phishing/start';
        } else if (method === 'GET' && query.quiz_id) {
            url += `/quizzes/${query.quiz_id}`;
        } else if (method === 'POST' && query.endpoint === 'attempt') {
            url += '/quizzes/attempt';
        } else {
            return res.status(400).json({ error: 'Invalid request' });
        }

        const backendResponse = await fetch(url, {
            method,
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: method === 'POST' ? JSON.stringify(body) : undefined,
        });

        if (!backendResponse.ok) {
            const errorData = await backendResponse.json();
            return res.status(backendResponse.status).json(errorData);
        }

        const data = await backendResponse.json();
        return res.status(200).json(data);
    } catch (error) {
        console.error('Quiz API error:', error);
        return res.status(500).json({ error: 'Failed to process quiz request' });
    }
}