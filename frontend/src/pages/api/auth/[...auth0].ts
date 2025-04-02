import { handleAuth, handleLogin, handleLogout } from '@auth0/nextjs-auth0';
import type { NextApiRequest, NextApiResponse } from 'next';

export default handleAuth({
    async login(req: NextApiRequest, res: NextApiResponse) {
        try {
            const isSignup = req.url?.includes('/signup');

            await handleLogin(req, res, {
                returnTo: '/dashboard',
                authorizationParams: {
                    screen_hint: isSignup ? 'signup' : undefined,
                    audience: process.env.AUTH0_API_AUDIENCE, 
                    scope: 'openid profile read:user',
                },
            });
        } catch (error: any) {
            res.status(error.status || 500).end(error.message);
        }
    },
    async logout(req: NextApiRequest, res: NextApiResponse) {
        try {
            await handleLogout(req, res, {
                returnTo: '/', 
            });

            
            const auth0Domain = process.env.AUTH0_DOMAIN; 
            const clientId = process.env.AUTH0_CLIENT_ID;
            const returnTo = encodeURIComponent(`${process.env.AUTH0_BASE_URL}/`);

            res.setHeader(
                'Location',
                `https://${auth0Domain}/v2/logout?client_id=${clientId}&returnTo=${returnTo}`
            );
            res.status(302).end();
        } catch (error: unknown) {
            const err = error instanceof Error ? error : new Error('Unknown error');
            res.status('status' in err && typeof err.status === 'number' ? err.status : 500)
               .end(err.message);
        }
    },
});