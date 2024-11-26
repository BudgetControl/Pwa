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
                {{ $t('labels.recovery_your_password') }}
              </h6>
            </div>
            <hr class="mt-6 border-b-1 border-blueGray-300" />
          </div>
          <div class="flex-auto px-4 lg:px-10 py-10 pt-0">
            <div class="text-blueGray-400 text-center mb-3 font-bold">
              <form @submit="submit" action="javascript:void(0)">

                <div role="alert" v-if="error">
                  <div class="bg-red-500 text-white font-bold rounded-t px-4 py-2">
                    {{ $t('labels.generic_error') }}
                  </div>
                </div>

                <div v-if="message" class="text-center text-white px-6 py-4 border-0 rounded relative mb-4 bg-emerald-500">
                  <span class="text-xl inline-block mr-5">
                    <i class="fas fa-bell"></i>
                  </span>
                  <span class="inline-block mr-8">
                    {{ $t('labels.we_have_sent_you_an_email') }}
                  </span>
                </div>

                <div class="relative w-full mb-3">
                  <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                    {{ $t('labels.email') }}
                  </label>
                  <input v-model="email" type="email"
                    class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    placeholder="Email" required />
                </div>

                <div class="text-center mt-6">
                  <button
                    class="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                    type="submit">
                    {{ $t('labels.send_my_password') }}
                  </button>
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
import AuthService from "../../services/auth.service";
import loading from 'vue-full-loading'


export default {
  components: {
    loading
  },
  data() {
    return {
      show: false,
      error: false,
      message: false,
      error_message: null
    };
  },
  methods: {
    async submit() {
      let email = this.email;
      const _this = this
      const authService = new AuthService()

      this.show = false
      this.error = false
      authService.recoveryPassword(email).then(() => {
        _this.message = true
      }).catch((err) => {
        _this.show = false
        _this.error = true
        _this.message = false
        _this.error_message = err.response.data.error
      })
    }
  }
};
</script>
