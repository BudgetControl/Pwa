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

    <div class="container px-4 mx-auto py-3 border border-solid border-blueGray-100 shadow"
      v-for="(entry, i) in this.entries" :key="i">
      <div v-on:click="goToRoute(i)" class="flex flex-wrap">
        <div class="flex-l w-full px-4">
          <span class="text-xs block text-emerald-500 rounded ">{{ entry.date }}</span>
        </div>
      </div>
      <div class="flex flex-wrap">
        <div class="w-full px-4 flex-1">
          <span class="text-xs block rounded text-blueGray-900">
            {{ entry.name }}</span>
        </div>
        <div v-on:click="goToRoute(i)" class="w-full px-4 flex-1 text-right">
          <span class="text-sm block text-blueGray-700 rounded ">
            {{ entry.amount }} <i :class="'fas fa-circle ' + entry.color_amount + ' mr-2'"></i>
          </span>

        </div>
      </div>

      <div class="flex flex-wrap">
        <div class="w-full px-4 flex-1">
          <span class="text-xs mt-2 block text-blueGray-700 rounded ">

          </span>
        </div>

        <div class="w-full px-4 flex-1 text-right">

        </div>

      </div>
    </div>

  </div>
</template>
<script>

//import PayeeActionDropdown from "@/components/Dropdowns/PayeeActionDropdown.vue";
import ApiService from '../../../services/ApiService.vue';

export default {
  components: {
    //PayeeActionDropdown
  },
  data() {
    return {
      entries: [],
      index: null,
      showModal: false,
      name: null
    }
  },
  mounted() {
    this.getPlannedEntries()
  },
  methods: {
    goToRoute: function(i){
      if(this.entries[i].type == 'debit'){
        this.$router.push({ name: 'entries', query: { filter_payee: this.entries[i].uuid } })
      } else {
        this.$router.push({ name: 'entries', query: { filter_wallet: this.entries[i].uuid } })
      }

    },
    deleteItemFromArray(index) {
      this.entries.splice(index, 1);
    },
    getPlannedEntries() {
      ApiService.debtsList().then((resp) => {
        let debitColor = "text-red-500"

        resp.forEach(e => {

          debitColor = "text-blueGray-500"

          let totalamout = e.debts.balance
          if(e.type == 'credit-card-revolving'){
            totalamout = totalamout * -1
          }

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

          this.entries.push(info)

        });

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
