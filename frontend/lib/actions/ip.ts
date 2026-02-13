'use server';

import axios from 'axios';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

/**
 * Represents the structure of an IP address object from the API.
 */
export interface IpAddress {
	id: number;
	address: string;
	label: string;
	comment: string;
	user_id: number;
	created_at: string;
	updated_at: string;
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

/**
 * Adds a new IP address via a server action.
 * @param prevState - The previous state from useFormState.
 * @param formData - The form data containing the new IP details.
 * @returns An object with a message indicating success or failure.
 */
export async function addIpAction(prevState: { message: string }, formData: FormData) {
	const cookieStore = await cookies();
	const accessToken = cookieStore.get('access_token')?.value;

	if (!accessToken) {
		redirect('/');
	}

	const address = formData.get('address');
	const label = formData.get('label');
	const comment = formData.get('comment');

	try {
		
		await axios.post(
			`http://gateway_service:8000/api/ip-management/ips`,
			{
				address,
				label,
				comment,
			},
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
					Accept: 'application/json',
				},
			}
		);

		revalidatePath('/dashboard');
		return { message: 'success' };
	} catch (error) {
		console.error('Failed to add IP:', error);
		if (axios.isAxiosError(error) && error.response) {
			return { message: error.response.data.message || 'Failed to add IP address.' };
		}
		return { message: 'An unexpected error occurred.' };
	}
}

/**
 * Deletes an IP address via a server action.
 * @param formData - The form data containing the ID of the IP to delete.
 */
export async function deleteIpAction(formData: FormData) {
	const cookieStore = await cookies();
	const accessToken = cookieStore.get('access_token')?.value;

	if (!accessToken) {
		redirect('/');
	}

	const id = formData.get('id');

	if (!id) {
		return { message: 'IP ID is missing.' };
	}

	try {
		await axios.delete(`http://gateway_service:8000/api/ip-management/ips/${id}`, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
				Accept: 'application/json',
			},
		});

		revalidatePath('/dashboard');
		return { message: 'success' };
	} catch (error) {
		console.error('Failed to delete IP:', error);
		if (axios.isAxiosError(error) && error.response) {
			return { message: error.response.data.message || 'Failed to delete IP address.' };
		}
		return { message: 'An unexpected error occurred.' };
	}
}

/**
 * Updates an existing IP address via a server action.
 * @param prevState - The previous state from useFormState.
 * @param formData - The form data containing the updated IP details.
 * @returns An object with a message indicating success or failure.
 */
export async function updateIpAction(prevState: { message: string }, formData: FormData) {
	const cookieStore = await cookies();
	const accessToken = cookieStore.get('access_token')?.value;

	if (!accessToken) {
		redirect('/');
	}

	const id = formData.get('id');
	const address = formData.get('address');
	const label = formData.get('label');
	const comment = formData.get('comment');

	if (!id) {
		return { message: 'IP ID is missing.' };
	}

	try {
		await axios.patch(
			`http://gateway_service:8000/api/ip-management/ips/${id}`,
			{ address, label, comment },
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
					Accept: 'application/json',
				},
			}
		);

		revalidatePath('/dashboard');
		return { message: 'success' };
	} catch (error) {
		console.error('Failed to update IP:', error);
		if (axios.isAxiosError(error) && error.response) {
			return { message: error.response.data.message || 'Failed to update IP address.' };
		}
		return { message: 'An unexpected error occurred.' };
	}
}