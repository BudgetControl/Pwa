<template>
  <div>

      <AverageStats />

      <div class="flex flex-wrap mt-4">
        <CardLine_IncomingExpensesChart />
      </div>

      <div class="flex flex-wrap mt-4">
        <div class="flex-1">
          <WidgetBarChartVue ref="WidgetBarChartVue" :title="$t('app.stats_by_category')" />
          <WidgetCategoryStats ref="WidgetCategoryStatsBar" />
        </div>
        <div class="flex-1">
          <WidgetPieChart class="flex-1" ref="WidgetPieChart" :title="$t('app.stats_by_tags')" />
          <WidgetCategoryStats ref="WidgetCategoryStatsPie" />
        </div>
      </div>

      <div id="table-chart" class="flex flex-wrap mt-4">
        <WidgetTable />
      </div>

      <div class="flex flex-wrap mt-4">
        <CardBudget />
      </div>
    </div>
</template>
<script>
import CardLine_IncomingExpensesChart from "@/components/Charts/WidgetLine_IncomingExpensesChart.vue";
import CardBudget from "../../../components/Charts/WidgetBudget.vue";
import WidgetTable from "../../../components/Charts/WidgetTable.vue";
import WidgetPieChart from "../../../components/Charts/WidgetdoughnutChart.vue";
import AverageStats from '../../../components/Charts/AverageStats.vue';
import WidgetBarChartVue from '../../../components/Charts/WidgetBarChart.vue';
import WidgetCategoryStats from "../../../components/Charts/WidgetCategoryStats.vue";
import ChartBarController from "../../../controller/ChartBar.controller";
import ChartLabelController from "../../../controller/ChartLabel.controller";

export default {
  name: "dashboard-page",
  components: {
    CardLine_IncomingExpensesChart,
    WidgetTable,
    CardBudget,
    AverageStats,
    WidgetBarChartVue,
    WidgetPieChart,
    WidgetCategoryStats
  },
  data() {
    return {
      months: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
    }
  },
  mounted: async function () {
      this.initCategoryChartDataset()
      this.initLabelChartDataset()
  },
  methods: {
    toggleTabs: function (tabNumber) {
      this.openTab = tabNumber
    },
    async initLabelChartDataset() {

      const date = new Date();
      const month = date.getMonth();
      const year = date.getFullYear();

      const chartData = await ChartLabelController.buildDataset({
        start: `${year}/${this.months[month]}/01`,
        end: `${year}/${this.months[month]}/31`,
      });

      const barDataset = await chartData.getDataset();

      this.$nextTick(async () => {
        if (this.$refs.WidgetPieChart) {

          const chartBarDataset = await JSON.parse(JSON.stringify(barDataset));

          if(chartBarDataset.length > 0) {
            this.hasPieData = true
          }

          this.$refs.WidgetPieChart.setGraph(chartBarDataset);
          this.$refs.WidgetCategoryStatsPie.setGraph(chartBarDataset);
        }
      });

    },
    async initCategoryChartDataset() {

      const date = new Date();
      const month = date.getMonth();
      const year = date.getFullYear();

      const chartData = await ChartBarController.buildDataset({
        start: `${year}/${this.months[month]}/01`,
        end: `${year}/${this.months[month]}/31`,
      });

      const barDataset = await chartData.getDataset();

      this.$nextTick(async () => {
        if (this.$refs.WidgetPieChart) {
          const chartBarDataset = await JSON.parse(JSON.stringify(barDataset));

          if(chartBarDataset.length > 0) {
            this.hasBarData = true
          }

          this.$refs.WidgetCategoryStatsBar.setGraph(chartBarDataset);
          this.$refs.WidgetBarChartVue.setGraph(chartBarDataset);
        }
      });
    }
  },

};
</script>

<style>
@media (max-width: 767px) {

  #bar-chart,
  #table-chart {
    display: none;
  }
}

@media (min-width: 768px) {

  #bar-chart,
  #table-chart {
    display: block;
  }

  #widget .flex-wrap {
    flex-wrap: nowrap;
  }

  #widget .w-full {
    width: 25%;
  }
}
</style>