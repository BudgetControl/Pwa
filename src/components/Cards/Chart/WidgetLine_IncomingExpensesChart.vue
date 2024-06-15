<template>
  <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-blueGray-700">
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
        <canvas :id="'line_graph_doubleline_'"></canvas>
      </div>
    </div>
  </div>
</template>
<script>
import Chart from "chart.js";
import ChartService from "../../../services/ChartService.vue";

export default {
  props: {
    filter: {
      type: Boolean,
      required: true,
      default: false
    },
    title: {
      type: String,
      required: true
    },
  },
  data() {
    return {
      subTitle: null,
      localStorage: {
        month: null,
        year: null
      },
      months: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
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
      this.subTitle = year

      this.$nextTick(function () {

        var config = {
          type: "line",
          data: {
            labels: [],
            datasets: [],
          },
          options: {
            maintainAspectRatio: false,
            responsive: true,
            title: {
              display: false,
              text: "Entries stats",
              fontColor: "white",
            },
            legend: {
              labels: {
                fontColor: "white",
              },
              align: "end",
              position: "bottom",
            },
            tooltips: {
              mode: "index",
              intersect: false,
            },
            hover: {
              mode: "nearest",
              intersect: false,
            },
            scales: {
              xAxes: [
                {
                  ticks: {
                    fontColor: "rgba(255,255,255,.7)",
                  },
                  display: true,
                  scaleLabel: {
                    display: false,
                    labelString: "Month",
                    fontColor: "white",
                  },
                  gridLines: {
                    display: false,
                    borderDash: [2],
                    borderDashOffset: [2],
                    color: "rgba(33, 37, 41, 0.3)",
                    zeroLineColor: "rgba(0, 0, 0, 0)",
                    zeroLineBorderDash: [2],
                    zeroLineBorderDashOffset: [2],
                  },
                },
              ],
              yAxes: [
                {
                  ticks: {
                    fontColor: "rgba(255,255,255,.7)",
                  },
                  display: true,
                  scaleLabel: {
                    display: false,
                    labelString: "Value",
                    fontColor: "white",
                  },
                  gridLines: {
                    borderDash: [3],
                    borderDashOffset: [3],
                    drawBorder: false,
                    color: "rgba(255, 255, 255, 0.15)",
                    zeroLineColor: "rgba(33, 37, 41, 0)",
                    zeroLineBorderDash: [2],
                    zeroLineBorderDashOffset: [2],
                  },
                },
              ]
            },
          },
        };

        let data = []

        this.months.forEach(month => {
          data.push({
            start: year + "/" + month + "/01",
            end: year + "/" + month + "/" + new Date(year, month, 0).getDate(),
          })
        })

        ChartService.incomingExpensesLine(data).then((resp) => {

          resp.series.forEach(element => {

            let color = '#FF0000';
            if (element.label == 'Incoming') {
              color = '#00FF00';
            }

            let dataset = {
              label: element.label,
              backgroundColor: color,
              borderColor: color,
              data: [],
              fill: false,
              barThickness: 50,
            }

            element.dataPoints.forEach(point => {
              if (element.label == 'Incoming') {
                config.data.labels.push(point.label)
              }
              let value = point.xValue < 0 ? point.xValue * -1 : point.xValue
              dataset.data.push(value)
            })

            config.data.datasets.push(dataset)

            var ctx = document.getElementById("line_graph_doubleline_").getContext("2d");
            if(window.myLine !== undefined) {
              window.myLine.destroy()
            } 
              
            window.myLine = new Chart(ctx, config);

          });

        }).catch((error) => {
          console.info(error);
        })
      })
    },
    checkLocalStorageUpdate() {
      const year = localStorage.getItem('chart-year')
      if (year != this.localStorage.year) {
        this.localStorage.year = year
        this.setGraph()
      }
    }
  }
};
</script>
