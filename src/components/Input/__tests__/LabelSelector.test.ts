import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import LabelSelector from '../LabelSelector.vue';

// Mock libs
vi.mock('../../../libs', () => ({
  libs: {
    isMobile: vi.fn().mockResolvedValue(false),
    generateRandomColor: vi.fn(() => '#ef4444')
  }
}));

// Mock vue-i18n
const mockT = (key: string) => {
  const translations: Record<string, string> = {
    'labels.search_labels': 'Search labels...',
    'labels.or_insert_new_tag_name': 'Or enter a new tag name'
  };
  return translations[key] || key;
};

describe('LabelSelector.vue', () => {
  let wrapper: any;

  const mockLabels = [
    { id: '1', name: 'Food', color: '#ef4444' },
    { id: '2', name: 'Transport', color: '#f97316' },
    { id: '3', name: 'Entertainment', color: '#f59e0b' },
    { id: '4', name: 'Healthcare', color: '#84cc16' },
    { id: '5', name: 'Shopping', color: '#22c55e' }
  ];

  const createWrapper = (props = {}) => {
    return mount(LabelSelector, {
      global: {
        mocks: {
          $t: mockT
        }
      },
      props: {
        modelValue: [],
        availableLabels: mockLabels,
        ...props
      }
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render search input', () => {
    wrapper = createWrapper();
    
    const searchInput = wrapper.find('input[type="text"]');
    expect(searchInput.exists()).toBe(true);
    expect(searchInput.attributes('placeholder')).toBe('Search labels...');
  });

  it('should display all labels when search is empty', async () => {
    wrapper = createWrapper();
    await wrapper.vm.$nextTick();
    
    expect(wrapper.vm.filteredLabels).toHaveLength(5);
    expect(wrapper.vm.filteredLabels.map((l: any) => l.name)).toEqual([
      'Entertainment',
      'Food',
      'Healthcare',
      'Shopping',
      'Transport'
    ]);
  });

  it('should filter labels based on search query (case insensitive)', async () => {
    wrapper = createWrapper();
    await wrapper.vm.$nextTick();
    
    const searchInput = wrapper.find('input[type="text"]');
    
    // Search for "food"
    await searchInput.setValue('food');
    expect(wrapper.vm.filteredLabels).toHaveLength(1);
    expect(wrapper.vm.filteredLabels[0].name).toBe('Food');
    
    // Search for "TRANS" (case insensitive)
    await searchInput.setValue('TRANS');
    expect(wrapper.vm.filteredLabels).toHaveLength(1);
    expect(wrapper.vm.filteredLabels[0].name).toBe('Transport');
    
    // Search for "e" should return multiple results
    await searchInput.setValue('e');
    expect(wrapper.vm.filteredLabels.length).toBeGreaterThan(1);
    
    // Clear search
    await searchInput.setValue('');
    expect(wrapper.vm.filteredLabels).toHaveLength(5);
  });

  it('should return empty array when no labels match search', async () => {
    wrapper = createWrapper();
    await wrapper.vm.$nextTick();
    
    const searchInput = wrapper.find('input[type="text"]');
    
    await searchInput.setValue('nonexistent');
    expect(wrapper.vm.filteredLabels).toHaveLength(0);
  });

  it('should filter labels with partial match', async () => {
    wrapper = createWrapper();
    await wrapper.vm.$nextTick();
    
    const searchInput = wrapper.find('input[type="text"]');
    
    // Search for "ent" should match "Entertainment"
    await searchInput.setValue('ent');
    expect(wrapper.vm.filteredLabels).toHaveLength(1);
    expect(wrapper.vm.filteredLabels[0].name).toBe('Entertainment');
  });

  it('should handle whitespace in search query', async () => {
    wrapper = createWrapper();
    await wrapper.vm.$nextTick();
    
    const searchInput = wrapper.find('input[type="text"]');
    
    // Search with leading/trailing spaces
    await searchInput.setValue('  food  ');
    expect(wrapper.vm.filteredLabels).toHaveLength(1);
    expect(wrapper.vm.filteredLabels[0].name).toBe('Food');
  });

  it('should display filtered labels in desktop grid', async () => {
    wrapper = createWrapper();
    await wrapper.vm.$nextTick();
    
    const searchInput = wrapper.find('input[type="text"]');
    await searchInput.setValue('transport');
    await wrapper.vm.$nextTick();
    
    // Desktop grid should display filtered labels
    const labelItems = wrapper.findAll('.label-item');
    expect(labelItems).toHaveLength(1);
  });

  it('should maintain sorted order when filtering', async () => {
    wrapper = createWrapper();
    await wrapper.vm.$nextTick();
    
    const searchInput = wrapper.find('input[type="text"]');
    
    // Search for "e" - should return Entertainment, Healthcare, Shopping (sorted)
    await searchInput.setValue('e');
    const filteredNames = wrapper.vm.filteredLabels.map((l: any) => l.name);
    
    // Check if the results are sorted alphabetically
    const sortedNames = [...filteredNames].sort();
    expect(filteredNames).toEqual(sortedNames);
  });

  it('should update filteredLabels reactively when availableLabels change', async () => {
    wrapper = createWrapper();
    await wrapper.vm.$nextTick();
    
    const searchInput = wrapper.find('input[type="text"]');
    await searchInput.setValue('new');
    expect(wrapper.vm.filteredLabels).toHaveLength(0);
    
    // Add a new label
    const newLabels = [...mockLabels, { id: '6', name: 'New Label', color: '#3b82f6' }];
    await wrapper.setProps({ availableLabels: newLabels });
    
    // Should now find the new label
    expect(wrapper.vm.filteredLabels).toHaveLength(1);
    expect(wrapper.vm.filteredLabels[0].name).toBe('New Label');
  });
});
