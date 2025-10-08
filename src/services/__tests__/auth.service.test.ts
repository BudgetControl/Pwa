import { describe, it, expect, beforeEach, vi } from 'vitest';
import AuthService from '../auth.service';
import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore } from '../../storage/auth-token.store';
import { useAppSettings } from '../../storage/settings.store';

// Mock axios
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      post: vi.fn(),
      get: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() }
      }
    }))
  }
}));

describe('AuthService', () => {
  let authService: AuthService;
  let mockAxiosInstance: any;

  beforeEach(() => {
    setActivePinia(createPinia());
    authService = new AuthService();
    mockAxiosInstance = authService['instance'];
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('should successfully login with valid credentials', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'Login successful',
          token: 'mock-token-123',
          refresh_token: 'mock-refresh-token',
          id_token: 'mock-id-token',
          workspaces: [
            {
              id: 1,
              uuid: 'workspace-uuid',
              name: 'Test Workspace',
              description: 'Test Description',
              current: true,
              created_at: '2024-01-01',
              updated_at: '2024-01-01',
              deleted_at: null,
              user_id: 1
            }
          ]
        }
      };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await authService.login('test@example.com', 'password123');

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/auth/authenticate', {
        email: 'test@example.com',
        password: 'password123'
      });
      expect(result).toEqual(mockResponse.data);
      expect(result.token).toBe('mock-token-123');
      expect(result.workspaces).toHaveLength(1);
    });

    it('should throw error with invalid credentials', async () => {
      mockAxiosInstance.post.mockRejectedValue({
        response: {
          status: 401,
          data: { message: 'Invalid credentials' }
        }
      });

      await expect(authService.login('wrong@example.com', 'wrongpass')).rejects.toThrow();
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/auth/authenticate', {
        email: 'wrong@example.com',
        password: 'wrongpass'
      });
    });

    it('should handle network errors', async () => {
      mockAxiosInstance.post.mockRejectedValue(new Error('Network error'));

      await expect(authService.login('test@example.com', 'password123')).rejects.toThrow('Network error');
    });
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'Registration successful',
          user: {
            id: 1,
            name: 'Test User',
            email: 'newuser@example.com'
          }
        }
      };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const userData = {
        name: 'Test User',
        email: 'newuser@example.com',
        password: 'password123',
        confirm_password: 'password123'
      };

      const result = await authService.register(userData);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/auth/sign-up', {
        name: 'Test User',
        email: 'newuser@example.com',
        password: 'password123',
        password_confirmation: 'password123'
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('should fail when passwords do not match', async () => {
      mockAxiosInstance.post.mockRejectedValue({
        response: {
          status: 422,
          data: { message: 'Password confirmation does not match' }
        }
      });

      const userData = {
        name: 'Test User',
        email: 'newuser@example.com',
        password: 'password123',
        confirm_password: 'different'
      };

      await expect(authService.register(userData)).rejects.toThrow();
    });

    it('should fail with existing email', async () => {
      mockAxiosInstance.post.mockRejectedValue({
        response: {
          status: 422,
          data: { message: 'Email already exists' }
        }
      });

      const userData = {
        name: 'Test User',
        email: 'existing@example.com',
        password: 'password123',
        confirm_password: 'password123'
      };

      await expect(authService.register(userData)).rejects.toThrow();
    });
  });

  describe('logout', () => {
    it('should successfully logout', async () => {
      const authStore = useAuthStore();
      authStore.authToken = { token: 'mock-token', timestamp: new Date().toISOString() };

      const mockResponse = { data: { success: true } };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await authService.logout();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/auth/logout', {
        headers: {
          'Authorization': 'Bearer mock-token'
        }
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle logout errors gracefully', async () => {
      const authStore = useAuthStore();
      authStore.authToken = { token: 'mock-token', timestamp: new Date().toISOString() };

      mockAxiosInstance.get.mockRejectedValue(new Error('Server error'));

      await expect(authService.logout()).rejects.toThrow('Server error');
    });
  });

  describe('check', () => {
    it('should successfully check authentication and update token', async () => {
      const authStore = useAuthStore();
      authStore.authToken = { token: 'old-token', timestamp: new Date().toISOString() };
      authStore.bcAuthToken = { token: 'bc-token', timestamp: new Date().toISOString() };

      const mockResponse = {
        status: 200,
        data: { token: 'new-token' }
      };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await authService.check();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/auth/check', {
        headers: {
          'Authorization': 'Bearer old-token',
          'X-BC-Token': 'bc-token'
        }
      });
      expect(result.status).toBe(200);
      expect(authStore.authToken.token).toBe('new-token');
    });

    it('should fail with invalid token', async () => {
      const authStore = useAuthStore();
      authStore.authToken = { token: 'invalid-token', timestamp: new Date().toISOString() };
      authStore.bcAuthToken = { token: 'bc-token', timestamp: new Date().toISOString() };

      mockAxiosInstance.get.mockRejectedValue({
        response: { status: 401, data: { message: 'Unauthorized' } }
      });

      await expect(authService.check()).rejects.toThrow();
    });
  });

  describe('userInfo', () => {
    it('should fetch user info and setup stores', async () => {
      const authStore = useAuthStore();
      const appSettings = useAppSettings();

      const mockResponse = {
        data: {
          token: 'bc-token-123',
          userInfo: {
            id: 1,
            name: 'Test User',
            email: 'test@example.com',
            workspace_settings: {
              data: {
                currency: 'EUR',
                payment_type_id: 1
              }
            }
          }
        }
      };

      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await authService.userInfo();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/auth/user-info');
      expect(result).toEqual(mockResponse.data);
      expect(authStore.bcAuthToken.token).toBe('bc-token-123');
      expect(appSettings.settings.user).toEqual(mockResponse.data.userInfo);
      expect(appSettings.settings.currency).toBe('EUR');
      expect(appSettings.settings.payment_type_id).toBe(1);
    });

    it('should handle missing workspace settings', async () => {
      const mockResponse = {
        data: {
          token: 'bc-token-123',
          userInfo: {
            id: 1,
            name: 'Test User',
            email: 'test@example.com',
            workspace_settings: {}
          }
        }
      };

      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await authService.userInfo();

      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('recoveryPassword', () => {
    it('should send password recovery email', async () => {
      const mockResponse = {
        data: { success: true, message: 'Recovery email sent' }
      };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await authService.recoveryPassword('test@example.com');

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/auth/reset-password', {
        email: 'test@example.com'
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle invalid email', async () => {
      mockAxiosInstance.post.mockRejectedValue({
        response: {
          status: 404,
          data: { message: 'Email not found' }
        }
      });

      await expect(authService.recoveryPassword('notfound@example.com')).rejects.toThrow();
    });
  });

  describe('resetPassword', () => {
    it('should successfully reset password', async () => {
      const mockResponse = {
        data: { success: true, message: 'Password reset successful' }
      };

      mockAxiosInstance.put.mockResolvedValue(mockResponse);

      const result = await authService.resetPassword('reset-token-123', 'newpass123', 'newpass123');

      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/api/auth/reset-password/reset-token-123', {
        password: 'newpass123',
        password_confirmation: 'newpass123'
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('should fail with invalid token', async () => {
      mockAxiosInstance.put.mockRejectedValue({
        response: {
          status: 400,
          data: { message: 'Invalid or expired token' }
        }
      });

      await expect(authService.resetPassword('invalid-token', 'newpass', 'newpass')).rejects.toThrow();
    });
  });

  describe('verify', () => {
    it('should send verification email', async () => {
      const mockResponse = {
        data: { success: true, message: 'Verification email sent' }
      };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await authService.verify('test@example.com');

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/auth/verify-email', {
        email: 'test@example.com'
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('confirm', () => {
    it('should confirm email with valid token', async () => {
      const mockResponse = { status: 200 };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await authService.confirm('confirmation-token');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/auth/confirm/confirmation-token');
      expect(result).toBe(200);
    });

    it('should fail with invalid confirmation token', async () => {
      mockAxiosInstance.get.mockRejectedValue({
        response: { status: 400, data: { message: 'Invalid token' } }
      });

      await expect(authService.confirm('invalid-token')).rejects.toThrow();
    });
  });

  describe('providerUri', () => {
    it('should get Google OAuth URI', async () => {
      const mockResponse = {
        data: { uri: 'https://accounts.google.com/oauth...' }
      };

      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await authService.providerUri('google');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/auth/authenticate/google');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('token', () => {
    it('should exchange OAuth code for token', async () => {
      const appSettings = useAppSettings();
      const mockResponse = {
        data: {
          token: 'oauth-token',
          workspaces: [{ id: 1, name: 'Workspace 1' }]
        }
      };

      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await authService.token({ name: 'google', code: 'auth-code-123' });

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/auth/authenticate/token/google?code=auth-code-123');
      expect(result).toEqual(mockResponse.data);
      expect(appSettings.settings.workspaces).toEqual(mockResponse.data.workspaces);
    });
  });

  describe('finalizeRegistration', () => {
    it('should finalize registration with workspace and wallet', async () => {
      const authStore = useAuthStore();
      authStore.authToken = { token: 'auth-token', timestamp: new Date().toISOString() };

      const mockResponse = {
        data: {
          token: 'bc-token',
          userInfo: {
            id: 1,
            workspace_settings: {
              data: { currency: 'USD', payment_type_id: 2 }
            }
          }
        }
      };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const data = {
        workspace: { name: 'My Workspace', currency: 'USD', payment_type: 'card' },
        wallet: { name: 'Main', balance: 1000, type: 'bank', currency: 1, exclude_from_stats: 0, color: '#000' }
      };

      const result = await authService.finalizeRegistration('user-uuid', data);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/api/auth/user-uuid/finalize/sign-up',
        data,
        {
          headers: { 'Authorization': 'Bearer auth-token' }
        }
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('deleteUser', () => {
    it('should delete user account', async () => {
      const mockResponse = { data: { success: true } };
      mockAxiosInstance.delete.mockResolvedValue(mockResponse);

      const result = await authService.deleteUser();

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/api/auth/delete');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('deleteDataUser', () => {
    it('should delete user data', async () => {
      const mockResponse = { data: { success: true } };
      mockAxiosInstance.delete.mockResolvedValue(mockResponse);

      const result = await authService.deleteDataUser();

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/api/auth/data/delete');
      expect(result).toEqual(mockResponse);
    });
  });
});
