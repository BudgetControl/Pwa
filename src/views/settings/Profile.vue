<template>
  <section class="relative py-16 bg-blueGray-200">
    <div class="container mx-auto px-4">
      <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg">
        <div class="px-6">
          <div class="flex flex-wrap justify-center">

            <div class="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
              <div class="relative">
                <img alt="..." :src="userProfile"
                  class="shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-150-px bg-white" />
              </div>
            </div>
          </div>

          <div class="text-center mt-12 mt-32 flex flex-wrap justify-center">
              <div class="px-4 flex-1 mb-5">
                <a href="/app/dashboard"
                  class="bg-emerald-500 active:bg-emerald-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150">
                  Dashboard
                </a>
              </div>
              <div class="px-4 flex-1 mb-5">
                <a href="/app/settings"
                  class="bg-emerald-500 active:bg-emerald-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150">
                  Settings
                </a>
              </div>
              <div class="px-4 flex-1 mb-5">
                <a href="/app/entry"
                  class="bg-emerald-500 active:bg-emerald-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-2 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150">
                  Add new entry
                </a>
              </div>

              <div class="px-4 flex-1 mb-5">
                <a href="/app/entries"
                  class="bg-emerald-500 active:bg-emerald-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150">
                  My entries
                </a>
              </div>

          </div>

          <div class="text-center mt-12">
            <div class="flex justify-center flex-wrap py-4 lg:pt-4 pt-8">
              <div class="mr-4 p-3 text-center">
                <span class="text-xl font-bold block uppercase tracking-wide " :class="user.wallet.total_color">
                  {{ user.wallet.total }} {{ this.currency }}
                </span>
                <span class="text-sm text-blueGray-400">Wallet</span>
              </div>
              <div class="mr-4 p-3 text-center">
                <span class="text-xl font-bold block uppercase tracking-wide text-emerald-600">
                  {{ user.wallet.incoming }} {{ this.currency }}
                </span>
                <span class="text-sm text-blueGray-400">Incoming</span>
              </div>
              <div class="lg:mr-4 p-3 text-center text-red-500">
                <span class="text-xl font-bold block uppercase tracking-wide">
                  {{ user.wallet.expenses }} {{ this.currency }}
                </span>
                <span class="text-sm text-blueGray-400">Expenses</span>
              </div>
              <div class="lg:mr-4 p-3 text-center">
                <span class="text-xl font-bold block uppercase tracking-wide " :class="user.wallet.health_color">
                  {{ user.wallet.health }} {{ this.currency }}
                </span>
                <span class="text-sm">Health</span>
              </div>
            </div>
          </div>

          <div class="text-center mt-12">
            <h3 class="text-4xl font-semibold leading-normal mb-2 text-blueGray-700 mb-2">
              {{ user.name }}
            </h3>
            <div class="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase">
              <i class="fas fa-envelope mr-2 text-lg text-blueGray-400"></i>
              {{ user.email }}
            </div>
          </div>


          <div class="mt-10 py-10 border-t border-blueGray-200 text-center">
            <div class="flex flex-wrap justify-center">
              <div class="w-full lg:w-9/12 px-4">
                <p class="mb-4 text-lg leading-relaxed text-blueGray-700">
                  {{ user.suggestions }}
                </p>
                <a href="javascript:void(0)" class="font-normal text-emerald-500" v-if="user.suggestions">
                  Show more
                </a>
              </div>
            </div>
            <div class="text-xs text-red-500 mb-2">
              <DeleteSoftButtonVue />
            </div>
            <div class="text-xs text-red-500">
              <DeleteButton />
            </div>

            <div class="flex flex-wrap mt-6 relative justify-center mt-10 text-xs">
              <p>Registrandoti o connettendoti con uno dei suddetti servizi,
                acconsenti ai nostri <a class="font-bold text-decoration-line"
                  href="https://www.budgetcontrol.cloud/terms-of-service/">Termini di Servizio</a> e
                riconosci la nostra <a class="font-bold text-decoration-line"
                  href="https://www.budgetcontrol.cloud/security-policy/">Informativa sulla Privacy</a>,
                che descrive come gestiamo i tuoi dati personali.</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>

import AuthService from "@/services/AuthService.vue";
import DeleteButton from "../../components/Auth/DeleteButton.vue";
import userProfile from "@/assets/img/flat-business-man-user-profile.jpeg";
import DeleteSoftButtonVue from '../../components/Auth/DeleteSoftButton.vue';
import LocalStorageService from "../../services/LocalStorageService.vue";

export default {
  data() {
    return {
      userProfile,
      user: {
        currency: '$',
        photo: null,
        suggestion: null,
        name: null,
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
    DeleteButton, DeleteSoftButtonVue
  },
  async beforeMount() {
    const storage = LocalStorageService.get('user_settings')
    this.currency = storage.currency.icon
  },
  async mounted() {
    const _this = this
    AuthService.profile().then((resp) => {
      resp = resp.data
      _this.user.name = resp.name
      _this.user.email = resp.decrypted_email
      _this.user.wallet.total = resp.total
      _this.user.wallet.incoming = resp.incoming.total
      _this.user.wallet.expenses = resp.expenses.total
      _this.user.wallet.health = resp.health

      if (resp.health <= 0) {
        _this.user.wallet.health_color = 'text-red-500'
      }

      if (resp.total <= 0) {
        _this.user.wallet.total_color = 'text-red-500'
      }

    }).catch((err) => {
      this.$router.push({ path: '/' })
      console.error(err)
    })
  }
};
</script>
