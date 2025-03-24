;

interface LoginResponse {
  message: string;
  data: {
    name: string;
    email: string;
  };
  accessToken: string;
  refreshToken: string;
}

interface RegisterResponse {
  message: string;
}

interface RefreshTokenResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }

  return response.json();
};

export const register = async (name: string, email: string, password: string): Promise<RegisterResponse> => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Registration failed');
  }

  return response.json();
};

export const logout = async (refreshToken: string): Promise<void> => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Logout failed');
  }
};

export const refreshTokens = async (): Promise<RefreshTokenResponse> => {
  const refreshToken = localStorage.getItem('refreshToken');
  
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/refresh-token`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${refreshToken}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Token refresh failed');
  }

  return response.json();
};