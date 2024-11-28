<template>
  <div class="container mx-auto px-4 h-full">
    <loading :show="show">
    </loading>
    <div class="flex content-center items-center justify-center h-full">
      <div class="w-full lg:w-6/12 px-4">
        <div
          class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-slate-200 border-0">
          <div class="rounded-t mb-0 px-6 py-6">
            <div class="text-center mb-3">
            </div>
            <hr class="mt-6 border-b-1 border-slate-300" />
          </div>
          <div class="flex-auto px-4 lg:px-10 py-10 pt-0">
            <div class="text-slate-400 text-center mb-3 font-bold">
              <form action="javascript:void(0)">

                <div role="alert" v-if="error">
                  <div class="bg-red-500 text-white font-bold rounded-t px-4 py-2">
                    {{ $t('labels.generic_error') }}
                  </div>
                  <div class="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
                    {{ error_message }}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import loading from 'vue-full-loading'
import { useAppSettings } from '../../storage/settings.store';
import AuthService from "../../services/auth.service";

import { useAuthStore } from '../../storage/auth-token.store';


export default {
  components: {
    loading
  },
  setup() {
    
    const appSettings = useAppSettings()
    const authStore = useAuthStore()

    return {
      appSettings, authStore
    }
  },
  data() {
    return {
      show: false,
      error: false,
      error_message: this.$t('labels.generic_error')
    };
  },
  async mounted() {
    const _this = this
    const token = _this.$route.query.code
    console.debug("Auth Code: ", token)
    const authService = new AuthService(this.header)

    this.show = false
    this.error = false

    authService.token({
      code: token,
      name: 'google'
    }).then((response) => {
      const settings = this.appSettings.settings
      this.authStore.authToken = { token: response.token, timestamp: new Date().toISOString()};
      
      settings.workspaces = response.workspaces
      settings.current_ws = response.workspaces[0]

      authService.userInfo().then(() => {
          _this.$router.push({ path: '/app/dashboard' })
        }).catch((error) => {
          console.error(error)
          _this.error = this.$t('messages.generic_error')
          _this.show = false
        })
    }).catch((err) => {
        _this.show = false
        _this.error = this.$t('messages.generic_error')
        console.error(err)
      })
    }
};
</script>
