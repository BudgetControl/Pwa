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
  }),
  actions: {
    set(start_date: string, end_date: string) {
      this.start_date = start_date
      this.end_date = end_date
    },
    get(): { start_date: string, end_date: string } {
      return this
    },
  },
  persist: false,
})