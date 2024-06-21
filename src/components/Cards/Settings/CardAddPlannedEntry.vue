<template>
  <form>
    <div
      class="container relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0 flex-auto p-4">

      <div class="flex flex-wrap py-3">
        <!-- ##### menu ########### -->
        <div class="w-full">
          <nav
            class="relative flex flex-wrap items-center justify-between px-2 py-3 navbar-expand-lg bg-emerald-500 rounded">
            <div class="container px-4 mx-auto flex flex-wrap items-center justify-between">
              <div class="w-full" id="example-navbar-info">
                <ul class="flex flex-col lg:flex-row list-none ml-auto w-full justify-center">
                  <li class="nav-item">
                    <a class="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
                      href="javascript:void(0)" v-on:click="toggleTabs(1)"
                      v-bind:class="{ 'text-emerald-600 ': action.openTab !== 1, 'text-white bg-emerald-600': action.openTab === 1 }">
                      {{ $t('labels.expenses') }}
                    </a>
                  </li>
                  <li class="nav-item">
                    <a class="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
                      href="javascript:void(0)" v-on:click="toggleTabs(2)"
                      v-bind:class="{ 'text-emerald-600 ': action.openTab !== 2, 'text-white bg-emerald-600': action.openTab === 2 }">
                      {{ $t('labels.incoming') }}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </div>
        <!-- ##### menu ########### -->
      </div>
      <div v-bind:class="{ 'bg-red-200': action.openTab === 1, 'bg-lightBlue-200': action.openTab === 2 }"
        class="container relative flex flex-col min-w-0 break-words w-full mb-6 rounded-lg border-0 flex-auto p-4">
        <div class="flex flex-wrap">
          <div class="lg:w-6/12 px-2 py-2 w-full">

            <select v-model="account" id="account" required
              class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150">
              <option value="0">{{ $t('labels.choose_wallet_account') }}</option>
              <option v-for="item in input.account" :key="item.id" :value="item.id">{{ item.name }}</option>
            </select>
          </div>

          <div class="px-2 py-2 w-full lg:w-6/12">
            <select v-model="category" id="category"
              class="w-full border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150">
              <option value="0">{{  $t('labels.choose_a_category') }}</option>
              <option v-for="item in input.category" :key="item.id" :value="item.id">{{ $t('app.' + item.name) }}</option>
            </select>
          </div>

        </div>
        <div class="flex flex-wrap">
          <div class="lg:w-6/12 px-2 py-2 w-full">
            <input v-model="amount" type="tel" placeholder="0,00 €" id="amount"
              class="w-full border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150">
          </div>
          <div class="lg:w-6/12 px-2 py-2 w-full">
            <select v-model="currency"
              class="w-full border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150">
              <option v-for="item in input.currency" :key="item.id" :value="item.id">{{ $t('app.' + item.slug) }}</option>
            </select>
          </div>
        </div>

        <div class="row border rounded border-blueGray-500 py-3 border-dashed">
          <div class="flex flex-wrap">
            <div class="lg:w-12/12 px-2 w-full text-center">
              <label class="text-xs w-full" for="tags">{{ $t('labels.choose_one_of_currently_tags') }}</label>
              <select v-model="label" multiple id="tags"
                class="w-full border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150">
                <option
                  class="text-xs font-semibold justify-center py-1 px-2 uppercase rounded text-white-600 last:mr-0 mr-1"
                  :style="'color: #fff; background-color: ' + item.color" v-for="item in input.tags" :key="item.id"
                  :value="item.id">
                  {{ item.name }}
                </option>
              </select>
            </div>
          </div>

          <div class="flex flex-wrap ">
            <div class="lg:w-12/12 px-2 w-full">
              <input :placeholder="$t('labels.or_nsert_new_tag_name')" v-model="newlabel" type="text" id="tag"
                class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150">
            </div>
          </div>

          <div class="flex flex-wrap py-3 ml-2">
            <div v-for="(item, i) in input.tags" :key="i">
              <span
                class="text-xs font-semibold justify-center py-1 px-2 uppercase rounded text-white-600 last:mr-0 mr-1"
                v-if="label.includes(item.id)" :style="'color: #fff; background-color: ' + item.color">{{
                        item.name
                      }}</span>
            </div>
          </div>

        </div>

        <div class="flex flex-wrap py-3">
          <div class="lg:w-12/12 px-2 w-full">
            <textarea v-model="note" type="text" :placeholder="$t('labels.add_here_your_note')" required id="note" rows="2"
              class="border-0 px-3 py-5 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" />
          </div>

          <div class="flex w-full flex-wrap py-3">
            <div class="lg:w-3/12 px-2 w-full">
              <span class="text-xs">{{ $t('labels.date_start') }}</span>
              <VueDatePicker v-model="date"></VueDatePicker>

            </div>

            <div class="lg:w-3/12 px-2 w-full">
              <span class="text-xs">{{ $t('labels.date_end') }}</span>
              <VueDatePicker v-model="end_date_time"></VueDatePicker>
            </div>

            <div class="lg:w-3/12 px-2 w-full">
              <span class="text-xs">{{ $t('labels.choose_frequency') }}</span>
              <select id="planning" v-model="planning"
                class="w-full border-0 px-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150">
                <option required v-for="(item, k) in input.planning" :key="k" :value="item.value">{{ item.label }}</option>
              </select>
            </div>

            <div class="lg:w-3/12 px-2 w-full">
              <span class="text-xs">{{ $t('labels.choose_method') }}</span>
              <select v-model="payment_type" id="payment_type"
                class="w-full border-0 px-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150">
                <option v-for="item in input.payment_type" :key="item.id" :value="item.id">{{ $t('app.' + item.slug) }}</option>
              </select>
            </div>

          </div>

        </div>

      </div>

      <div class="flex flex-wrap py-3">
        <div class="lg:w-12/12 px-2 w-full">
          <button v-on:click="setEntry()"
            class="w-full bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded-full shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button">
            {{ $t('labels.save') }}
          </button>
        </div>
      </div>

      <div :class="'text-white px-6 py-4 border-0 rounded relative mb-4 bg-red-500' + action.alert_color"
        v-if="this.action.alert">
        <span class="text-xl inline-block mr-5 align-middle">
          <i class="fas fa-bell"></i>
        </span>
        <span class="inline-block align-middle mr-8">
          {{ this.action.alert_message }}
        </span>
        <button v-on:click="closeAlert()"
          class="absolute bg-transparent text-2xl font-semibold leading-none right-0 top-0 mt-4 mr-6 outline-none focus:outline-none">
          <span>×</span>
        </button>
      </div>

    </div>
    <AlertModal ref="alertModal" />
  </form>
</template>

<script>
import ApiService from '@/services/ApiService.vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import AlertModal from '../../GenericComponents/AlertModal.vue';

export default {
  props: {
    entryId: {
      type: Number,
      default: null,
    },
    isPlanned: {
      type: Boolean,
      default: false,
    },
    typeOfEntry: {
      type: String,
      default: 'expenses'
    }
  },
  data() {
    return {
      action: {
        reset: false,
        models: false,
        openTab: 1,
        alert: false,
        alert_message: null,
        hidecategory: true,
        hidedebit: false,
        dateUpdated: false,
        hidetransfer_to: false,
        alert_color: 'bg-red-500',
      },
      date: null,
      amount: null,
      type: "expenses",
      category: 0,
      label: [],
      note: null,
      currency: 1,
      account: 0,
      payment_type: 1,
      model: null,
      newlabel: null,
      planned: false,
      confirmed: true,
      waranty: false,
      uuid: null,
      transferto: "-1",
      geolocalization: "",
      name: "",
      end_date_time: null,
      planning: 'daily',
      debit: null,
      input: {
        tags: [],
        category: [],
        payment: [],
        account: [],
        currency: [],
        payment_type: [],
        model: [],
        planning: ["daily", "weekly", "monthly", "yearly"],
        debit: [],
      }
    }
  },
  components: {
    VueDatePicker, AlertModal
  },
  created() {
    window.alert = (message, type = 'success') => {
      this.$refs.alertModal.show(message, type);
    };
  },
  mounted() {
    this.action.openTab = 1
    this.time()
    this.getCategory()
    this.getCurrency()
    this.getAccount()
    this.getLabels()
    this.getPaymentType()
    if (this.entryId != null) {
      this.getEntry()
    }

    this.input.planning = [
      {
        label: this.$t('labels.daily'),
        value: 'daily'
      },
      {
        label: this.$t('labels.weekly'),
        value: 'weekly'
      },
      {
        label: this.$t('labels.monthly'),
        value: 'monthly'
      },
      {
        label: this.$t('labels.yearly'),
        value: 'yearly'
      }
    ]
    
  },
  methods: {
    time() {
      const _this = this
      if (this.action.dateUpdated == false) {
        let dateTime = new Date()
        _this.date = dateTime.toISOString().split('T')[0] + " " + dateTime.toLocaleTimeString()
      }
    },
    getCategory() {
      let _this = this
      ApiService.categories().then((res) => {
        _this.input.category = res
      })
    },
    getPaymentType() {
      let _this = this
      ApiService.paymentstype().then((res) => {
        let data = res
        data.forEach(function (r) {
          _this.input.payment_type.push(r)
        })
      })
    },
    getEntry() {
      let _this = this
      this.action.reset = true
      this.toggleTabs(this.typeOfEntry)

      ApiService.getEntryDetail(this.entryId, this.isPlanned).then((res) => {
        let model = res

        _this.amount = Math.abs(model.amount)
        if (model.type == 'incoming') {
          _this.action.openTab = 2
        }

        if (model.type == 'expenses') {
          _this.action.openTab = 1
        }

        if (model.type == 'transfer') {
          _this.action.openTab = 3
        }

        if (model.type == 'debit') {
          _this.action.openTab = 4
        }

        _this.type = model.type
        _this.category = model.sub_category.id
        _this.note = model.note
        _this.currency = model.currency_id
        _this.account = model.account.id
        _this.payment_type = model.payment_type
        _this.waranty = model.waranty == 1 ? true : false
        _this.confirmed = model.confirmed == 1 ? true : false
        _this.action.dateUpdated = true
        _this.uuid = model.uuid
        _this.date = model.date_time
        _this.planning = model.planning
        _this.transfer_realtion = model.transfer_relation
        _this.planned = model.planning
        _this.end_date_time = model.end_date_time

        if (model.transfer == 1) {
          _this.action.hidecategory = true
          _this.transferto = model.transfer_id
        }

        model.label.forEach((item) => {
          _this.label.push(item.id)
        });
      })

    },
    getLabels() {
      let _this = this
      ApiService.labels().then((res) => {
        let data = res
        data.forEach(function (r) {
          _this.input.tags.push(r)
        })
      })
    },

    validateBefore() {

      if (this.account == 0) {
        alert(this.$t('messages.validation.choose_wallet'), "error")
        return false
      }

      if (this.category == 0) {
        alert(this.$t('messages.validation.choose_category'), "error")
        return false
      }

      let num = this.amount + 9
      if (this.amount == null || isNaN(num)) {
        alert(this.$t('messages.validation.insert_amount'), "error")
        return false
      }

      return true

    },

    setEntry() {

      if (this.validateBefore()) {
        let label = this.label
        let _this = this

        if (this.label.length == 0 && this.newlabel != null) {
          label = [this.newlabel]
        }
        let data = {
          amount: this.amount,
          note: this.note,
          label: label,
          account_id: this.account,
          category_id: this.category,
          currency_id: this.currency,
          payment_type: this.payment_type,
          uuid: this.uuid,
          transfer_id: this.transferto,
          date_time: this.date,
          payee_id: (this.debit == 'njn76298fm') ? this.debit_name : this.debit,
          confirmed: this.confirmed,
          waranty: this.waranty,
          geolocalization: this.geolocalization,
          planning: this.planning,
          transfer_realtion: this.transfer_relation,
          end_date_time: this.end_date_time
        }

        if (this.type == "expenses") {
          data.amount = this.amount * -1
        }

        ApiService.setEntry(this.type, data, this.isPlanned, this.entryId).then(() => {
          _this.date = null,
            _this.amount = null,
            _this.category = data.category_id,
            _this.label = [],
            _this.note = null,
            _this.currency = 1,
            _this.account = data.account_id,
            _this.payment_type = 1,
            _this.model = [],
            _this.newlabel = null,

            _this.action.dateUpdated = false
          this.time()

          alert('Entry saved successfully', "success")

        }).catch(() => {
          alert('Ops an error occurred ...', "error")

        })
      }

    },
    getCurrency() {
      let _this = this
      ApiService.currencies().then((res) => {
        let data = res
        data.forEach(function (r) {
          _this.input.currency.push(r)
        })
      })
    },
    getAccount() {
      let _this = this
      ApiService.accounts().then((res) => {
        let data = res
        data.forEach(function (r) {
          _this.input.account.push(r)
        })
      })
    },
    closeAlert: function () {
      this.action.alert = false;
    },
    toggleTabs: function (tabNumber) {
      switch (tabNumber) {
        case 1:
        case 'expenses':
          this.type = "expenses"
          this.category = 0
          this.debit = 0
          this.debit_name = null
          this.action.hidecategory = true
          this.action.hidetransfer_to = false
          break;
        case 2:
        case 'incoming':
          this.type = "incoming"
          this.debit = 0
          this.category = 0
          this.debit_name = null
          this.action.hidecategory = true
          this.action.hidetransfer_to = false
          break;
        case 3:
        case 'transfer':
          this.type = "transfer"
          this.debit = 0
          this.debit_name = null
          this.action.hidecategory = false
          this.action.hidetransfer_to = false
          this.category = null
          break;
        case 4:
        case 'debit':
          this.type = "debit"
          this.action.hidecategory = false
          this.action.hidetransfer_to = true
          this.category = null
          break;
        default:

      }
      this.action.openTab = tabNumber
    }
  },
};

</script>

<style scoped>
.dp__input {
  border: none !important
}
</style>