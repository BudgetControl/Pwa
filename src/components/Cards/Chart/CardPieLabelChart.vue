<template>
  <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-blueGray-700">
    <div class="rounded-t mb-0 px-4 py-3 bg-transparent">
      <div class="flex flex-wrap items-center">
        <div class="relative w-full max-w-full flex-grow flex-1">
          <h2 class="text-white text-xl font-semibold">
            Expenses by Labels
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
        <canvas :id="'bar_graph_' + ID_GRAPH"></canvas>
      </div>
    </div>
  </div>
</template>
<script>
import Chart from "chart.js";
import ChartService from "../../../services/ChartService.vue";

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
    }, 1000)
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

        let config = {
          type: "pie",
          data: {
            labels: [],
            datasets: [],
          },
          options: {
            legend: {
              display: false,
            },
            responsive: true,
          },
        };

        const date = [{
          start: year + "/" + month + "/01",
          end: year + "/" + month + "/31"
        }]

        ChartService.expensesLabelLine(date).then((resp) => {

          let labels = []
          let colors = []
          let values = []

          resp.series.forEach(element => {

            labels.push(element.label)
            colors.push(element.color)
            values.push(element.value * -1)

          });

          let dataset = {
            label: 'expenses by labels',
            backgroundColor: colors,
            data: values
          }

          config.data.labels = labels
          config.data.datasets.push(dataset)

          var ctx = document.getElementById('bar_graph_' + this.ID_GRAPH).getContext("2d");
          if (window.myBarLabel !== undefined) {
            window.myBarLabel.destroy()
          }

          window.myBarLabel = new Chart(ctx, config);

        }).catch((error) => {
          console.info(error);
        })

      });
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
