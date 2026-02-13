'use server'

import axios, { AxiosError } from 'axios';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { error } from 'node:console';

import fs from 'fs';

export interface User {
	id: number;
	name: string;
	email: string;
	role: 'admin' | 'user'; // Assuming these are the possible roles
}

export async function loginAction(prevState: any, formData: FormData) {
    const log = (msg: string) => fs.appendFileSync('debug.log', `${new Date().toISOString()} - ${msg}\n`);
    log("--- ACTION START ---");
	const email = formData.get('email');
	const password = formData.get('password');
    
	try {
        
		// 1. Call your Laravel Gateway via Axios
		const response = await axios.post(`http://gateway_service:8000/api/login`, 
			{"email": email, "password": password },
			{
				headers: { 'Content-Type': 'application/json' },
				// We set timeout to prevent the server action from hanging
				timeout: 5000 
			}
		);
		
		const result = response.data;
		
		// 2. Extract tokens from your specific JSON structure
		// Result is already parsed as JSON by Axios
		const { access_token, refresh_token, expires_in } = result.data.token_info.original;
		const {id, name, role} = result.data.user;

		// 3. Save to HTTP-Only Cookies
		const cookieStore = await cookies();

		cookieStore.set('access_token', access_token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: expires_in,
			path: '/',
		});

		cookieStore.set('refresh_token', refresh_token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 * 7,
			path: '/',
		});

		/**
		 * pass on user details to cookie as well, so that we can access it on the client side without making another API call
		 */
		cookieStore.set('user_id', id, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 * 7,
			path: '/',
		});

		cookieStore.set('user_name', name, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 * 7,
			path: '/',
		});

		cookieStore.set('user_role', role, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 * 7,
			path: '/',
		});

	} catch (error) {
        log(JSON.stringify({error}));
		// Handle Axios-specific errors
		if (error instanceof AxiosError) {
			const message = error.response?.data?.message || 'Invalid credentials';
			return { error: message };
		}
		return { error: 'An unexpected error occurred' };
	}

	// 4. Redirect MUST be called outside the try/catch block
	// Because redirect() works by throwing a special error that Next.js catches
	redirect('/dashboard');
}

export async function logoutAction() {
	const cookieStore = await cookies();
	
	// Delete the tokens
	cookieStore.delete('access_token');
	cookieStore.delete('refresh_token');

	// Redirect to login page
	redirect('/');
}
