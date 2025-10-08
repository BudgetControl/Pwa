import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore } from '../auth-token.store';

describe('Auth Token Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should initialize with empty tokens', () => {
    const store = useAuthStore();
    
    expect(store.authToken).toEqual({});
    expect(store.bcAuthToken).toEqual({});
  });

  it('should set authToken', () => {
    const store = useAuthStore();
    const token = { token: 'test-token', timestamp: new Date().toISOString() };
    
    store.authToken = token;
    
    expect(store.authToken).toEqual(token);
    expect(store.authToken.token).toBe('test-token');
  });

  it('should set bcAuthToken', () => {
    const store = useAuthStore();
    const token = { token: 'bc-test-token', timestamp: new Date().toISOString() };
    
    store.bcAuthToken = token;
    
    expect(store.bcAuthToken).toEqual(token);
    expect(store.bcAuthToken.token).toBe('bc-test-token');
  });

  it('should get both tokens', () => {
    const store = useAuthStore();
    const authToken = { token: 'auth-token', timestamp: new Date().toISOString() };
    const bcAuthToken = { token: 'bc-token', timestamp: new Date().toISOString() };
    
    store.authToken = authToken;
    store.bcAuthToken = bcAuthToken;
    
    const tokens = store.get();
    
    expect(tokens.authToken).toEqual(authToken);
    expect(tokens.bcAuthToken).toEqual(bcAuthToken);
  });

  it('should reset state', () => {
    const store = useAuthStore();
    
    // Set some tokens
    store.authToken = { token: 'auth-token', timestamp: new Date().toISOString() };
    store.bcAuthToken = { token: 'bc-token', timestamp: new Date().toISOString() };
    
    // Verify they are set
    expect(store.authToken.token).toBe('auth-token');
    expect(store.bcAuthToken.token).toBe('bc-token');
    
    // Reset
    store.resetState();
    
    // Verify they are cleared
    expect(store.authToken).toEqual({});
    expect(store.bcAuthToken).toEqual({});
  });

  it('should handle multiple token updates', () => {
    const store = useAuthStore();
    
    // First update
    store.authToken = { token: 'token-1', timestamp: '2024-01-01' };
    expect(store.authToken.token).toBe('token-1');
    
    // Second update
    store.authToken = { token: 'token-2', timestamp: '2024-01-02' };
    expect(store.authToken.token).toBe('token-2');
    expect(store.authToken.timestamp).toBe('2024-01-02');
  });

  it('should persist tokens independently', () => {
    const store = useAuthStore();
    
    store.authToken = { token: 'auth-only', timestamp: new Date().toISOString() };
    
    expect(store.authToken.token).toBe('auth-only');
    expect(store.bcAuthToken).toEqual({});
    
    store.bcAuthToken = { token: 'bc-only', timestamp: new Date().toISOString() };
    
    expect(store.authToken.token).toBe('auth-only');
    expect(store.bcAuthToken.token).toBe('bc-only');
  });

  it('should handle timestamp correctly', () => {
    const store = useAuthStore();
    const now = new Date().toISOString();
    
    store.authToken = { token: 'test', timestamp: now };
    
    expect(store.authToken.timestamp).toBe(now);
    expect(new Date(store.authToken.timestamp).toISOString()).toBe(now);
  });

  it('should work with empty token strings', () => {
    const store = useAuthStore();
    
    store.authToken = { token: '', timestamp: new Date().toISOString() };
    
    expect(store.authToken.token).toBe('');
    expect(store.authToken.timestamp).toBeTruthy();
  });
});
