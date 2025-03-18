import { withMiddlewareAuthRequired } from '@auth0/nextjs-auth0/edge';

export const middleware = withMiddlewareAuthRequired({
    returnTo: '/dashboard', 
});

export const config = {
    matcher: ['/dashboard/:path*'], 
};