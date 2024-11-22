<template>
  <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-blueGray-700 text-white">
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
      <div class="relative h-350-px">
        <canvas class="text-white" :id="'bar-chart_' + ID_GRAPH"></canvas>
      </div>
    </div>
  </div>
</template>
<script>
import Chart from "chart.js";
import ChartService from "@/services/chart.service";
import { getHeaderTokens } from "../../utils/headers-token";

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
  watch: {
  },
  data() {
    return {
      subTitle: null,
      months: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
      localStorage: {
        month: null,
        year: null
      },
    }
  },
  mounted() {
    this.setGraph()
    const _this = this
    setInterval(function () {
      _this.checkLocalStorageUpdate()
    }, 2000)
  },
  methods: {
    setGraph() {
      let date = new Date
      let month = localStorage.getItem('chart-month')
      let year = localStorage.getItem('chart-year')

      if (year === null) {
        year = date.getFullYear()
      }

      if (month === null) {
        month = date.getMonth()
      }

      month = this.months[month]

      this.subTitle = year + "/" + month

      this.$nextTick(function () {
        if (window.myBar !== undefined) {
          this.datasets = []
          window.myBar.destroy()
        }

        let config = {
          type: "bar",
          data: {
            labels: [],
            datasets: [],
          },
          options: {
            title: {
              display: false,
              text: "Entries stats",
              fontColor: "white",
            },
            legend: {
              display: false
            },
            maintainAspectRatio: false,
            responsive: true,
            hover: {
              mode: "nearest",
              intersect: false,
            },
          },
        };

        const data = [{
          start: year + "/" + month + "/01",
          end: year + "/" + month + "/31"
        }]

        let labels = []
        let colors = []
        let values = []

        const headers = getHeaderTokens()
        const chartService = new ChartService()
        chartService.expensesBarByCategory(data).then((resp) => {
          resp.bar.forEach(element => {

            labels.push(this.$t('app.' + element.label))
            colors.push(element.color)
            values.push(element.value * -1)

          });

          let dataset = {
            label: 'expenses',
            backgroundColor: colors,
            data: values,
            fill: true,
          }

          config.data.datasets.push(dataset)
          config.data.labels = labels

          var ctx = document.getElementById("bar-chart_" + this.ID_GRAPH).getContext("2d");
          if (window.myBar !== undefined) {
            window.myBar.destroy()
          }

          window.myBar = new Chart(ctx, config);

        }).catch((error) => {
          console.info(error);
        })
      })
    },
    checkLocalStorageUpdate() {
      const year = localStorage.getItem('chart-year')
      const month = localStorage.getItem('chart-month')
      if (year != this.localStorage.year) {
        this.localStorage.year = year
        this.setGraph()
      }
      if (month != this.localStorage.month) {
        this.localStorage.month = month
        this.setGraph()
      }
    }
  }
};
</script>
