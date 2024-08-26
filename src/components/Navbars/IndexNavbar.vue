<template>
  <nav
    class="top-0 fixed z-50 w-full flex flex-wrap items-center justify-between px-2 py-3 navbar-expand-lg bg-white shadow"
  >
    <div
      class="container px-4 mx-auto flex flex-wrap items-center justify-between"
    >
      <div
        class="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start"
      >
        <router-link to="/">
          <a
            class="text-blueGray-700 text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase"
            href="#pablo"
          >
           Budget Control
          </a>
        </router-link>
        <button
          class="cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
          type="button"
          v-on:click="setNavbarOpen"
        >
          <i class="fas fa-bars"></i>
        </button>
      </div>
      <div
        class="lg:flex flex-grow items-center"
        :class="[navbarOpen ? 'block' : 'hidden']"
        id="example-navbar-warning"
      >
        <ul class="flex flex-col lg:flex-row list-none mr-auto">
          <li class="flex items-center">
            <a
              class="hover:text-blueGray-500 text-blueGray-700 px-3 py-2 flex items-center text-xs uppercase font-bold"
              href="https://www.budgetcontrol.cloud/documentation"
            >
              <i
                class="text-blueGray-400 far fa-file-alt text-lg leading-lg mr-2"
              />
              Docs
            </a>
          </li>
        </ul>
        <ul class="flex flex-col lg:flex-row list-none lg:ml-auto">
          <li class="flex items-center" v-if="token">
            <index-dropdown />
          </li>

          <li class="flex items-center" v-if="!token">
            <router-link
              class="hover:text-blueGray-500 text-blueGray-700 px-3 py-2 flex items-center text-xs uppercase font-bold"
              to="/app/auth/login"
            >
              <i
                class="text-blueGray-400 far fa-solid fa-user text-lg leading-lg mr-2"
              />
              Login
            </router-link>
          </li>

          <li class="flex items-center" v-if="!token">
            <router-link
              class="hover:text-blueGray-500 text-blueGray-700 px-3 py-2 flex items-center text-xs uppercase font-bold"
              to="/app/auth/register"
            >
              <i
                class="text-blueGray-400 far fa-solid fa-right-to-bracket text-lg leading-lg mr-2"
              />
              Sign up
            </router-link>
          </li>

          <li class="flex items-center">
            <a
              class="hover:text-blueGray-500 text-blueGray-700 px-3 py-2 flex items-center text-xs uppercase font-bold"
              href="https://www.facebook.com/profile.php?id=61564453328542"
              target="_blank"
            >
              <i class="text-blueGray-400 fab fa-facebook text-lg leading-lg" />
              <span class="lg:hidden inline-block ml-2">Share</span>
            </a>
          </li>

          <li class="flex items-center">
            <a
              class="hover:text-blueGray-500 text-blueGray-700 px-3 py-2 flex items-center text-xs uppercase font-bold"
              href="https://x.com/BudgetControl24"
              target="_blank"
            >
              <i class="text-blueGray-400 fab fa-twitter text-lg leading-lg" />
              <span class="lg:hidden inline-block ml-2">Tweet</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import IndexDropdown from "@/components/Dropdowns/IndexDropdown.vue";
import LocalStorageService from "../../services/LocalStorageService.vue";

export default {
  data() {
    return {
      navbarOpen: false,
      token: null
    };
  },
  mounted() {
    this.token = LocalStorageService.getToken()
  },
  methods: {
    setNavbarOpen: function () {
      this.navbarOpen = !this.navbarOpen;
    },
  },
  components: {
    IndexDropdown,
  },
};
</script>
