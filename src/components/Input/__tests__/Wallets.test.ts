import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import Wallets from '../Wallets.vue';
import CoreService from '../../../services/core.service';

// Mock CoreService
vi.mock('../../../services/core.service', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      accounts: vi.fn()
    }))
  };
});

describe('Wallets.vue', () => {
  let mockAccounts: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockAccounts = vi.fn();
    (CoreService as any).mockImplementation(() => ({
      accounts: mockAccounts
    }));
  });

  it('should filter out archived wallets when loading accounts', async () => {
    const mockWallets = [
      { id: 1, name: 'Active Wallet 1', archived: false },
      { id: 2, name: 'Archived Wallet', archived: true },
      { id: 3, name: 'Active Wallet 2', archived: false }
    ];

    mockAccounts.mockResolvedValue(mockWallets);

    const wrapper = mount(Wallets, {
      props: {
        modelValue: []
      }
    });

    // Wait for created hook to complete
    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 0));

    // Verify that accounts was called with the archived filter
    expect(mockAccounts).toHaveBeenCalledWith('?filters[archived]=false');
  });

  it('should emit update:modelValue when selection changes', async () => {
    const mockWallets = [
      { id: 1, name: 'Wallet 1', archived: false },
      { id: 2, name: 'Wallet 2', archived: false }
    ];

    mockAccounts.mockResolvedValue(mockWallets);

    const wrapper = mount(Wallets, {
      props: {
        modelValue: []
      }
    });

    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 0));

    const select = wrapper.find('select');
    const options = select.findAll('option');
    
    // Simulate selecting options
    options[0].element.selected = true;
    await select.trigger('input');

    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
  });

  it('should render select element with wallets', async () => {
    const mockWallets = [
      { id: 1, name: 'Wallet 1', archived: false },
      { id: 2, name: 'Wallet 2', archived: false }
    ];

    mockAccounts.mockResolvedValue(mockWallets);

    const wrapper = mount(Wallets, {
      props: {
        modelValue: []
      }
    });

    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 0));

    const select = wrapper.find('select');
    expect(select.exists()).toBe(true);
    expect(select.attributes('multiple')).toBeDefined();
  });
});
