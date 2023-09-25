<template>
  <div>
    <navbar />
    <main class="profile-page">
      <section class="relative block h-500-px">
        <div class="absolute top-0 w-full h-full bg-center bg-cover" style="
            background-image: url('https://images.unsplash.com/photo-1499336315816-097655dcfbda?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2710&q=80');
          ">
          <span id="blackOverlay" class="w-full h-full absolute opacity-50 bg-black"></span>
        </div>
        <div class="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden h-70-px"
          style="transform: translateZ(0);">
          <svg class="absolute bottom-0 overflow-hidden" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"
            version="1.1" viewBox="0 0 2560 100" x="0" y="0">
            <polygon class="text-blueGray-200 fill-current" points="2560 0 2560 100 0 100"></polygon>
          </svg>
        </div>
      </section>
      <section class="relative py-16 bg-blueGray-200">
        <div class="container mx-auto px-4">
          <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
            <div class="px-6">
              <div class="flex flex-wrap justify-center">
                <div class="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
                  <div class="relative">
                    <img alt="..." :src="userProfile"
                      class="shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-150-px bg-white" />
                  </div>
                </div>
                <div class="w-full lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-center">
                  <div class="py-6 px-3 mt-32 sm:mt-0">
                    <a href="/app/dashboard"
                      class="bg-emerald-500 active:bg-emerald-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150">
                      Wallet
                    </a>
                    <a href="/app/add_entry"
                      class="bg-emerald-500 active:bg-emerald-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150">
                      Add entry
                    </a>
                  </div>
                </div>
                <div class="w-full lg:w-4/12 px-4 lg:order-1">
                  <div class="flex justify-center py-4 lg:pt-4 pt-8">
                    <div class="mr-4 p-3 text-center">
                      <span class="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                        {{ user.wallet.total }}
                      </span>
                      <span class="text-sm text-blueGray-400">Wallet</span>
                    </div>
                    <div class="mr-4 p-3 text-center">
                      <span class="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                        {{ user.wallet.incoming }}
                      </span>
                      <span class="text-sm text-blueGray-400">Incoming</span>
                    </div>
                    <div class="lg:mr-4 p-3 text-center">
                      <span class="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                        {{ user.wallet.expenses }}
                      </span>
                      <span class="text-sm text-blueGray-400">Expenses</span>
                    </div>
                    <div class="lg:mr-4 p-3 text-center" :class="user.wallet.health_color">
                      <span class="text-xl font-bold block uppercase tracking-wide" >
                        {{ user.wallet.health }}
                      </span>
                      <span class="text-sm">Health</span>
                    </div>
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
                <div class="text-xs text-red-500">
                  <DeleteButton />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
    <footer-component />
  </div>
</template>
<script>
import Navbar from "@/components/Navbars/AuthNavbar.vue";
import FooterComponent from "@/components/Footers/Footer.vue";

import AuthService from '../services/AuthService.vue';
import DeleteButton from "../components/Auth/DeleteButton.vue";

import userProfile from "@/assets/img/flat-business-man-user-profile.jpeg";

export default {
  data() {
    return {
      userProfile,
      user: {
        photo: null,
        suggestion: null,
        name: null,
        email: null,
        wallet: {
          total: 0,
          incoming: 0,
          expenses: 0,
          health: 0,
          health_color: 'text-emerald-600'
        }
      }
    };
  },
  components: {
    Navbar,
    FooterComponent,
    DeleteButton
  },
  async beforeMount() {
    try {
      AuthService.check().catch((response) => {
        console.log("res", response)
        localStorage.clear();
      });
    } catch {
      localStorage.clear();
      this.$router.push({ path: '/' })
    }
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

      if(resp.health <= 0) {
        _this.user.wallet.health_color = 'text-red-500'
      }

    }).catch((err) => {
      this.$router.push({ path: '/' })
      console.error(err)
    })
  }
};
</script>
