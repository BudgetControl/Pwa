<template>
  <div class="container mx-auto px-4 h-full">
    <loading :show="show">
    </loading>
    <div class="flex content-center items-center justify-center h-full">
      <div class="w-full lg:w-4/12 px-4">
        <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
          <div class="rounded-t mb-0 px-6 py-6">
            <div class="text-center mb-3">
              <h6 class="text-blueGray-500 text-sm font-bold">
                Sign in with
              </h6>
            </div>
            <div class="btn-wrapper text-center">
              <!-- <button
                class="bg-white active:bg-blueGray-50 text-blueGray-700 font-normal px-4 py-2 rounded outline-none focus:outline-none mr-2 mb-1 uppercase shadow hover:shadow-md inline-flex items-center font-bold text-xs ease-linear transition-all duration-150"
                type="button">
                <img alt="..." class="w-5 mr-1" :src="facebook" />
                Facebook
              </button> -->
              <button @click="signInGoogle()"
                class="bg-white active:bg-blueGray-50 text-blueGray-700 font-normal px-4 py-2 rounded outline-none focus:outline-none mr-1 mb-1 uppercase shadow hover:shadow-md inline-flex items-center font-bold text-xs ease-linear transition-all duration-150"
                type="button">
                <img alt="SignIn with Google" class="w-5 mr-1" :src="google" />
                Google
              </button>
            </div>
            <hr class="mt-6 border-b-1 border-blueGray-300" />
          </div>
          <div class="flex-auto px-4 lg:px-10 py-10 pt-0">
            <div class="text-blueGray-400 text-center mb-3 font-bold">
              <small>Or sign in with credentials</small>
            </div>
            <form @submit="submit()" action="javascript:void(0)">

              <div role="alert" v-if="error">
                <div class="bg-red-500 text-white font-bold rounded-t px-4 py-2">
                  Could not log in
                </div>
                <div class="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
                  {{ error }} <br />
                  <VerifyEmailButton v-if="verify" :email=this.email class="font-bold"></VerifyEmailButton>
                </div>
              </div>

              <div class="relative w-full mb-3">
                <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                  Email
                </label>
                <input type="email" v-model="email"
                  class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder="Email" />
              </div>

              <div class="relative w-full mb-3">
                <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                  Password
                </label>
                <input type="password" v-model="password"
                  class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder="Password" />
              </div>
              <div class="text-blueGray-400 mb-3 font-bold">
                <small>Lost your passowrd ? <router-link to="/app/auth/recovery-password">recovery
                    here</router-link></small>
              </div>

              <div class="text-center mt-6">
                <button
                  class="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                  type="submit">
                  Sign In
                </button>
              </div>
            </form>
          </div>
        </div>
        <div class="flex flex-wrap mt-6 relative">
          <div class="w-1/2">
            <router-link to="/app/auth/recovery-password" class="text-blueGray-200">
              <small>Forgot password?</small>
            </router-link>
          </div>
          <div class="w-1/2 text-right">
            <router-link to="/app/auth/register" class="text-blueGray-200">
              <small>Create new account</small>
            </router-link>
          </div>
        </div>
      </div>
    </div>


    <div class="flex flex-wrap mt-6 relative text-blueGray-200 justify-center mt-10 text-xs">
      <p>Registrandoti o connettendoti con uno dei suddetti servizi,
        acconsenti ai nostri <a class="font-bold text-decoration-line"
          href="https://www.budgetcontrol.cloud/terms-of-service/">Termini di Servizio</a> e
        riconosci la nostra <a class="font-bold text-decoration-line"
          href="https://www.budgetcontrol.cloud/security-policy/">Informativa sulla Privacy</a>,
        che descrive come gestiamo i tuoi dati personali.</p>
    </div>
  </div>
</template>
<script>
//import facebook from "@/assets/img/github.svg";
import google from "@/assets/img/google.svg";
import AuthService from "../../services/AuthService.vue";
import loading from 'vue-full-loading'
import VerifyEmailButton from "../../components/Auth/VerifyEmailButton.vue";
import LocalStorageService from "../../services/LocalStorageService.vue";

export default {
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
  methods: {
    async submit() {
      let email = this.email;
      let password = this.password;
      const _this = this

      this.show = true
      this.error = false

      AuthService.login(email, password).then((response) => {
        //save token in local storage
        LocalStorageService.setToken(response.access_token);

        AuthService.userInfo().then(() => {
          _this.$router.push({ path: '/app/dashboard' })
        })

      }).catch((err) => {
        _this.show = false

        console.debug(err.response.data)

        switch (err.response.data.code) {
          case 'EML_NaN':
            _this.error = `You haven't verified your email yet. If you haven't received it, click here to resend.`
            _this.verify = true
            break;
          default:
            _this.error = `The credentials you entered are not valid.`
            break;
        }

      })
    },
    async signInGoogle() {
      const _this = this

      this.show = true
      this.error = false

      AuthService.providerUri('google').then((resp) => {
        window.location.href = resp.uri
      }).catch(() => {
        _this.show = false
        _this.error = `Sorry an error occurred, try later`
      })
    }
  }
};
</script>
