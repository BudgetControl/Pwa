<template>
  <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded">
    <div class="rounded-t mb-0 px-4 py-3 bg-transparent">
      <div class="flex flex-wrap items-center">
        <div class="relative w-full max-w-full flex-grow flex-1">
          <h3 class="text-xl font-semibold">
            <select v-model="year" v-on:change="setGraph" class="form-select block w-full">
              <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
            </select>
          </h3>
        </div>
      </div>
    </div>
    <div class="p-4 flex-auto">
      <!-- Chart -->
      <div class="relative h-350-px">
        <canvas :id="'line_graph_doubleline_'" style="height: 300px; max-height: 300px;"></canvas>
        <div v-if="!hasData" class="no-data-placeholder">{{ $t("messages.chart.no_data") }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartService from "@/services/chart.service";
import ChartDataLabels from "chartjs-plugin-datalabels";

export default {
  props: {
    filter: {
      type: Boolean,
      required: true,
      default: false,
    },
    title: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      hasData: false,
      subTitle: null,
      year: new Date().getFullYear(),
      years: Array.from({ length: 10 }, (v, k) => new Date().getFullYear() - k),
    };
  },
  mounted() {
    this.setGraph();
  },
  methods: {
    setGraph() {
      const year = this.year

      this.$nextTick(function () {
        if (window.myLine !== undefined) {
          window.myLine.destroy();
        }

        const config = {
          type: "line",
          data: {
            labels: [],
            datasets: [],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              dataLabels: {
                display: false
              },
              title: {
                display: false,
                text: "Entries stats",
                color: "black",
              },
              legend: {
                labels: {
                  color: "black",
                  display: false,
                },
                align: "center",
                position: "bottom",
              },
              tooltip: {
                enabled: true,
              },
            },
          },
        };

        const data = Array.from({ length: 12 }, (v, k) => {
          const month = k + 1;
          const start = `${this.year}-${String(month).padStart(2, '0')}-01`;
          const end = new Date(this.year, month, 0).toISOString().split('T')[0];
          return { start, end };
        });

        const chartService = new ChartService();
        chartService
          .incomingExpensesLine(data)
          .then((resp) => {
            resp.series.forEach((element) => {
              let color = null;
              switch (element.label) {
                case "incoming":
                  color = "#00FF00";
                  break;
                case "debit":
                  color = "#c6c6c6";
                  break;
                case "expenses":
                  color = "#FF0000";
                  break;
                case "savings":
                  color = "#0000FF";
                  break;
                default:
                  color = "#000000";
                  break;
              }
              
              this.hasData = true;
              const dataset = {
                label: this.$t("labels." + element.label),
                backgroundColor: color,
                borderColor: color,
                data: [],
                fill: false,
                tension: 0.4,
                datalabels: {
                  display: false, // Nascondi datalabels per questo dataset
                },
              };

              element.dataPoints.forEach((point) => {
                if (element.label === "incoming") {
                  const pointLabel = point.label.toLowerCase();
                  config.data.labels.push(this.$t("labels.months." + pointLabel));
                }
                dataset.data.push(Math.abs(point.xValue));
              });

              config.data.datasets.push(dataset);
            });

            const ctx = document.getElementById("line_graph_doubleline_").getContext("2d");
            Chart.register(LineController, LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend, ChartDataLabels);
            window.myLine = new Chart(ctx, config);
          })
          .catch((error) => {
            console.info(error);
          });
      });
    },
  },
};
</script>

<style>
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
