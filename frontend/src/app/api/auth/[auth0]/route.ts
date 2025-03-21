import { handleAuth, handleLogin, handleLogout } from '@auth0/nextjs-auth0';

export const GET = handleAuth({
    login: handleLogin({
        returnTo: '/dashboard', // Redirect after login
    }),
    logout: handleLogout({
        returnTo: '/', // Redirect after logout
        logoutParams: {
            returnTo: 'http://localhost:3000', // Full URL required for Auth0 logout
        },
    }),
});

export const POST = handleAuth();