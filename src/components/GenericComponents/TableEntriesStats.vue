<template>
  <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
    
    <div class="block w-full overflow-x-auto">
      <div v-if="elements.incoming.length > 0">
        <div class="container px-4 mx-auto py-3">
          <h3 class="text-blueGray-400 text-sm font-bold uppercase">{{ $t('labels.incoming') }} </h3>
        </div>

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
            <tr v-for="(d, i) in elements.incoming" :key="i">
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

      <div v-if="elements.expenses.length > 0">

        <div class="container px-4 mx-auto py-3">
          <h3 class="text-blueGray-400 text-sm font-bold uppercase">{{ $t('labels.expenses') }} </h3>
        </div>

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
            <tr v-for="(d, i) in elements.expenses" :key="i">
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
    <AlertModal />
  </div>
</template>

<script>
import ChartService from '../../services/ChartService.vue';
import AlertModal from '../GenericComponents/AlertModal.vue';

export default {
  components: {
    AlertModal
  },
  data() {
    return {
      options: {
        date: {
          start: null,
          end: null
        },
        categories: [],
        wallets: [],
        types: [],
        currencies: 'eur',
        paymentMethods: [],
        tags: [],
      },
      elements: {
        incoming: [],
        expenses: [],
      },
    }
  },
  created() {
    window.alert = (message, type = 'success') => {
      this.$refs.alertModal.show(message, type);
    };
  },
  methods: {
    setGraph: function () {

      const dateTime = {
        start: this.options.date.start,
        end: this.options.date.end
      }

      ChartService.getStatsEntries(dateTime).then((resp) => {

        resp.rows.forEach(element => {

          if (element < 0) {
            this.elements.incoming.push({
              label: element.label,
              amount: element.amount.toFixed(2),
              amount_before: element.prevAmount.toFixed(2),
              bounce_rate: element.bounceRate.toFixed(2)
            })
          } else {
            this.elements.expenses.push({
              label: element.label,
              amount: element.amount.toFixed(2),
              amount_before: element.prevAmount.toFixed(2),
              bounce_rate: element.bounceRate.toFixed(2)
            })
          }

        });
      }).catch(() => {
        alert(this.$t('messages.generic_error'), "error")
      })
    },
    setOptions(options) {
      this.options.date.start = options.date.start
      this.options.date.end = options.date.end
    }
  }
}
</script>
