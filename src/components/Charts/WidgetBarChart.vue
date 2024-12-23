<template>
  <div class="flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded ">
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
      <div class="relative h-300-px">
        <canvas class="" ref="barChart" :id="'bar-chart_' + ID_GRAPH" style="min-height: 300px;"></canvas>
        <div v-if="!hasData" class="no-data-placeholder">{{ $t("messages.chart.no_data") }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

export default {
  props: {
    path: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    category: {
      type: Array,
      required: false,
      default: null
    },
    ID_GRAPH: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      subTitle: null,
      hasData: false,
      months: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
      localStorage: {
        month: null,
        year: null
      },
    };
  },
  methods: {
    setGraph(data) {
      this.$nextTick(function () {
        if (window.myBar !== undefined) {
          window.myBar.destroy();
        }

        let config = {
          type: "bar",
          data: {
            labels: [],
            datasets: [],
          },
          options: {
            plugins: {
              datalabels: {
                display: false
              },
              title: {
                display: false,
                text: "Entries stats",
                color: "black",
              },
              legend: {
                display: false,
              },
              tooltip: {
                enabled: true,
              },
            },
            scales: {
              x: {
                grid: {
                  color: "rgba(255, 255, 255, 0.2)",
                },
                ticks: {
                  display: false,
                  color: "black",
                },
              },
              y: {
                grid: {
                  color: "rgba(255, 255, 255, 0.2)",
                },
                ticks: {
                  color: "black",
                },
              },
            },
            maintainAspectRatio: false,
            responsive: true,
            interaction: {
              mode: "nearest",
              intersect: false,
            },
          },
        };

        const labels = [];
        const colors = [];
        const values = [];

        data.forEach(element => {

          const amount = element.value * -1;

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

        if (data.length > 0) {
          this.hasData = true;

          const ctx = this.$refs.barChart.getContext("2d");
          Chart.register(
            BarController,
            BarElement,
            CategoryScale,
            LinearScale,
            Tooltip,
            Legend,
            Title,
            ChartDataLabels
          );

          this.chartInstance = new Chart(ctx, config);

        }

      });
    },
  },
};
</script>
<style>
.h-300-px {
  height: 300px;
  max-height: 300px;
}

.no-data-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
  max-height: 300px;
  /* Altezza del grafico */
  color: #aaa;
  font-size: 18px;
}
</style>
