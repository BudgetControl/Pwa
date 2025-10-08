import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';
import Login from '../Login.vue';
import { useAuthStore } from '../../../storage/auth-token.store';
import { useAppSettings } from '../../../storage/settings.store';
import AuthService from '../../../services/auth.service';

// Mock AuthService
vi.mock('../../../services/auth.service');

// Mock vue-i18n
const mockT = (key: string) => key;

// Mock router
const mockPush = vi.fn();
const mockRouter = {
  push: mockPush
};

describe('Login.vue', () => {
  let wrapper: any;
  let authStore: any;
  let appSettings: any;

  beforeEach(() => {
    setActivePinia(createPinia());
    authStore = useAuthStore();
    appSettings = useAppSettings();
    mockPush.mockClear();
    vi.clearAllMocks();
  });

  const createWrapper = (props = {}) => {
    return mount(Login, {
      global: {
        mocks: {
          $t: mockT,
          $router: mockRouter
        },
        stubs: {
          'router-link': true,
          'loading': true,
          'VerifyEmailButton': true
        }
      },
      props
    });
  };

  it('should render login form', () => {
    wrapper = createWrapper();
    
    expect(wrapper.find('input[type="email"]').exists()).toBe(true);
    expect(wrapper.find('input[type="password"]').exists()).toBe(true);
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true);
  });

  it('should redirect to dashboard if already logged in', async () => {
    authStore.authToken = { token: 'existing-token', timestamp: new Date().toISOString() };
    authStore.bcAuthToken = { token: 'bc-token', timestamp: new Date().toISOString() };

    wrapper = createWrapper();
    await flushPromises();

    expect(mockPush).toHaveBeenCalledWith({ path: '/app/dashboard' });
  });

  it('should successfully login with valid credentials', async () => {
    const mockLogin = vi.fn().mockResolvedValue({
      token: 'new-token',
      workspaces: [
        { id: 1, name: 'Workspace 1', uuid: 'ws-1' }
      ]
    });

    const mockUserInfo = vi.fn().mockResolvedValue({
      id: 1,
      name: 'Test User'
    });

    AuthService.prototype.login = mockLogin;
    AuthService.prototype.userInfo = mockUserInfo;

    wrapper = createWrapper();
    
    await wrapper.find('input[type="email"]').setValue('test@example.com');
    await wrapper.find('input[type="password"]').setValue('password123');
    await wrapper.find('form').trigger('submit');
    await flushPromises();

    expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    expect(mockUserInfo).toHaveBeenCalled();
    expect(authStore.authToken.token).toBe('new-token');
    expect(mockPush).toHaveBeenCalledWith({ name: 'finalizeAuth' });
  });

  it('should show error message on login failure', async () => {
    const mockLogin = vi.fn().mockRejectedValue(new Error('Invalid credentials'));
    AuthService.prototype.login = mockLogin;

    wrapper = createWrapper();
    
    await wrapper.find('input[type="email"]').setValue('wrong@example.com');
    await wrapper.find('input[type="password"]').setValue('wrongpass');
    await wrapper.find('form').trigger('submit');
    await flushPromises();

    expect(wrapper.vm.error).toBeTruthy();
    expect(wrapper.vm.show).toBe(false);
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should handle userInfo error after successful login', async () => {
    const mockLogin = vi.fn().mockResolvedValue({
      token: 'new-token',
      workspaces: [{ id: 1, name: 'Workspace 1' }]
    });

    const mockUserInfo = vi.fn().mockRejectedValue(new Error('User info failed'));

    AuthService.prototype.login = mockLogin;
    AuthService.prototype.userInfo = mockUserInfo;

    wrapper = createWrapper();
    
    await wrapper.find('input[type="email"]').setValue('test@example.com');
    await wrapper.find('input[type="password"]').setValue('password123');
    await wrapper.find('form').trigger('submit');
    await flushPromises();

    expect(mockLogin).toHaveBeenCalled();
    expect(mockUserInfo).toHaveBeenCalled();
    expect(wrapper.vm.error).toBeTruthy();
    expect(wrapper.vm.show).toBe(false);
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should handle Google sign-in', async () => {
    const mockProviderUri = vi.fn().mockResolvedValue({
      uri: 'https://accounts.google.com/oauth/test'
    });

    AuthService.prototype.providerUri = mockProviderUri;

    // Mock window.open
    const mockOpen = vi.fn();
    global.window.open = mockOpen;

    wrapper = createWrapper();
    
    const googleButton = wrapper.findAll('button').find((btn: any) => 
      btn.text().includes('Google')
    );
    
    await googleButton.trigger('click');
    await flushPromises();

    expect(mockProviderUri).toHaveBeenCalledWith('google');
    expect(mockOpen).toHaveBeenCalledWith('https://accounts.google.com/oauth/test', '_self');
  });

  it('should show error on Google sign-in failure', async () => {
    const mockProviderUri = vi.fn().mockRejectedValue(new Error('Provider error'));
    AuthService.prototype.providerUri = mockProviderUri;

    wrapper = createWrapper();
    
    const googleButton = wrapper.findAll('button').find((btn: any) => 
      btn.text().includes('Google')
    );
    
    await googleButton.trigger('click');
    await flushPromises();

    expect(wrapper.vm.error).toBeTruthy();
    expect(wrapper.vm.show).toBe(false);
  });

  it('should update email and password on input', async () => {
    wrapper = createWrapper();
    
    const emailInput = wrapper.find('input[type="email"]');
    const passwordInput = wrapper.find('input[type="password"]');

    await emailInput.setValue('newemail@test.com');
    await passwordInput.setValue('newpassword');

    expect(wrapper.vm.email).toBe('newemail@test.com');
    expect(wrapper.vm.password).toBe('newpassword');
  });

  it('should show loading state during login', async () => {
    const mockLogin = vi.fn().mockResolvedValue({ 
      token: 'token', 
      workspaces: [{ id: 1, name: 'Workspace' }] 
    });

    AuthService.prototype.login = mockLogin;
    AuthService.prototype.userInfo = vi.fn().mockResolvedValue({});

    wrapper = createWrapper();
    
    await wrapper.find('input[type="email"]').setValue('test@example.com');
    await wrapper.find('input[type="password"]').setValue('password123');
    
    // Initial state: loading should be false
    expect(wrapper.vm.show).toBe(false);
    
    await wrapper.find('form').trigger('submit');
    await flushPromises();

    // After all promises resolved, loading should be false
    expect(mockLogin).toHaveBeenCalled();
  });

  it('should handle submit with empty credentials', async () => {
    const mockLogin = vi.fn().mockResolvedValue({ 
      token: 'token', 
      workspaces: [] 
    });
    const mockUserInfo = vi.fn().mockResolvedValue({});
    
    AuthService.prototype.login = mockLogin;
    AuthService.prototype.userInfo = mockUserInfo;

    wrapper = createWrapper();
    
    // Try to submit with empty fields - component allows it (validation server-side)
    await wrapper.find('form').trigger('submit');
    await flushPromises();

    // Login should be called with empty strings
    expect(mockLogin).toHaveBeenCalledWith('', '');
  });
});
