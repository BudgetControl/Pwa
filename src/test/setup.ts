import { vi } from 'vitest';
import { config } from '@vue/test-utils';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as any;

// Mock vue-full-loading
vi.mock('vue-full-loading', () => ({
  default: {
    name: 'Loading',
    template: '<div class="loading-mock"></div>',
    props: ['show']
  }
}));

// Configure Vue Test Utils
config.global.mocks = {
  $t: (key: string) => key,
  $i18n: {
    locale: 'en'
  }
};
