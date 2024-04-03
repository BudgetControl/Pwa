<template>
  <div class="container mx-auto px-4 h-full">
    <loading :show="show">
    </loading>
    <div class="flex content-center items-center justify-center h-full">
      <div class="w-full lg:w-6/12 px-4">
        <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
          <div class="rounded-t mb-0 px-6 py-6">
            <div class="text-center mb-3">
            </div>
            <hr class="mt-6 border-b-1 border-blueGray-300" />
          </div>
          <div class="flex-auto px-4 lg:px-10 py-10 pt-0">
            <div class="text-blueGray-400 text-center mb-3 font-bold">
              <form  action="javascript:void(0)">

                <div role="alert" v-if="error">
                  <div class="bg-red-500 text-white font-bold rounded-t px-4 py-2">
                    Oops... an error occurred
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
import AuthService from "../../services/AuthService.vue";
import loading from 'vue-full-loading'
import LocalStorageService from "../../services/LocalStorageService.vue";


export default {
  components: {
    loading
  },
  data() {
    return {
      show: false,
      error: false,
      error_message: 'Ops an error occurred, try later'
    };
  },
    async mounted() {
      const code = window.location.href.split('code=')[1]
      const _this = this

      this.show = false
      this.error = false

      AuthService.token(code).then((response) => {
        LocalStorageService.setToken(response.access_token);
        AuthService.userInfo().then(() => {
          _this.$router.push({ path: '/app/dashboard' })
        })
      }).catch((err) => {
        _this.show = false
        _this.error = true
        _this.message = false

        _this.error_message = err.response.data.error

        console.debug(err)
      })
    }
};
</script>
