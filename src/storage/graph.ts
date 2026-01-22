import { defineStore } from 'pinia'

const STORE_NAME = 'graph'

const getDefaultDates = () => {
  const now = new Date()
  const start_date = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
  const end_date = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]
  return { start_date, end_date }
}

export const useGraphStore = defineStore(STORE_NAME, {
  state: () => ({
    ...getDefaultDates(),
    category_sort: 'name_asc' as 'name_asc' | 'name_desc' | 'amount_asc' | 'amount_desc',
  }),
  actions: {
    set(start_date: string, end_date: string) {
      this.start_date = start_date
      this.end_date = end_date
    },
    get(): { start_date: string, end_date: string } {
      return this
    },
    setCategorySort(sort: 'name_asc' | 'name_desc' | 'amount_asc' | 'amount_desc') {
      this.category_sort = sort
    },
  },
  persist: true,
})