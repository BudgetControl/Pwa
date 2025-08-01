<template>
  <div class="container mx-auto px-4 h-full">
    <loading :show="show">
    </loading>
    <div class="flex content-center items-center justify-center h-full ">
      <div class="w-full lg:w-4/12 px-4">
        <div
          class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-slate-200 border-0">
          <div class="rounded-t mb-0 px-6 py-6">
            <div class="text-center mb-3">
              <h6 class="text-slate-500 text-sm font-bold">
                {{ $t('labels.sign_in_with') }}
              </h6>
            </div>
            <div class="btn-wrapper text-center">
              <!-- <button
                class="bg-white active:bg-slate-50 text-slate-700 font-normal px-4 py-2 rounded outline-none focus:outline-none mr-2 mb-1 uppercase shadow hover:shadow-md inline-flex items-center font-bold text-xs ease-linear transition-all duration-150"
                type="button">
                <img alt="..." class="w-5 mr-1" :src="facebook" />
                Facebook
              </button> -->
              <button @click="signInGoogle()"
                class="bg-white active:bg-slate-50 text-slate-700 font-normal px-4 py-2 rounded outline-none focus:outline-none mr-1 mb-1 uppercase shadow hover:shadow-md items-center font-bold text-xs ease-linear transition-all duration-150 w-full text-center"
                type="button">
                <img alt="SignIn with Google" class="w-5 mr-1 inline-flex" :src="google" />
                Google
              </button>
            </div>
            <hr class="mt-6 border-b-1 border-slate-300" />
          </div>
          <div class="flex-auto px-4 lg:px-10 py-10 pt-0">
            <!-- <div class="text-slate-400 text-center mb-3 font-bold">
              <small>{{ $t('labels.or_sign_in_with_credentials') }}</small>
            </div> -->
            <form @submit="submit()" action="javascript:void(0)">

              <div role="alert" v-if="error">
                <div class="bg-red-500 text-white font-bold rounded-t px-4 py-2">
                  {{ $t('labels.could_not_log_in') }}
                </div>
                <div class="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
                  {{ error }} <br />
                  <VerifyEmailButton v-if="verify" :email=this.email class="font-bold"></VerifyEmailButton>
                </div>
              </div>

              <div class="relative w-full mb-3">
                <input type="email" v-model="email"
                  class="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder="Email" />
              </div>

              <div class="relative w-full mb-3">
                <input type="password" v-model="password"
                  class="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder="Password" />
              </div>

              <div class="text-center mt-6">
                <button
                  class="bg-emerald-600 text-white active:bg-emerald-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                  type="submit">
                  {{ $t('labels.sign_in') }}
                </button>
              </div>
            </form>

            <div class="flex flex-wrap mt-6 relative">
              <div class="w-1/2">
                <router-link to="/app/auth/recovery-password">
                  <small>{{ $t('labels.forgot_password') }}</small>
                </router-link>
              </div>
              <div class="w-1/2 text-right">
                <router-link to="/app/auth/register">
                  <small>{{ $t('labels.create_new_account') }}</small>
                </router-link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>


    <div class="flex flex-wrap mt-6 relative radius bg-slate-200 justify-center mt-10 text-xs p-2"
      v-html="$t('text.profile.policy')">
    </div>
  </div>
</template>
<script>

import google from "@/assets/img/google.svg";
import AuthService from "../../services/auth.service";
import loading from 'vue-full-loading'
import VerifyEmailButton from "../../components/Auth/VerifyEmailButton.vue";
import { useAuthStore } from "../../storage/auth-token.store";
import { useAppSettings } from "../../storage/settings.store";

export default {
  setup() {
    const authStore = useAuthStore()
    const appSettings = useAppSettings()

    return {
      authStore,
      appSettings
    }
  },
  components: {
    loading,
    VerifyEmailButton
  },
  data() {
    return {
      google,
      email: '',
      password: '',
      show: false,
      error: null,
      verify: false,
    };
  },
  mounted() {
    // check if user is already logged in
    if (this.authStore.authToken.token != undefined && this.authStore.bcAuthToken.token != undefined) {
      console.debug("Return to dashboard")
      this.$router.push({ path: '/app/dashboard' })
    }
  },
  methods: {
    async submit() {
      let email = this.email;
      let password = this.password;
      const _this = this
      const authService = new AuthService()

      this.show = true
      this.error = false
      await authService.login(email, password).then((response) => {
        const settings = this.appSettings.settings
        //save token in local storage
        this.authStore.authToken = { token: response.token, timestamp: new Date().toISOString()};
        settings.workspaces = response.workspaces
        settings.current_ws = response.workspaces[0]
        this.show = false

        authService.userInfo().then(() => {
          _this.$router.push({ name: 'finalizeAuth' })
        }).catch((error) => {
          console.error(error)
          _this.error = this.$t('messages.generic_error')
          _this.show = false
        })

      }).catch((err) => {
        _this.show = false
        _this.error = this.$t('messages.login.not_valid_password')
        console.error(err)
      })
    },
    async signInGoogle() {
      const _this = this

      this.show = true
      this.error = false

      const authService = new AuthService()
      authService.providerUri('google').then((resp) => {
        window.open(resp.uri, '_self');
      }).catch(() => {
        _this.show = false
        _this.error = this.$t('messages.generic_error')
      })
    }
  }
};
</script>