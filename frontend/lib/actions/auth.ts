'use server'

import axios, { AxiosError } from 'axios';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { error } from 'node:console';

import fs from 'fs';

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
        log(JSON.stringify(result));

		// 2. Extract tokens from your specific JSON structure
		// Result is already parsed as JSON by Axios
		const { access_token, refresh_token, expires_in } = result.data.token_info.original;

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