<template>
  <div class="container mx-auto px-4 h-full">
    <loading :show="show">
    </loading>
    <div class="flex content-center items-center justify-center h-full">
      <div class="w-full lg:w-6/12 px-4">
        <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
          <div class="rounded-t mb-0 px-6 py-6">
            <div class="text-center mb-3">
              <h6 class="text-blueGray-500 text-sm font-bold">
                {{ $t('labels.sign_up_with') }}
              </h6>
            </div>
            <hr class="mt-6 border-b-1 border-blueGray-300" />
          </div>
          <div class="flex-auto px-4 lg:px-10 py-10 pt-0">
            <div class="text-blueGray-400 text-center mb-3 font-bold">
              <small>{{ $t('labels.or_sign_in_with_credentials') }} </small>
            </div>
            <form @submit="submit" action="javascript:void(0)">

              <div role="alert" v-if="error">
                <div class="bg-red-500 text-white font-bold rounded-t px-4 py-2">
                  {{ $t('labels.generic_error') }}
                </div>
                <div class="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
                  {{ error }}
                </div>
              </div>
              <div class="relative w-full mb-3">
                <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                  {{ $t('labels.name') }}
                </label>
                <input v-model="name" type="text"
                  class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder="Name" />
              </div>

              <div class="relative w-full mb-3">
                <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                  {{ $t('labels.email') }}
                </label>
                <input v-model="email" type="email"
                  class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder="Email" />
              </div>

              <div class="relative w-full mb-3">
                <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                  {{ $t('labels.password') }}
                </label>
                <input v-model="password" type="password"
                  class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder="Password" />
              </div>


              <div class="relative w-full mb-3">
                  <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                    {{ $t('labels.confirm_password') }}
                  </label>
                  <input v-model="confirm_password" type="password"
                    class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    placeholder="Confirm Password" />
                    <PasswordStrengthMeter :password="password" ref="passwordStreight" />
                </div>

              <div>
                <label class="inline-flex items-center cursor-pointer">
                  <input id="customCheckLogin" type="checkbox"
                    class="form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150" />
                  <span class="ml-2 text-sm font-semibold text-blueGray-600">
                    {{ $t('labels.i_agree_with_the') }}
                    <a href="javascript:void(0)" class="text-emerald-500">
                      {{ $t('labels.privacy_policy') }}
                    </a>
                  </span>
                </label>
              </div>

              <div class="text-center mt-6">
                <button
                  class="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                  type="submit">
                  {{ $t('labels.create_account') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import AuthService from "../../services/AuthService.vue";
import loading from 'vue-full-loading'
import PasswordStrengthMeter from "../../components/Auth/PasswordStrengthMeter.vue";
import WorkspaceServiceVue from '../../services/WorkspaceService.vue';

export default {
  components: {
    loading,
    PasswordStrengthMeter
  },
  data() {
    return {
      show: false,
      error: false,
      password: null,
      confirm_password: null
    };
  },
  methods: {
    async submit() {
      let email = this.email;
      let password = this.password;
      let name = this.name;
      const confirm_password = this.confirm_password
      const _this = this

      this.show = true
      this.error = false
      AuthService.register(name, password,confirm_password, email).then(() => {
        //redirecto to dashboard
        WorkspaceServiceVue.add('ws_'.name.replace(" ","-"))
        _this.$router.push({ path: '/app/auth/login?signin=1' })
      }).catch((err) => {
        const response = err.response.data
        _this.show = false
        _this.error = response.error
      })
    }
  }
};
</script>
