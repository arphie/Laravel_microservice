import axios, { isAxiosError } from 'axios';

const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		// 401 = Token Expired, and we haven't tried a retry yet
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				const oldRefreshToken = localStorage.getItem('refresh_token');

				// Use the refresh token to get a new access token
				const { data } = await axios.post('/api/auth/refresh', {
					refresh_token: oldRefreshToken
				});

				// According to your JSON, the new token is in data.token_info.original
				const newToken = data.data.token_info.original.access_token;
				const newRefreshToken = data.data.token_info.original.refresh_token;

				// Save new tokens
				localStorage.setItem('access_token', newToken);
				localStorage.setItem('refresh_token', newRefreshToken);

				// Retry the original request with the new token
				originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
				return api(originalRequest);
				
			} catch (refreshError) {
				// If refresh fails, the user must log in again
				localStorage.removeItem('access_token');
				localStorage.removeItem('refresh_token');
				window.location.href = '/login';
				return Promise.reject(refreshError);
			}
		}
		return Promise.reject(error);
	}
);

interface LoginCredentials {
  email: string;
  password: string;
}

export const loginUser = async ({ email, password }: LoginCredentials) => {
	try {
		const response = await axios.post(
			`${process.env.NEXT_PUBLIC_API_URL}/api/login`,
			{ email, password },
			{ headers: { Accept: 'application/json' } },
		);
		return response.data.data.token_info.original;
	} catch (error) {
		if (isAxiosError(error) && error.response) {
			// The request was made and the server responded with a status code
			// that falls out of the range of 2xx
			throw new Error(
				error.response.data.message || 'An error occurred during login.',
			);
		}
		// Something happened in setting up the request that triggered an Error
		throw new Error('An unexpected error occurred.');
	}
};

