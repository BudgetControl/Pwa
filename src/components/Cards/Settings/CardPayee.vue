<template>
  <div class="relative flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0 shadow-lg">

    <div class="container px-4 mx-auto py-3">
      <h3 class="text-slate-400 text-sm mt-3 mb-6 font-bold uppercase">{{ $t('labels.list_of_all_payees') }} </h3>
    </div>

    <div v-if="entries.length === 0">
      <div class="text-center">
        <p class="text-slate-400 text-lg">{{ $t('labels.no_payees_found') }}</p>
      </div>
    </div>

    <div class="container px-4 mx-auto py-3 border-slate-100" v-for="(entry, i) in this.entries" :key="i">


      <div class="container px-4 mx-auto">
        <div class="flex flex-wrap">
          <div class="flex-l w-full px-4">
            <span class="text-xs block text-emerald-500 rounded ">{{ entry.createdAt }}</span>
          </div>
        </div>

        <div class="flex flex-wrap">
          <div class="w-full px-4 flex-1">
            <span class="text-xs block rounded text-slate-900">
              {{ entry.name }}</span>
          </div>


          <div>
            <span class="text-sm block text-slate-700 rounded ">
              {{ entry.amount }} <i :class="'fas fa-circle ' + entry.color_amount + ' mr-2'"></i>
            </span>
          </div>

          <div>
            <EntryActionDropdown>
                <Action :onAction="() => goToRoute(entry.uuid)" :label="$t('labels.details')" iconClass="fa-solid fa-eye"/>
                <Action :onAction="() => archive(entry.uuid,i)" :label="$t('labels.archive')" iconClass="fa-solid fa-trash-can-arrow-up text-red-400"/>
            </EntryActionDropdown>
          </div>
        </div>
      </div>
    </div>

    <hr />

    <div v-if="creditCards.length > 0">
      <div class="container px-4 mx-auto py-3">
        <h3 class="text-slate-400 text-sm mt-3 mb-6 font-bold uppercase">{{ $t('labels.list_of_all_credit_cards') }}
        </h3>
      </div>
    </div>

    <div class="container px-4 mx-auto py-3 border-slate-100" v-for="(entry, i) in this.creditCards" :key="i">

      <div class="container px-4 mx-auto">
        <div class="flex flex-wrap">
          <div class="flex-l w-full px-4">
            <span class="text-xs block text-emerald-500 rounded ">{{ entry.createdAt }}</span>
          </div>
        </div>

        <div class="flex flex-wrap">
          <div class="w-full px-4 flex-1">
            <span class="text-xs block rounded text-slate-900">
              {{ entry.name }}</span>
          </div>

          <div class="px-4 flex text-right">
            <span class="text-sm block text-slate-700 rounded ">
              {{ entry.amount }} <i :class="'fas fa-circle ' + entry.color_amount + ' mr-2'"></i>
            </span>
          </div>
          
          <div class="flex text-right">
            <EntryActionDropdown>
                <Action :onAction="() => goToRouteCreditCard(entry.uuid)" :label="$t('labels.details')" iconClass="fa-solid fa-eye"/>
            </EntryActionDropdown>
          </div>

        </div>
      </div>
    </div>
    <ConfirmModal ref="confirmModal" />
  </div>
</template>
<script>

import CoreService from "../../../services/core.service";
import Action from "../../Dropdowns/Action.vue";
import EntryActionDropdown from "../../Dropdowns/EntryActionDropdown.vue";
import ConfirmModal from "../../GenericComponents/ConfirmModal.vue";

export default {
  setup() {
        const apiService = new CoreService()

        return {
            apiService
        }
    },
  data() {
    return {
      entries: [],
      creditCards: [],
      index: null,
      showModal: false,
      name: null
    }
  },
  components: {
    EntryActionDropdown, Action, ConfirmModal
  },
  created() {
      window.confirm = (message) => {
          return this.$refs.confirmModal.show(message);
      };
  },
  mounted() {
    this.getPlannedEntries()
  },
  methods: {
    goToRoute: function (uuid) {
      this.$router.push({ name: 'entries', query: { filter_payee: uuid } })
    },
    goToRouteCreditCard: function (uuid) {
      this.$router.push({ name: 'entries', query: { filter_wallet: uuid } })
    },
    getPlannedEntries() {
      this.apiService.debtsList().then((resp) => {
        let debitColor = "text-red-500"

        resp.forEach(e => {

          debitColor = "text-slate-500"

          let totalamout = e.debts.balance

          if (totalamout < 0) {
            debitColor = "text-emerald-500"
          }

          if (totalamout > 0) {
            debitColor = "text-red-400"
          }

          let info = {
            uuid: e.uuid,
            createdAt: e.createdAt,
            color_amount: debitColor,
            name: e.name,
            amount: totalamout,
            entry: e.debts.entries,
            type: e.type
          }

          // create two different of gourps
          if (e.type == 'credit-card-revolving') {
            this.creditCards.push(info)
          } else {
            this.entries.push(info)
          }

        });

      }).catch((error) => {
        console.error(error);
      })
    },
    async archive(uuid,index) {
      const userConfirmed = await window.confirm(this.$t('messages.archive_debit'));
      if (userConfirmed) {
        ApiService.deleteDebt(uuid)
        this.entries.splice(index, 1);
      }
    }
  }
}
</script>

<style>
.opacity {
  opacity: 0.3;
}

.left {
  margin-left: 25%;
}
</style>
