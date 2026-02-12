interface LoginCredentials {
  email: string;
  password: string;
}

export const loginUser = async ({ email, password }: LoginCredentials) => {
  const response = await fetch('http://localhost:8002/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'An error occurred during login.');
  }

  return data;
};