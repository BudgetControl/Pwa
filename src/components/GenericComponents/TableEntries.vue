<template>
  <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">

    <div class="block w-full overflow-x-auto">

      <table class="items-center w-full bg-transparent border-collapse">
        <thead>
          <tr>
            <th
              class="px-6 bg-slate-100 text-slate-500 align-middle border border-solid border-slate-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
              {{ $t('labels.name') }}
            </th>
            <th
              class="px-6 bg-slate-100 text-slate-500 align-middle border border-solid border-slate-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
              {{ $t('labels.amount') }}
            </th>
            <th class="px-6 bg-slate-100 text-slate-500 align-middle border border-solid border-slate-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td
              class="border-</td>t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 uppercase font-semibold bg-slate-50">
              {{ $t('labels.incoming') }}</td>
            <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 font-semibold bg-slate-50">
              {{ elements.stats.incoming.now }}
            </td>
            <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 font-semibold bg-slate-50">
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
              <!-- <button  v-if="d.amount > 0" @click="showEntries" class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded text-emerald-600 bg-emerald-200 uppercase last:mr-0 mr-1" type="button">
                {{ $t('labels.show_entries') }}
              </button> -->
            </td>
          </tr>
          <tr><td colspan="3" > <hr/> </td></tr>
          <tr>
            <td
              class="border-</td>t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 uppercase font-semibold bg-slate-50">
              {{ $t('labels.expenses') }}</td>
            <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 font-semibold bg-slate-50">
              {{ elements.stats.expenses.now }}
            </td>
            <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 font-semibold bg-slate-50">
              
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
              <!-- <button v-if="d.amount < 0" @click="showEntries" class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded text-emerald-600 bg-emerald-200 uppercase last:mr-0 mr-1" type="button">
                {{ $t('labels.show_entries') }}
              </button> -->
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
import StatsService from '../../services/stats.service'


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
          },
          expenses: {
            now: 0,
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

      // clear stats
      this.elements.stats.incoming.now = 0
      this.elements.stats.expenses.now = 0

      
      const statsService = new StatsService()
      statsService.getStatsEntries(options).then((resp) => {

        resp.rows.forEach(element => {

          if (element.type === 'incoming') {

            this.elements.incoming.push({
              label: this.$t('app.' + element.label),
              amount: element.amount.toFixed(2),
            })

            this.elements.incoming.sort(function (a, b) {
                return a.label.localeCompare(b.label);
            })

            this.elements.stats.incoming.now = this.elements.incoming.reduce((total, incoming) => total + parseFloat(incoming.amount), 0).toFixed(2);
            this.elements.stats.incoming.before = this.elements.incoming.reduce((total, incoming) => total + parseFloat(incoming.amount_before), 0).toFixed(2);
          } else {
            this.elements.expenses.push({
              label: this.$t('app.' + element.label),
              amount: element.amount.toFixed(2),
            })

            this.elements.stats.expenses.now = this.elements.expenses.reduce((total, expense) => total + parseFloat(expense.amount), 0).toFixed(2);

            this.elements.expenses.sort(function (a, b) {
                return a.label.localeCompare(b.label);
            })

          }
        });
      }).catch(() => {
        alert(this.$t('messages.generic_error'), "error")
      })
    },
    showEntries() {
      console.log('show entries')
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
