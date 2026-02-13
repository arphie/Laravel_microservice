'use server';

import axios from 'axios';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * Represents the structure of an IP address object from the API.
 */
export interface IpAddress {
	id: number;
	ip_address: string;
	label: string;
}

/**
 * Fetches the list of managed IP addresses from the backend API.
 * This is a server-side function that requires authentication.
 * @returns A promise that resolves to an array of IP addresses.
 */
export async function getIpList(): Promise<IpAddress[]> {
	const cookieStore = await cookies();
	const accessToken = cookieStore.get('access_token')?.value;

	if (!accessToken) {
		// If no token is found, the user is not authenticated.
		// Redirect them to the login page.
		redirect('/');
	}

	try {
		const response = await axios.get(`http://gateway_service:8000/api/ip-management/ips`, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
				Accept: 'application/json',
			},
			timeout: 5000,
		});
		// Assuming the API returns data in a structure like { data: [...] }
		return response.data.data;
	} catch (error) {
		console.error('Failed to fetch IP list:', error);
		// In case of an error (e.g., expired token, network issue),
		// we'll return an empty array to prevent the page from crashing.
		// A more robust solution might involve redirecting or showing an error message.
		if (axios.isAxiosError(error) && error.response?.status === 401) {
			redirect('/'); // Token is invalid/expired, force re-login
		}
		return [];
	}
}