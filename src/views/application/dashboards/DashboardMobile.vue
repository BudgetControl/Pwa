<template>
    <div>
        <AverageStats />

        <div class="flex flex-wrap mt-4">
            <CardLine_IncomingExpensesChart />
        </div>

        <div class="flex flex-wrap mt-4">
            <div class="flex-1">
                <WidgetPieChart ref="WidgetPieChart" :title="$t('app.stats_by_category')" />
                <WidgetCategoryStats ref="WidgetCategoryStats" />
            </div>
        </div>

        <div class="flex flex-wrap mt-4">
            <CardBudget />
        </div>
    </div>
</template>
<script>
import CardBudget from "../../../components/Charts/WidgetBudget.vue";
import AverageStats from '../../../components/Charts/AverageStats.vue';
import WidgetPieChart from "../../../components/Charts/WidgetdoughnutChart.vue";
import WidgetCategoryStats from "../../../components/Charts/WidgetCategoryStats.vue";
import ChartBarController from "../../../controller/ChartBar.controller";
import { useGraphStore } from "../../../storage/graph";

export default {
    name: "dashboard-page",
    components: {
        CardBudget,
        AverageStats,
        WidgetPieChart,
        WidgetCategoryStats
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
        });
        this.initCategoryChartDataset()
    },
    methods: {
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

                    this.$refs.WidgetPieChart.setGraph(chartBarDataset);
                    this.$refs.WidgetCategoryStats.setGraph(chartBarDataset);
                }
            });
        }
    },

};
</script>