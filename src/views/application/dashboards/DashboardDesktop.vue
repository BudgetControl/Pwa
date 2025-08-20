<template>
  <div>

    <AverageStats />

    <div class="flex flex-wrap mt-4">
      <FilterBar />
    </div>

    <div class="flex flex-wrap mt-4">
      <CardLine_IncomingExpensesChart />
    </div>

    <div class="flex flex-wrap mt-4">
      <div class="w-1/2">
        <WidgetBarChartVue ref="WidgetBarChartVue" :title="$t('app.stats_by_category')" />
      </div>
      <div class="w-1/2">
        <WidgetPieChart class="flex-1" ref="WidgetPieChart" :title="$t('app.stats_by_tags')" />
      </div>
    </div>

    <div id="table-chart" class="flex flex-wrap mt-4">
      <WidgetGraphTable />
      <WidgetTable />
    </div>
  </div>
</template>
<script>
import CardLine_IncomingExpensesChart from "@/components/Charts/WidgetLine_IncomingExpensesChart.vue";
import WidgetTable from "../../../components/Charts/WidgetTable.vue";
import WidgetGraphTable from "../../../components/Charts/WidgetGraphTable.vue";
import WidgetPieChart from "../../../components/Charts/WidgetdoughnutChart.vue";
import AverageStats from '../../../components/Charts/AverageStats.vue';
import WidgetBarChartVue from '../../../components/Charts/WidgetBarChart.vue';
import ChartBarController from "../../../controller/ChartBar.controller";
import ChartLabelController from "../../../controller/ChartLabel.controller";
import FilterBar from "../../../components/Navbars/FilterBar.vue";
import { useGraphStore } from "../../../storage/graph";

export default {
  name: "dashboard-page",
  components: {
    CardLine_IncomingExpensesChart,
    WidgetTable,
  WidgetGraphTable,
    AverageStats,
    WidgetBarChartVue,
    WidgetPieChart,
    FilterBar
  },
  setup() {
    const graphStore = useGraphStore()

    return {
      graphStore
    }
  },
  mounted: async function () {
    this.graphStore.$subscribe(() => {
      this.initCategoryChartDataset()
      this.initLabelChartDataset()
    });
    this.initCategoryChartDataset()
    this.initLabelChartDataset()
  },
  methods: {
    toggleTabs: function (tabNumber) {
      this.openTab = tabNumber
    },
    async initLabelChartDataset() {

      const startDate = this.graphStore.start_date;
      const endDate = this.graphStore.end_date;

      const chartData = await ChartLabelController.buildDataset({
        start: startDate,
        end: endDate,
      });

      const barDataset = await chartData.getDataset();

      this.$nextTick(async () => {
        if (this.$refs.WidgetPieChart) {

          const chartBarDataset = await JSON.parse(JSON.stringify(barDataset));

          if (chartBarDataset.length > 0) {
            this.hasPieData = true
          }

          this.$refs.WidgetPieChart.setGraph(chartBarDataset);
        }
      });

    },
    async initCategoryChartDataset() {

      const startDate = this.graphStore.start_date;
      const endDate = this.graphStore.end_date;

      const chartData = await ChartBarController.buildDataset({
        start: startDate,
        end: endDate,
      });

      const barDataset = await chartData.getDataset();

      this.$nextTick(async () => {
        if (this.$refs.WidgetPieChart) {
          const chartBarDataset = await JSON.parse(JSON.stringify(barDataset));

          if (chartBarDataset.length > 0) {
            this.hasBarData = true
          }

          this.$refs.WidgetBarChartVue.setGraph(chartBarDataset);
        }
      });
    }
  },

};
</script>