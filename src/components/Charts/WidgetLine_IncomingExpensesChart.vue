<template>
  <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-slate-700">
    <div class="rounded-t mb-0 px-4 py-3 bg-transparent">
      <div class="flex flex-wrap items-center">
        <div class="relative w-full max-w-full flex-grow flex-1">
          <h2 class="text-white text-xl font-semibold">
            {{ title }}
          </h2>
          <h3 class="text-white text-xl font-semibold">
            {{ subTitle }}
          </h3>
        </div>
      </div>
    </div>
    <div class="p-4 flex-auto">
      <!-- Chart -->
      <div class="relative h-350-px">
        <canvas :id="'line_graph_doubleline_'" style="min-height: 400px;"></canvas>
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
      subTitle: null,
      localStorage: {
        month: null,
        year: null,
      },
      months: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
    };
  },
  mounted() {
    this.setGraph();
    const _this = this;
    setInterval(function () {
      _this.checkLocalStorageUpdate();
    }, 1000);
  },
  methods: {
    setGraph() {
      let date = new Date();
      let month = localStorage.getItem("chart-month");
      let year = localStorage.getItem("chart-year");

      if (year === null) {
        year = date.getFullYear();
      }

      if (month === null) {
        month = date.getMonth();
      }

      month = this.months[month];
      this.subTitle = year;

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
              title: {
                display: false,
                text: "Entries stats",
                color: "white",
              },
              legend: {
                labels: {
                  color: "white",
                },
                align: "end",
                position: "bottom",
              },
              tooltip: {
                mode: "index",
                intersect: false,
              },
            },
            scales: {
              x: {
                ticks: {
                  color: "rgba(255,255,255,.7)",
                },
                grid: {
                  color: "rgba(33, 37, 41, 0.3)",
                },
              },
              y: {
                ticks: {
                  color: "rgba(255,255,255,.7)",
                },
                grid: {
                  color: "rgba(255, 255, 255, 0.15)",
                },
              },
            },
          },
        };

        const data = this.months.map((month) => ({
          start: `${year}/${month}/01`,
          end: `${year}/${month}/${new Date(year, month, 0).getDate()}`,
        }));

        const chartService = new ChartService();
        chartService
          .incomingExpensesLine(data)
          .then((resp) => {
            resp.series.forEach((element) => {
              const color = element.label === "incoming" ? "#00FF00" : element.label === "debit" ? "#c6c6c6" : "#FF0000";

              const dataset = {
                label: this.$t("labels." + element.label),
                backgroundColor: color,
                borderColor: color,
                data: [],
                fill: false,
                tension: 0.4
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
            Chart.register(LineController, LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);
            window.myLine = new Chart(ctx, config);
          })
          .catch((error) => {
            console.info(error);
          });
      });
    },
    checkLocalStorageUpdate() {
      const year = localStorage.getItem("chart-year");
      if (year != this.localStorage.year) {
        this.localStorage.year = year;
        this.setGraph();
      }
    },
  },
};
</script>
