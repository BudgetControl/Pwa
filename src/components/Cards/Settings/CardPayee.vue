<template>
  <div class="relative flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0 shadow-lg">

    <div class="container px-4 mx-auto py-3">
      <h3 class="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">{{ $t('labels.list_of_all_payees') }} </h3>
    </div>

    <div v-if="entries.length === 0">
      <div class="text-center">
        <p class="text-blueGray-400 text-lg">{{ $t('labels.no_payees_found') }}</p>
      </div>
    </div>

    <div class="container px-4 mx-auto py-3 border-blueGray-100" v-for="(entry, i) in this.entries" :key="i">


      <div class="container px-4 mx-auto">
        <div class="flex flex-wrap">
          <div class="flex-l w-full px-4">
            <span class="text-xs block text-emerald-500 rounded ">{{ entry.createdAt }}</span>
          </div>
        </div>

        <div class="flex flex-wrap">
          <div class="w-full px-4 flex-1">
            <span class="text-xs block rounded text-blueGray-900">
              {{ entry.name }}</span>
          </div>


          <div>
            <span class="text-sm block text-blueGray-700 rounded ">
              {{ entry.amount }} <i :class="'fas fa-circle ' + entry.color_amount + ' mr-2'"></i>
            </span>
          </div>

          <div>
            <EntryActionDropdown :entryId="entry.uuid" :type="isModel === true
              ? 'model'
              : 'entry'
              " :index=i @deleteItem="deleteItemFromArray" />
          </div>
        </div>
      </div>
    </div>

    <hr />

    <div v-if="creditCards.length > 0">
      <div class="container px-4 mx-auto py-3">
        <h3 class="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">{{ $t('labels.list_of_all_credit_cards') }}
        </h3>
      </div>
    </div>

    <div class="container px-4 mx-auto py-3 border-blueGray-100" v-for="(entry, i) in this.creditCards" :key="i">

      <div class="container px-4 mx-auto">
        <div class="flex flex-wrap">
          <div class="flex-l w-full px-4">
            <span class="text-xs block text-emerald-500 rounded ">{{ entry.createdAt }}</span>
          </div>
        </div>

        <div class="flex flex-wrap">
          <div class="w-full px-4 flex-1">
            <span class="text-xs block rounded text-blueGray-900">
              {{ entry.name }}</span>
          </div>

          <div class="px-4 flex text-right">
            <span class="text-sm block text-blueGray-700 rounded ">
              {{ entry.amount }} <i :class="'fas fa-circle ' + entry.color_amount + ' mr-2'"></i>
            </span>
          </div>

          <div v-on:click="goToRouteCreditCard(i)" class="flex text-right">
            <i class="text-xs fa-solid fa-arrow-right-from-bracket py-1"></i>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>
<script>

import ApiService from '../../../services/ApiService.vue';
import EntryActionDropdown from "@/components/Dropdowns/EntryActionDropdown.vue";

export default {
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
    EntryActionDropdown
  },
  mounted() {
    this.getPlannedEntries()
  },
  methods: {
    goToRoute: function (i) {
      this.$router.push({ name: 'entries', query: { filter_payee: this.entries[i].uuid } })
    },
    goToRouteCreditCard: function (i) {
      this.$router.push({ name: 'entries', query: { filter_wallet: this.creditCards[i].uuid } })
    },
    getPlannedEntries() {
      ApiService.debtsList().then((resp) => {
        let debitColor = "text-red-500"

        resp.forEach(e => {

          debitColor = "text-blueGray-500"

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
    archive(uuid) {
      ApiService.deleteDebt(uuid).then(() => {
        this.getPlannedEntries()
      }).catch((error) => {
        console.error(error);
      })
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
