import axios, { isAxiosError } from 'axios';

interface LoginCredentials {
  email: string;
  password: string;
}

export const loginUser = async ({ email, password }: LoginCredentials) => {
  try {
    const response = await axios.post(
      'http://localhost:8002/api/auth/login',
      { email, password },
      { headers: { Accept: 'application/json' } },
    );
    return response.data;
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
