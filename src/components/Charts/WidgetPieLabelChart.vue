<template>
  <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-slate-700">
    <div class="rounded-t mb-0 px-4 py-3 bg-transparent">
      <div class="flex flex-wrap items-center">
        <div class="relative w-full max-w-full flex-grow flex-1">
          <h2 class="text-white text-xl font-semibold">
            {{ $t('labels.expenses') }}
          </h2>
          <h3 class="text-white text-xl font-semibold">
            {{ subTitle }}
          </h3>
        </div>
      </div>
    </div>
    <div class="p-4 flex-auto">
      <div class="relative h-350-px">
        <canvas :id="'bar_graph_' + ID_GRAPH"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from "chart.js";
import ChartService from "@/services/chart.service";

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
      required: true
    },
    ID_GRAPH: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      subTitle: null,
      months: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
      localStorageState: {
        month: null,
        year: null
      },
      chartInstance: null,
    };
  },
  mounted() {
    this.initializeGraph();
    setInterval(() => {
      this.checkLocalStorageUpdates();
    }, 1000);
  },
  methods: {
    initializeGraph() {
      const now = new Date();
      let year = localStorage.getItem("chart-year") || now.getFullYear();
      let month = localStorage.getItem("chart-month") || now.getMonth();

      month = this.months[month];
      this.subTitle = `${year}/${month}`;
      this.createGraph(year, month);
    },
    createGraph(year, month) {
      const config = {
        type: "pie",
        data: {
          labels: [],
          datasets: [],
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
      };

      const dateRange = [{
        start: `${year}/${month}/01`,
        end: `${year}/${month}/31`,
      }];

      const chartService = new ChartService();
      chartService
        .expensesLabelApplePie(dateRange)
        .then((response) => {
          const dataset = this.prepareDataset(response.field);
          config.data.labels = dataset.labels;
          config.data.datasets.push({
            label: this.$t("labels.expenses"),
            backgroundColor: dataset.colors,
            data: dataset.values,
          });

          const ctx = document.getElementById(`bar_graph_${this.ID_GRAPH}`).getContext("2d");
          if (this.chartInstance) {
            this.chartInstance.destroy();
          }
          this.chartInstance = new Chart(ctx, config);
        })
        .catch((error) => {
          console.error("Error loading chart data:", error);
        });
    },
    prepareDataset(fields) {
      const dataset = {
        labels: [],
        colors: [],
        values: [],
      };

      fields.forEach((field) => {
        dataset.labels.push(field.label);
        dataset.colors.push(field.color);
        dataset.values.push(field.value * -1);
      });

      dataset.values.sort((a, b) => a - b);
      const maxElements = 5;
      return {
        labels: dataset.labels.slice(0, maxElements),
        colors: dataset.colors.slice(0, maxElements),
        values: dataset.values.slice(0, maxElements),
      };
    },
    checkLocalStorageUpdates() {
      const year = localStorage.getItem("chart-year");
      const month = localStorage.getItem("chart-month");

      if (year !== this.localStorageState.year || month !== this.localStorageState.month) {
        this.localStorageState.year = year;
        this.localStorageState.month = month;
        this.initializeGraph();
      }
    },
  },
};
</script>
