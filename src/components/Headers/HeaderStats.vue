<template>
  <!-- Header -->
  <div class="relative bg-emerald-600 pb-32 pt-12">
    <div class="px-1 md:px-10 mx-auto w-full">
      <div id="statsWallet">
        <div class="px-2 flex overflow-x-auto mb-2">
          <CardWallet v-for="w in wallets" :key="w.id" :statTitle="w.name" :statWallet="w.balance"
            :statColor="w.color" :statIdWallet="w.id" :currency="w.currency"></CardWallet>
        </div>
        <!-- Card stats -->
        <div class="flex overflow-x-auto">
          <div class="min-w px-2">
            <router-link to="/app/entries" v-slot="{ href, navigate }">
              <a :href="href" @click="navigate">
                <card-stats :statSubtitle="$t('labels.wallet')" :statTitle="wallet.statTitle + ' €'" statIconColor="bg-sky-500" />
              </a>
            </router-link>
          </div>

          <div class="min-w px-2">
            <router-link to="/app/entries?type=planned" v-slot="{ href, navigate }">
              <a :href="href" @click="navigate">
                <card-stats :statSubtitle="$t('labels.end_of_month')" :statTitle="walletPlanned.statTitle + ' €'"
                  :statArrow="walletPlanned.statArrow" :statPercent="walletPlanned.statPercent"
                  statIconName="fas fa-money-bill" statIconColor="bg-teal-500" />
              </a>
            </router-link>
          </div>

          <div class="min-w px-2">
            <a>
              <card-stats :statSubtitle="$t('labels.my_health')" :statTitle="health.statTitle + ' €'" :statArrow="health.statArrow"
                :statPercent="health.statPercent" statIconName="fas fa-heart" :statIconColor=health.iconColor />
            </a>
          </div>

          <div class="min-w px-2">
            <router-link to="/app/entries?type=incoming" v-slot="{ href, navigate }">
              <a :href="href" @click="navigate">
                <card-stats :statSubtitle="$t('labels.incoming')" :statTitle="incoming.statTitle + ' €'"
                  :statArrow="incoming.statArrow" :statPercent="incoming.statPercent"
                  :statPercentColor="incoming.statPercentColor" statDescripiron="Last month" statIconName="fas fa-coins"
                  statIconColor="bg-sky-500" />
              </a>
            </router-link>
          </div>

          <div class="min-w px-2">
            <router-link to="/app/entries?type=expenses" v-slot="{ href, navigate }">
              <a :href="href" @click="navigate">
                <card-stats :statSubtitle="$t('labels.expenses')" :statTitle="expenses.statTitle + ' €'"
                  :statArrow="expenses.statArrow" :statPercent="expenses.statPercent"
                  :statPercentColor="expenses.statPercentColor" statDescripiron="Last month"
                  statIconName="fas fa-hand-holding-usd" statIconColor="bg-red-500" />
              </a>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CardStats from "@/components/Cards/CardStats.vue";
import CardWallet from "@/components/Cards/CardWallet.vue";
import { useRefreshStore } from "../../storage/refresh";
import StatsService from '../../services/stats.service';

export default {
  components: {
    CardStats, CardWallet
  },
  setup() {
    const refreshApp = useRefreshStore()
    

    return {
      refreshApp
    }
  },
  data() {
    return {
      wallets: [],
      wallet: {
        statTitle: 0,
        statArrow: "up",
        statPercent: 0,
        statPercentColor: "text-emerald-500"
      },
      health: {
        statTitle: 0,
        statArrow: "up",
        statPercent: 0,
        statPercentColor: "text-emerald-500",
        iconColor: 'bg-teal-500'
      },
      walletPlanned: {
        statTitle: 0,
        statArrow: "up",
        statPercent: 0,
        statPercentColor: "text-emerald-500"
      },
      incoming: {
        statTitle: 0,
        statArrow: "up",
        statPercent: 0,
        statPercentColor: "text-emerald-500"
      },
      expenses: {
        statTitle: 0,
        statArrow: "up",
        statPercent: 0,
        statPercentColor: "text-emerald-500"
      },
      planned: 0
    }
  },
  mounted() {
    this.refreshApp.$subscribe((mutation, state) => {
  if (state.state) {
    this.update();
  }
});
    this.update()
  },
  methods: {
    update() {
      this.getMonthIncoming()
      this.getMonthexpenses()
      this.getWallet()
      this.getWallets()
      this.getWalletPlanned()
      this.getHealth()
    },
    getWallet() {
      const statsService = new StatsService(this.headers)
      statsService.total().then((resp) => {
        let data = resp
        this.wallet.statTitle = data.total.toFixed(2)

      }).catch((error) => {
        console.error(error);
      })
    },

    getHealth() {
      const statsService = new StatsService(this.headers)
      statsService.health().then((resp) => {
        let data = resp
        this.health.statTitle = data.total.toFixed(2)

        if (data.total <= 0) {
          this.health.iconColor = 'bg-red-500'
        } else {
          this.health.iconColor = 'bg-teal-500'
        }

      }).catch((error) => {
        console.error(error);
      })
    },

    getWalletPlanned() {
      const statsService = new StatsService(this.headers)
      statsService.planned().then((resp) => {

        let data = resp
        this.walletPlanned.statTitle = data.total.toFixed(2)

      }).catch((error) => {
        console.error(error);
      })

    },
    getMonthIncoming() {
      const date_time = new Date()
      const start_date = date_time.getFullYear() + '-' + (date_time.getMonth() + 1) + '-01'
      const end_date = date_time.getFullYear() + '-' + (date_time.getMonth() + 1) + '-' + date_time.getDate()

      const statsService = new StatsService(this.headers)
      statsService.incoming(`?start_date=${start_date}&end_date=${end_date}`).then((resp) => {
        let data = resp
        this.incoming.statTitle = data.total.toFixed(2)
        this.incoming.statPercent = data.percentage
        this.incoming.statArrow = data.percentage <= 0 ? "down" : "up"
        this.incoming.statPercentColor = data.percentage <= 0 ? "text-red-500" : "text-emerald-500"

      }).catch((error) => {
        console.error(error);
      })
    },
    getMonthexpenses() {
      const statsService = new StatsService(this.headers)
      statsService.expenses().then((resp) => {
        let data = resp
        this.expenses.statTitle = data.total.toFixed(2)
        this.expenses.statPercent = data.percentage
        this.expenses.statArrow = data.percentage < 0 ? "down" : "up"
        this.expenses.statPercentColor = data.percentage > 0 ? "text-red-500" : "text-emerald-500"

      }).catch((error) => {
        console.error(error);
      })
    },
    getWallets() {
      this.wallets = []
      const statsService = new StatsService(this.headers)
      statsService.wallets().then((resp) => {
        let data = resp
        data.forEach(e => {
            const walletType = e.type
            let balance = e.balance
            let currency = e.currency.icon
            if(walletType === 'voucher') {
              balance = e.balance.value_in_voucher
              currency = `(${e.balance.value_in_valut} ${e.currency.icon})`
            }

            const wallet = {
              id: e.id,
              name: e.name,
              balance: balance,
              color: e.color,
              currency: currency
            }

            this.wallets.push(wallet)
        });
      }).catch((error) => {
        console.error(error);
      })
    }
  }
};
</script>

<style scoped>
.min-w {
  min-width: 240px;
}

.relative.flex.flex-col.min-w-0.break-words.bg-white.rounded.mb-6.xl\:mb-0.shadow-lg {
  min-height: 115px;
}

#statsWallet a {
  min-width: 240px;
}
</style>