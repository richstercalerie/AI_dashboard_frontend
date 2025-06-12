// Authentication utility functions
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    isAdmin: boolean;
  };
  token?: string;
}

const API_BASE_URL = 'https://ai-personalised-dashboard.vercel.app/api/auth';

export const authAPI = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include', // Include cookies for session management
      });

      const data = await response.json();

      if (response.ok) {
        // Store authentication data in localStorage
        if (data.token) {
          localStorage.setItem('authToken', data.token);
        }
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        
        return {
          success: true,
          user: data.user,
          token: data.token,
          message: data.message || 'Login successful'
        };
      } else {
        return {
          success: false,
          message: data.message || 'Login failed'
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.'
      };
    }
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          message: data.message || 'Registration successful'
        };
      } else {
        return {
          success: false,
          message: data.message || 'Registration failed'
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.'
      };
    }
  },

  async logout(): Promise<AuthResponse> {
    try {
      
      const response = await fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        credentials: 'include',
      });

      // Clear local storage regardless of response
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');

      if (response.ok) {
        return {
          success: true,
          message: 'Logout successful'
        };
      } else {
        return {
          success: true, // Still consider it successful since we cleared local data
          message: 'Logged out locally'
        };
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Clear local storage even if network request fails
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      return {
        success: true,
        message: 'Logged out locally'
      };
    }
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    return !!(token && user);
  },

  // Get current user data
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Get auth token
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
};