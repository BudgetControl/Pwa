<template>
  <section class="relative py-16 bg-slate-200">
    <div class="container mx-auto px-4">
      <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg">
        <div class="px-6">
          <div class="flex flex-wrap justify-center">

            <div class="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
              <div class="relative">
                  <Avatar class="mt-10" :name="user.name" variant="beam" size="120"/>
              </div>
            </div>
          </div>

          <div class="text-center mt-12 flex flex-wrap justify-center">
            <div class="px-4 flex">
              <a href="/app/dashboard"
                class="bg-emerald-500 active:bg-emerald-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150">
                {{ $t('labels.dashboard') }}
              </a>
            </div>
            <div class="px-4 flex">
              <a href="/app/settings"
                class="bg-emerald-500 active:bg-emerald-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150">
                {{ $t('labels.settings') }}
              </a>
            </div>
            <div class="px-4 flex">
              <a href="/app/entry"
                class="bg-emerald-500 active:bg-emerald-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-2 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150">
                {{ $t('labels.add_new_entry') }}
              </a>
            </div>

            <div class="px-4 flex">
              <a href="/app/entries"
                class="bg-emerald-500 active:bg-emerald-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150">
                {{ $t('labels.my_entries') }}
              </a>
            </div>

          </div>

          <div class="text-center mt-12">
            <div class="text-center mt-12 flex flex-wrap justify-center">
              <div class="mr-4 p-3 text-center">
                <span class="text-xl font-bold block uppercase tracking-wide " :class="user.wallet.total_color">
                  {{ user.wallet.total }} {{ this.currency }}
                </span>
                <span class="text-sm text-slate-400">Wallet</span>
              </div>
              <div class="mr-4 p-3 text-center">
                <span class="text-xl font-bold block uppercase tracking-wide text-emerald-600">
                  {{ user.wallet.incoming }} {{ this.currency }}
                </span>
                <span class="text-sm text-slate-400">{{ $t('labels.incoming') }}</span>
              </div>
              <div class="mr-4 p-3 text-center text-red-500">
                <span class="text-xl font-bold block uppercase tracking-wide">
                  {{ user.wallet.expenses }} {{ this.currency }}
                </span>
                <span class="text-sm text-slate-400">{{ $t('labels.expenses') }}</span>
              </div>
              <div class="mr-4 p-3 text-center text-center">
                <span class="text-xl font-bold block uppercase tracking-wide " :class="user.wallet.health_color">
                  {{ user.wallet.health }} {{ this.currency }}
                </span>
                <span class="text-sm text-slate-400">{{ $t('labels.my_health') }}</span>
              </div>
            </div>
          </div>

          <div class="text-center mt-12">
            <h3 class="text-4xl font-semibold leading-normal mb-2 text-slate-700 mb-2">
              {{ user.name }}
            </h3>
            <div class="text-sm leading-normal mt-0 mb-2 text-slate-400 font-bold uppercase">
              <i class="fas fa-envelope mr-2 text-lg text-slate-400"></i>
              {{ user.email }}
            </div>
          </div>


          <div class="mt-10 py-10 border-t border-slate-200 text-center">
            <div class="flex flex-wrap justify-center">
              <div class="w-full lg:w-9/12 px-4">
                <p class="mb-4 text-lg leading-relaxed text-slate-700">
                  {{ user.suggestions }}
                </p>
                <a href="javascript:void(0)" class="font-normal text-emerald-500" v-if="user.suggestions">
                  {{ $t('labels.show_more') }}
                </a>
              </div>
            </div>
            <div class="text-xs text-red-500">
              <DeleteButton />
            </div>

            <div class="flex flex-wrap mt-6 relative justify-center mt-10 text-xs" v-html="$t('text.profile.policy')">

            </div>

          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>

import DeleteButton from "../../components/Auth/DeleteButton.vue";
import { useAppSettings } from '../../storage/settings.store';
import Avatar from "vue-boring-avatars";
import AuthService from "../../services/auth.service";

import StatsService from '../../services/stats.service';
import CoreService from "../../services/core.service";

export default {
  data() {
    return {
      user: {
        currency: '$',
        photo: null,
        suggestion: null,
        name: "",
        email: null,
        wallet: {
          total: 0,
          incoming: 0,
          expenses: 0,
          health: 0,
          health_color: 'text-emerald-600',
          total_color: 'text-emerald-600'
        }
      }
    };
  },
  components: {
    DeleteButton, Avatar
  },
  setup() {
    const appSettings = useAppSettings()
    const settings = {
      currency_id: appSettings.get().currency_id,
      user: appSettings.getUser()
    }

    return {
      appSettings, settings
    }
  },
  async beforeMount() {

    const coreService = new CoreService()
    coreService.currencies().then((resp) => {
      this.currency_id = resp[this.currency_id - 1].icon
    }).catch(() => {
      this.currency = "€"
    })
  },
  async mounted() {

    const userInfo = this.user

      this.user.name = userInfo.name
      this.user.email = userInfo.email

      
      const statsService = new StatsService()
      statsService.health().then(resp => {
        this.user.wallet.health = resp.total.toFixed(2)
        if (this.user.wallet.health <= 0) {
          this.user.wallet.health_color = 'text-red-500'
        }
      })

      statsService.total().then(resp => {
        this.user.wallet.total = resp.total.toFixed(2)
        if (this.user.wallet.total <= 0) {
          this.user.wallet.total_color = 'text-red-500'
        }
      })

      const date_time = new Date()
      const start_date = date_time.getFullYear() + '-' + (date_time.getMonth() + 1) + '-01'
      const end_date = date_time.getFullYear() + '-' + (date_time.getMonth() + 1) + '-' + date_time.getDate()

      statsService.incoming(`?start_date=${start_date}&end_date=${end_date}`).then((resp) => {
        this.user.wallet.incoming = resp.total.toFixed(2)
      })

      statsService.expenses().then(resp => {
        this.user.wallet.expenses = resp.total.toFixed(2)
      })

  },
};
</script>
