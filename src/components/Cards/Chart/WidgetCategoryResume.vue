<template>
  <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
    <div class="rounded-t mb-0 px-4 py-3 border-0">
      <div class="flex flex-wrap items-center">
        <div class="relative w-full px-4 max-w-full flex-grow flex-1">
          <h3 class="font-semibold text-base text-blueGray-700">
            {{ title }}
          </h3>
        </div>
        <!-- <div class="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
          <a :href="'/see_all/' + path"
            class="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button">
            See all
          </a>
        </div> -->
      </div>
    </div>
    <div class="block w-full overflow-x-auto">
      <!-- Projects table -->
      <table class="items-center w-full bg-transparent border-collapse">
        <thead>
          <tr>
            <th
              class="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
              {{ path }} NAME
            </th>
            <th
              class="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
              AMOUNT
            </th>
            <th
              class="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
              AMOUNT BEFORE
            </th>
            <th
              class="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
              BOUNCE RATE
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(d, i) in elements" :key="i">
            <th class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
              {{ d.label }}
            </th>
            <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
              {{ d.amount }}
            </td>
            <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
              {{ d.amount_before }}
            </td>
            <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
              <i class="fas mr-4" :class="[d.bounce_rate < 0 ? 'fa-arrow-down text-emerald-500' : 'fa-arrow-up text-red-500']
                "></i>
              {{ d.bounce_rate }}%
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import ChartServiceVue from '../../../services/ChartService.vue'

export default {
  props: {
    path: {
      type: String,
      required: true,
      default: "category"
    },
    title: {
      type: String,
      required: true
    },
  },
  data() {
    return {
      elements: [],
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
    setGraph: function () {

      this.elements = []

      let month = localStorage.getItem('chart-month')
      let year = localStorage.getItem('chart-year')
      let date = new Date

      if (month === null) {
        month = date.getMonth()
      }

      if (year === null) {
        year = date.getFullYear()
      }

      month = this.months[month]

      let data = [{
        start: year + "/" + month + "/01",
        end: year + "/" + month + "/31"
      }]

      ChartServiceVue.expensesLabelCategory(data).then((resp) => {

        resp.rows.forEach(element => {

          this.elements.push({
            label: this.$t('app.' + element.label),
            amount: element.amount.toFixed(2),
            amount_before: element.prevAmount.toFixed(2),
            bounce_rate: element.bounceRate.toFixed(2)
          })

        });

      }).catch((error) => {
        console.info(error);
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
}
</script>

