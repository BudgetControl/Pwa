<template>
  <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">

    <div class="block w-full overflow-x-auto">

      <table class="items-center w-full bg-transparent border-collapse">
        <thead>
          <tr>
            <th
              class="px-6 bg-blueGray-100 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
              {{ path }} NAME
            </th>
            <th
              class="px-6 bg-blueGray-100 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
              AMOUNT
            </th>
            <th
              class="px-6 bg-blueGray-100 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
              AMOUNT BEFORE
            </th>
            <th
              class="px-6 bg-blueGray-100 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
              BOUNCE RATE
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td
              class="border-</td>t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 uppercase font-semibold bg-blueGray-50">
              {{ $t('labels.incoming') }}</td>
            <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 font-semibold bg-blueGray-50">
              {{ elements.stats.incoming.now }}
            </td>
            <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 font-semibold bg-blueGray-50">
              {{ elements.stats.incoming.before }}
            </td>
            <td
              class="border-</td>t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 font-semibold bg-blueGray-50">
              <i class="fas mr-4" :class="[elements.stats.incoming.bounce_rate > 0 ? 'fa-arrow-up text-emerald-500' : 'fa-arrow-down text-red-500']
                "></i>
              {{ elements.stats.incoming.bounce_rate }}%
            </td>
          </tr>
          <tr v-for="(d, i) in elements.incoming" :key="i">
            <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
              {{ d.label }}
            </td>
            <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
              {{ d.amount }}
            </td>
            <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
              {{ d.amount_before }}
            </td>
            <td class="border-</td>t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
              <i class="fas mr-4" :class="[d.bounce_rate > 0 ? 'fa-arrow-up text-emerald-500' : 'fa-arrow-down text-red-500']
                "></i>
              {{ d.bounce_rate }}%
            </td>
          </tr>
          <tr><td colspan="4" > <hr/> </td></tr>
          <tr>
            <td
              class="border-</td>t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 uppercase font-semibold bg-blueGray-50">
              {{ $t('labels.expenses') }}</td>
            <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 font-semibold bg-blueGray-50">
              {{ elements.stats.expenses.now }}
            </td>
            <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 font-semibold bg-blueGray-50">
              {{ elements.stats.expenses.before }}
            </td>
            <td
              class="border-</td>t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 font-semibold bg-blueGray-50">
              <i class="fas mr-4" :class="[elements.stats.expenses.bounce_rate < 0 ? 'fa-arrow-down text-emerald-500' : 'fa-arrow-up text-red-500']
                "></i>
              {{ elements.stats.expenses.bounce_rate }}%
            </td>
          </tr>
          <tr v-for="(d, i) in elements.expenses" :key="i">
            <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
              {{ d.label }}
            </td>
            <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
              {{ d.amount }}
            </td>
            <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
              {{ d.amount_before }}
            </td>
            <td class="border-</td>t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
              <i class="fas mr-4" :class="[d.bounce_rate < 0 ? 'fa-arrow-down text-emerald-500' : 'fa-arrow-up text-red-500']
                "></i>
              {{ d.bounce_rate }}%
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <AlertModal />
  </div>
</template>

<script>
import AlertModal from '../GenericComponents/AlertModal.vue';
import StatsService from '../../services/StatsService.vue';

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
        currencies: null,
        payment_methods: [],
        tags: [],
      },
      elements: {
        stats: {
          incoming: {
            now: 0,
            before: 0,
            bounce_rate: 0,
          },
          expenses: {
            now: 0,
            before: 0,
            bounce_rate: 0,
          },
        },
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

      const options = this.options
      this.elements.incoming = []
      this.elements.expenses = []

      StatsService.getStatsEntries(options).then((resp) => {

        resp.rows.forEach(element => {

          if (element.type === 'incoming') {

            this.elements.incoming.push({
              label: this.$t('app.' + element.label),
              amount: element.amount.toFixed(2),
              amount_before: element.prevAmount.toFixed(2),
              bounce_rate: element.bounceRate.toFixed(2) * -1
            })

            this.elements.stats.incoming.now = this.elements.incoming.reduce((total, incoming) => total + parseFloat(incoming.amount), 0).toFixed(2);
            this.elements.stats.incoming.before = this.elements.incoming.reduce((total, incoming) => total + parseFloat(incoming.amount_before), 0).toFixed(2);
            this.elements.stats.incoming.bounce_rate = ((this.elements.stats.incoming.now - this.elements.stats.incoming.before) / this.elements.stats.incoming.before) * 100
            if(isNaN(this.elements.stats.incoming.bounce_rate)){
              this.elements.stats.incoming.bounce_rate = 0
            }
            this.elements.stats.incoming.bounce_rate = this.elements.stats.incoming.bounce_rate.toFixed(2)
          } else {
            this.elements.expenses.push({
              label: this.$t('app.' + element.label),
              amount: element.amount.toFixed(2),
              amount_before: element.prevAmount.toFixed(2),
              bounce_rate: element.bounceRate.toFixed(2)
            })

            this.elements.stats.expenses.now = this.elements.expenses.reduce((total, expense) => total + parseFloat(expense.amount), 0).toFixed(2);
            this.elements.stats.expenses.before = this.elements.expenses.reduce((total, expense) => total + parseFloat(expense.amount_before), 0).toFixed(2);
            this.elements.stats.expenses.bounce_rate = ((this.elements.stats.expenses.now - this.elements.stats.expenses.before) / this.elements.stats.expenses.before) * 100
            if(isNaN(this.elements.stats.expenses.bounce_rate)){
              this.elements.stats.expenses.bounce_rate = 0
            }
            this.elements.stats.expenses.bounce_rate = this.elements.stats.expenses.bounce_rate.toFixed(2)
          }


        });
      }).catch(() => {
        alert(this.$t('messages.generic_error'), "error")
      })
    },
    setOptions(options) {
      this.options.date.start = options.date.start
      this.options.date.end = options.date.end
      this.options.categories = options.categories ?? []
      this.options.accounts = options.wallets ?? []
      this.options.types = options.types ?? []
      this.options.currencies = options.currencies ?? null
      this.options.payment_methods = options.payment_methods ?? []
      this.options.tags = options.tags ?? []
    }
  }
}
</script>
