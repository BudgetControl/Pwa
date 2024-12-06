<template>
    <div>
        <AverageStats />

        <div class="flex flex-wrap mt-4">
            <div class="flex-1">
                <WidgetBarChartVue ref="WidgetCategoryStatsBar" :title="$t('app.stats_by_category')" />
                <WidgetCategoryStats ref="WidgetCategoryStatsBar" />
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
import WidgetBarChartVue from '../../../components/Charts/WidgetBarChart.vue';
import WidgetCategoryStats from "../../../components/Charts/WidgetCategoryStats.vue";
import ChartBarController from "../../../controller/ChartBar.controller";

export default {
    name: "dashboard-page",
    components: {
        CardBudget,
        AverageStats,
        WidgetBarChartVue,
        WidgetCategoryStats
    },
    data() {
        return {
            months: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
        }
    },
    mounted: async function () {
        this.initCategoryChartDataset()
    },
    methods: {
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

                    if (chartBarDataset.length > 0) {
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