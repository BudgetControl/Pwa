<template>
  <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded">
    <div class="rounded-t mb-0 px-4 py-3 bg-transparent">
      <div class="flex flex-wrap items-center">
        <div class="relative w-full max-w-full flex-grow flex-1">
          <span class="font-semibold text-gray-500">
            {{ title }}
          </span>
        </div>
      </div>
    </div>
    <div class="p-4 flex-auto">
      <div class="relative h-400-px mb-20">

        <div v-if="hasData">
          <canvas class=" chart" ref="doughChart" :id="'dough-chart_' + ID_GRAPH"></canvas>
          <div v-if="!hasData" class="no-data-placeholder">{{ $t("messages.chart.no_data") }}</div>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import {
  Chart,
  DoughnutController,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

export default {
  props: {
    path: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    category: {
      type: Array,
      required: false,
      default: null,
    },
    ID_GRAPH: {
      type: String,
      required: true,
    },
  },
  components: {
  },
  data() {
    return {
      subTitle: null,
      months: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
      chartDataset: [],
      currency: '€',
      hasData: false,
    };
  },
  methods: {
    setGraph(data) {
      this.hasData = true;
      const date = new Date();
      const month = localStorage.getItem("chart-month") || date.getMonth();
      const year = localStorage.getItem("chart-year") || date.getFullYear();

      this.subTitle = `${year}/${this.months[month]}`;

      this.$nextTick(() => {
        if (this.chartInstance) {
          this.chartInstance.destroy();
        }

        const config = {
          type: "doughnut",
          data: {
            labels: [],
            datasets: [],
          },
          options: {
            plugins: {
              datalabels: {
                backgroundColor: function (context) {
                  return context.dataset.backgroundColor;
                },
                borderColor: 'black',
                borderRadius: 25,
                borderWidth: 2,
                color: 'black',
                display: false,

                font: {
                  weight: 'bold'
                },
                padding: 6,
                formatter: Math.round
              },
              title: {
                display: false,
              },
              legend: {
                display: false,
              },
              tooltip: {
                enabled: true,
              },
            },
            maintainAspectRatio: false,
            responsive: true,
          },
        };

        const labels = [];
        const colors = [];
        const values = [];

        data.forEach(element => {

          const amount = element.value * -1;
          this.hasData = true;

          labels.push(this.$t("app." + element.label));
          colors.push(element.color);
          values.push(amount);

        });

        // create graph
        config.data.labels = labels;
        config.data.datasets.push({
          backgroundColor: colors,
          data: values,
          label: "expenses",
          datalabels: {
            anchor: 'end'
          }
        });

        if (this.chartInstance) {
          this.chartInstance.destroy();
        }
        
        const ctx = this.$refs.doughChart.getContext("2d");
        Chart.register(
          DoughnutController,
          ArcElement,
          CategoryScale,
          LinearScale,
          Tooltip,
          Legend,
          Title,
          ChartDataLabels
        );

        this.chartInstance = new Chart(ctx, config);

      })

    },
  },
};
</script>

<style>
.chart {
  background-color: transparent;
}
.h-400-px {
  min-height: 400px;
}

.no-data-placeholder {
   display: flex;
   align-items: center;
   justify-content: center;
   min-height: 300px;
   /* Altezza del grafico */
   color: #aaa;
   font-size: 18px;
 }
</style>
