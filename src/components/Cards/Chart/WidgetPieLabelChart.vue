<template>
  <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-blueGray-700">
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
              position: "bottom",
              labels: {
                fontColor: "#fff",
              },
            },
            responsive: true,
          },
        };

        const date = [{
          start: year + "/" + month + "/01",
          end: year + "/" + month + "/31"
        }]

        ChartService.expensesLabelApplePie(date).then((resp) => {

          const datasetApplePie = {
            labels: [],
            colors: [],
            values: []
          }

          resp.field.forEach(element => {
            datasetApplePie.labels.push(element.label)
            datasetApplePie.colors.push(element.color)
            datasetApplePie.values.push(element.value * -1)
          });

          datasetApplePie.values.sort((a, b) => a - b);
          // get the first 5 elements
          const elements = 5
          datasetApplePie.labels = datasetApplePie.labels.slice(0, elements);
          datasetApplePie.colors = datasetApplePie.colors.slice(0, elements);
          datasetApplePie.values = datasetApplePie.values.slice(0, elements);

          let dataset = {
            label: this.$t('labels.expenses'),
            backgroundColor: datasetApplePie.colors,
            data: datasetApplePie.values
          }

          config.data.labels = datasetApplePie.labels
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
