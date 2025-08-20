<template>
  <div class="flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
    <div class="rounded-t mb-0 px-4 py-3 bg-transparent">
      <div class="flex flex-wrap items-center">
        <div class="relative w-full max-w-full flex-grow flex-1">
          <span class="font-semibold text-gray-700 text-lg">
            Spese per Categoria - Tabella Mensile
          </span>
        </div>
      </div>
    </div>
    <div class="p-4 flex-auto overflow-x-auto">
      <loading :active="loading" :is-full-page="false" />
      <table v-if="!loading" class="w-full text-xs text-left">
        <thead>
          <tr>
            <th class="px-2 py-2 bg-slate-100">{{ $t('labels.category') }}</th>
            <th v-for="(month, idx) in months" :key="month" class="px-2 py-2 bg-slate-100 text-center">{{ $t('app.months.' + monthKeys[idx]) }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cat in categories" :key="cat">
            <td class="px-2 py-2 font-semibold">{{ cat }}</td>
            <td v-for="month in months" :key="month" class="px-2 py-2 text-right">
              {{ round(getExpense(cat, month)) }} €
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr class="font-bold bg-slate-200">
            <td class="px-2 py-2">{{ $t('labels.amount') }} {{ $t('labels.monthly') }}</td>
            <td v-for="month in months" :key="month" class="px-2 py-2 text-right">
              {{ round(getMonthTotal(month)) }} €
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>

<script>
import ChartService from '../../services/chart.service';
import { ref, onMounted } from 'vue';
import loading from 'vue-full-loading';

export default {
  name: 'WidgetGraphTable',
  setup() {
    // Chiavi dei mesi per traduzione
    const monthKeys = ['january','february','march','april','may','june','july','august','september','october','november','december'];
    // Nomi dei mesi (per mapping)
    const months = [
      'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
      'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
    ];
  const categories = ref([]);
  const expenses = ref({});
  const currentYear = new Date().getFullYear();
  const loading = ref(true);

    function getMonthDateRange(monthIdx) {
      const start = new Date(currentYear, monthIdx, 1);
      const end = new Date(currentYear, monthIdx + 1, 0);
      return {
        start: start.toISOString().slice(0, 10),
        end: end.toISOString().slice(0, 10)
      };
    }

    async function fetchData() {
      loading.value = true;
      const chartService = new ChartService();
      const allExpenses = {};
      let allCategories = new Set();
      for (let i = 0; i < 12; i++) {
        const date = getMonthDateRange(i);
        const res = await chartService.expensesBarByCategory([
          { start: date.start, end: date.end }
        ]);
        allExpenses[months[i]] = {};
        if (res && Array.isArray(res.bar)) {
          res.bar.forEach(item => {
            const catName = item.data?.category?.name || item.data?.name || 'Unknown';
            allExpenses[months[i]][catName] = item.value;
            allCategories.add(catName);
          });
        }
      }
      categories.value = Array.from(allCategories);
      expenses.value = allExpenses;
      loading.value = false;
    }

    function getExpense(category, month) {
      return expenses.value[month]?.[category] ?? 0;
    }

    function getMonthTotal(month) {
      const cats = expenses.value[month] || {};
      return Object.values(cats).reduce((a, b) => a + b, 0);
    }

    function round(val) {
      // Arrotonda a 2 decimali, gestisce anche numeri negativi
      return Math.round((val + Number.EPSILON) * 100) / 100;
    }

    onMounted(fetchData);

    return {
      months,
      monthKeys,
      categories,
      getExpense,
      getMonthTotal,
      round,
      loading
    };
  }
};
</script>

<style scoped>
table {
  border-collapse: collapse;
}
th, td {
  border: 1px solid #e2e8f0;
}
</style>
