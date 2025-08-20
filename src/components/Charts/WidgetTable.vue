<template>
  <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
    <div class="rounded-t mb-0 px-4 py-3 border-0 cursor-pointer" @click="toggleTableVisibility">
      <div class="flex flex-wrap items-center">
        <div class="relative w-full px-4 max-w-full flex-grow flex-1">
          <h3 class="font-semibold text-base text-slate-700">
            <i class="fas fa-chevron-right mr-2" :class="{ 'transform rotate-90': isTableVisible }"></i>
            {{ $t('labels.expenses_by_category_comparison') }}
          </h3>
        </div>
      </div>
    </div>
    <div v-show="isTableVisible" class="block w-full overflow-x-auto relative">
      <Loading :show="isLoading" />
      <!-- Projects table -->
      <table class="items-center w-full bg-transparent border-collapse">
        <thead>
          <tr>
            <th
              class="px-6 bg-slate-50 text-slate-500 align-middle border border-solid border-slate-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
              {{ path }} {{ $t('labels.name') }}
            </th>
            <th
              class="px-6 bg-slate-50 text-slate-500 align-middle border border-solid border-slate-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
              {{ $t('labels.amount') }}
            </th>
            <th
              class="px-6 bg-slate-50 text-slate-500 align-middle border border-solid border-slate-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
              {{ $t('labels.amount_before') }}
            </th>
            <th
              class="px-6 bg-slate-50 text-slate-500 align-middle border border-solid border-slate-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
              {{ $t('labels.bounce_rate') }}
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(d, i) in elements" :key="i">
            <tr class="hover:bg-slate-50">
              <th class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                <i :class="{ 'transform rotate-90': expandedRows[i] }"></i>
                {{ d.label }}
              </th>
              <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                {{ d.amount }}
              </td>
              <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                {{ d.amount_before }}
              </td>
              <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                <i class="fas mr-4" :class="[d.bounce_rate < 0 ? 'fa-arrow-down text-emerald-500' : 'fa-arrow-up text-red-500']
                  "></i>
                {{ d.bounce_rate }}%
              </td>
            </tr>
            <tr v-if="expandedRows[i]" class="bg-slate-50">
              <td colspan="4" class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                <!-- Contenuto espanso qui, se necessario -->
                <!-- Puoi aggiungere ulteriori dettagli o grafici relativi all'elemento qui -->
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import ChartService from '@/services/chart.service'
import { useGraphStore } from '../../storage/graph';
import { ref } from 'vue';
import Loading from '../GenericComponents/Loading.vue'

export default {
  components: { Loading },
  props: {
    path: {
      type: String,
      required: true,
      default: "category"
    },
    title: {
      type: String,
      required: true
    },
    options: {
      legend: {
        position: "bottom",
        labels: {
          fontColor: "#fff",
        },
      },
      responsive: true,
    },
  },
  data() {
    return {
      expandedRows: {},
      elements: [],
      isLoading: false
    }
  },
  mounted() {
    this.graphStore.$subscribe(() => {
      this.setGraph()
    });
    this.setGraph()
  },
  setup() {
    const graphStore = useGraphStore()
    const isTableVisible = ref(true);

    return {
      graphStore,
      isTableVisible
    }
  },
  methods: {
    toggleExpand(index) {
      this.$set(this.expandedRows, index, !this.expandedRows[index]);
    },
    toggleTableVisibility() {
      this.isTableVisible = !this.isTableVisible;
    },
    setGraph: function () {
      this.isLoading = true
      this.elements = []

      const startDate = this.graphStore.start_date;
      const endDate = this.graphStore.end_date;

      let data = [{
          start: startDate,
          end: endDate,
      }]

      const chartService = new ChartService()
      chartService.expensesLabelCategory(data).then((resp) => {
          // Filtra solo gli elementi con amount diverso da 0 e traduce le label
          const translatedElements = resp.rows
              .filter(element => Math.abs(element.amount) > 0)
              .map(element => ({
                  label: this.$t('app.' + element.label),
                  amount: element.amount.toFixed(2),
                  amount_before: element.prevAmount.toFixed(2),
                  bounce_rate: element.bounceRate.toFixed(2)
              }));

          // Ordina gli elementi per label tradotta
          this.elements = translatedElements.sort((a, b) => a.label.localeCompare(b.label));
      }).catch((error) => {
          console.info(error);
      }).finally(() => {
          this.isLoading = false
      })
    },
  }
}
</script>

<style scoped>
.transform {
  transition: transform 0.2s ease;
}
</style>
