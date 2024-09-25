<template>
  <div class="relative flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0 shadow-lg">

    <div class="flex-auto px-4 lg:px-10 py-10 pt-0">
      <form>
        <h6 class="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
          {{ $t('labels.stats') }}
        </h6>
        <div class="flex flex-wrap">
          <div class="w-full lg:w-12/12 px-4">
            <div class="relative w-full mb-3">
              <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                {{ $t('labels.date_interval') }}
              </label>
              <VueDatePicker v-model="action.date_time" :options="input.month" :required=true
                :placeholder="$t('labels.date_interval')" format="yyyy-MM-dd" />
            </div>
          </div>

          <div class="w-full lg:w-6/12 px-4">
            <div class="relative w-full mb-3">
              <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                {{ $t('labels.category') }}
              </label>
              <select multiple
                class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                v-model="action.category">
                <option v-for="category in input.category" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>
          </div>
          <div class="w-full lg:w-6/12 px-4">
            <div class="relative w-full mb-3">
              <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                {{ $t('labels.account') }}
              </label>
              <select multiple
                class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                v-model="action.account">
                <option v-for="account in input.account" :key="account.id" :value="account.id">{{
                  account.name
                }}</option>
              </select>
            </div>
          </div>

          <div class="w-full lg:w-12/12 px-4">
            <div class="relative w-full mb-3">
              <label class="bl}ock uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                {{ $t('labels.label') }}
              </label>
              <select v-model="action.tags" multiple
                class="w-full border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150">
                <option
                  :class="'text-xs font-semibold justify-center py-1 px-2 uppercase rounded text-white-600 last:mr-0 mr-1 ' + item.color"
                  v-for="item in input.tags" :key="item.id" :value="item.id">
                  {{ item.name }}
                </option>
              </select>
            </div>
          </div>

          <div class="w-full lg:w-6/12 px-4">
            <div class="relative w-full mb-3">
              <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                {{ $t('labels.payment_types') }}
              </label>
              <select multiple
                class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                v-model="action.payment_methods">
                <option v-for="payment in input.payment_methods" :key="payment.id" :value="payment.id">
                  {{ payment.name }}
                </option>
              </select>
            </div>
          </div>

          <div class="w-full lg:w-6/12 px-4">
            <div class="relative w-full mb-3">
              <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                {{ $t('labels.currency') }}
              </label>
              <select multiple
                class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                v-model="action.currencies">
                <option v-for="currency in input.currencies" :key="currency.id" :value="currency.id">
                  {{ currency.name }}
                </option>
              </select>
            </div>
          </div>

        </div>

        <hr class="mt-6 border-b-1 border-blueGray-300" />

        <div class="flex flex-wrap">
          <div class="w-full lg:w-12/12 px-4">
            <div class="relative w-full mb-3">
              <button v-on:click="invoke()"
                class="w-full bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded-full shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button">
                {{ $t('labels.search') }}
              </button>
            </div>
          </div>
        </div>

        <hr class="mt-6 border-b-1 border-blueGray-300" />

      </form>
    </div>

    <div class="flex-auto p-4">
      <TableEntries ref="statsTable" />
    </div>
  </div>
</template>
<script>
import TableEntries from '../GenericComponents/TableEntries.vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import CoreService from '../../services/core.service';
import { getHeaderTokens } from '../../utils/headers-token';

export default {
  components: {
    TableEntries, VueDatePicker
  },
  setup() {
    const headers = getHeaderTokens()
    const apiService = new CoreService(headers)

    return {
      apiService
    }
  },
  data() {
    return {
      input: {
        account: [],
        category: [],
        type: ["incoming", "expenses", "transfer", "debit"],
        tags: [],
        currencies: [],
        payment_methods: [],
      },
      action: {
        account: null,
        category: null,
        type: [],
        tags: null,
        text: null,
        planned: null,
        date_time: null,
        currencies: null,
        payment_methods: null,
      }
    }
  },
  mounted() {
    this.getCategory()
    this.getAccount()
    this.getLabels()
    this.getPaymentType()
    this.getCurrencies()

    this.input.type = [
      {
        name: this.$t('labels.incoming'),
        id: 'incoming'
      },
      {
        name: this.$t('labels.expenses'),
        id: 'expenses'
      },
      {
        name: this.$t('labels.transfer'),
        id: 'transfer'
      },
      {
        name: this.$t('labels.debit'),
        id: 'debit'
      }
    ]

    this.invoke()

  },
  methods: {
    invoke() {

      const year = new Date().getFullYear()
      const month = new Date().getMonth() + 1

      let date
      if (this.action.date_time == null) {
        date = {
          start: year + "/" + month + "/01",
          end: year + "/" + month + "/" + new Date(year, month, 0).getDate()
        }
      } else {
        date = {
          start: this.action.date_time[0],
          end: this.action.date_time[1]
        }
      }

      const options = {
        date: date,
        categories: this.action.category,
        wallets: this.action.account,
        types: this.action.type,
        currencies: this.action.currencies,
        payment_methods: this.action.payment_methods,
        tags: this.action.tags,
      }

      this.$refs.statsTable.setOptions(options)
      this.$refs.statsTable.setGraph()
    },
    getLabels() {
      let _this = this
      this.apiService.labels().then((res) => {
        let data = res
        data.forEach(function (r) {
          _this.input.tags.push(r)
        })
      })
    },
    getCategory() {
      let _this = this
      this.apiService.subCategories().then((res) => {
        let data = res
        data.forEach(function (sub) {
          _this.input.category.push({
            id: sub.id,
            name: _this.$t('app.' + sub.slug),
          })
        })
        _this.input.category.sort(function (a, b) {
          return a.name.localeCompare(b.name);
        });

      })
    },
    getAccount() {
      let _this = this
      this.apiService.accounts('?order[name]=asc').then((res) => {
        let data = res
        data.forEach(function (r) {
          _this.input.account.push(r)
        })
      })
    },
    getPaymentType() {
      let _this = this
      this.apiService.paymentstype().then((res) => {
        let data = res
        data.forEach(function (r) {
          _this.input.payment_methods.push({
            id: r.id,
            name: _this.$t('app.' + r.slug),
          })
          _this.input.payment_methods = _this.input.payment_methods.sort(function (a, b) {
            return a.name.localeCompare(b.name);
          });
        })
      })
    },
    getCurrencies() {
      let _this = this
      this.apiService.currencies().then((res) => {
        let data = res
        data.forEach(function (r) {
          _this.input.currencies.push({
            id: r.id,
            name: _this.$t('app.' + r.slug),
          })
          _this.input.currencies = _this.input.currencies.sort(function (a, b) {
            return a.name.localeCompare(b.name);
          });
        })
      })
    }
  }
};
</script>
