import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/request';

export function middleware(request: NextRequest) {
	// 1. Get the token from the cookies
	const token = request.cookies.get('access_token')?.value;
	const { pathname } = request.nextUrl;

	// 2. Define protected routes (e.g., dashboard, settings, profile)
	const isProtectedRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/admin');
	
	// 3. Define auth routes (pages users shouldn't see if already logged in)
	const isAuthRoute = pathname === '/' || pathname === '/register';

	// Case A: No token and trying to access a protected page
	if (isProtectedRoute && !token) {
		const loginUrl = new URL('/', request.url);
		// Optional: Store the intended destination to redirect back after login
		loginUrl.searchParams.set('callbackUrl', pathname);
		return NextResponse.redirect(loginUrl);
	}

	// Case B: Has token and trying to access login/register
	if (isAuthRoute && token) {
		return NextResponse.redirect(new URL('/dashboard', request.url));
	}

	return NextResponse.next();
}

// 4. Configure which paths trigger the middleware
export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		'/((?!api|_next/static|_next/image|favicon.ico).*)',
	],
};