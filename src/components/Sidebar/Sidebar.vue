<template>
  <nav
    class="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl bg-white flex flex-wrap items-center justify-between relative md:w-64 z-10 py-4 px-6">
    <div
      class="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
      <!-- Toggler -->
      <button
        class="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
        type="button" v-on:click="toggleCollapseShow('bg-white m-2 py-3 px-6')">
        <i class="fas fa-bars"></i>
      </button>

      <!-- Brand -->
      <label for="workspace">
        <select v-model="workspace" id="workspace" @change="changeWorkspace"
          class="block appearance-none w-full py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
          <option v-for="(w, i) in workspaces" :key="i" :value="w.uuid">{{ w.name }}</option>
        </select>
      </label>

      <!-- User -->
      <ul class="md:hidden items-center flex flex-wrap list-none">
        <li class="inline-block relative">
          <EyeButton />
        </li>
      </ul>
      <!-- Collapse -->
      <div
        class="md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded"
        v-bind:class="collapseShow">

        <!-- Divider -->
        <hr class="my-4 md:min-w-full" />
        <!-- Heading -->
        <!-- Navigation -->

        <ul class="md:flex-col md:min-w-full flex flex-col list-none">
          <li class="items-center" v-on:click="toggleCollapseShow('hidden')">
            <router-link to="/app/dashboard" v-slot="{ href, navigate, isActive }">
              <a :href="href" @click="navigate" class="text-xs uppercase py-3 font-bold block" :class="[
          isActive
            ? 'text-emerald-500 hover:text-emerald-600'
            : 'text-blueGray-700 hover:text-blueGray-500',
        ]">
                <i class="fas fa-columns mr-2 text-sm" :class="[isActive ? 'opacity-75' : 'text-blueGray-300']"></i>
                {{ $t('labels.dashboard') }}
              </a>
            </router-link>
          </li>

        </ul>

        <!-- Divider -->
        <hr class="my-4 md:min-w-full" />

        <ul class="md:flex-col md:min-w-full flex flex-col list-none">

          <li class="items-center" v-on:click="toggleCollapseShow('hidden')">
            <router-link to="/app/entries" v-slot="{ href, navigate, isActive }">
              <a :href="href" @click="navigate" class="text-xs uppercase py-3 font-bold block" :class="[
          isActive
            ? 'text-emerald-500 hover:text-emerald-600'
            : 'text-blueGray-700 hover:text-blueGray-500',
        ]">
                <i class="fas fa-coins mr-2 text-sm" :class="[isActive ? 'opacity-75' : 'text-blueGray-300']"></i>
                {{ $t('labels.my_entries') }}
              </a>
            </router-link>
          </li>

          <li class="items-center" v-on:click="toggleCollapseShow('hidden')">
            <router-link to="/app/payee" v-slot="{ href, navigate, isActive }">
              <a :href="href" @click="navigate" class="text-xs uppercase py-3 font-bold block" :class="[
          isActive
            ? 'text-emerald-500 hover:text-emerald-600'
            : 'text-blueGray-700 hover:text-blueGray-500',
        ]">
                <i class="fas fa-file-invoice mr-2 text-sm" :class="[isActive ? 'opacity-75' : 'text-blueGray-300']"></i>
                {{ $t('labels.payee_list') }}
              </a>
            </router-link>
          </li>

          <li class="items-center" v-on:click="toggleCollapseShow('hidden')">
            <router-link to="/app/planned-entries" v-slot="{ href, navigate, isActive }">
              <a :href="href" @click="navigate" class="text-xs uppercase py-3 font-bold block" :class="[
          isActive
            ? 'text-emerald-500 hover:text-emerald-600'
            : 'text-blueGray-700 hover:text-blueGray-500',
        ]">
                <i class="fas fa-clipboard-check mr-2 text-sm" :class="[isActive ? 'opacity-75' : 'text-blueGray-300']"></i>
                {{ $t('labels.planned') }}
              </a>
            </router-link>
          </li>

          <li class="items-center" v-on:click="toggleCollapseShow('hidden')">
            <router-link to="/app/budgets" v-slot="{ href, navigate, isActive }">
              <a :href="href" @click="navigate" class="text-xs uppercase py-3 font-bold block" :class="[
          isActive
            ? 'text-emerald-500 hover:text-emerald-600'
            : 'text-blueGray-700 hover:text-blueGray-500',
        ]">
                <i class="fas fa-clinic-medical mr-2 text-sm" :class="[isActive ? 'opacity-75' : 'text-blueGray-300']"></i>
                {{ $t('labels.budgets') }}
              </a>
            </router-link>
          </li>

          <li class="items-center" v-on:click="toggleCollapseShow('hidden')">
            <router-link to="/app/stats" v-slot="{ href, navigate, isActive }">
              <a :href="href" @click="navigate" class="text-xs uppercase py-3 font-bold block" :class="[
          isActive
            ? 'text-emerald-500 hover:text-emerald-600'
            : 'text-blueGray-700 hover:text-blueGray-500',
        ]">
                <i class="fas fa-search mr-2 text-sm" :class="[isActive ? 'opacity-75' : 'text-blueGray-300']"></i>
                {{ $t('labels.stats') }}
              </a>
            </router-link>
          </li>

        </ul>

        <!-- Divider -->
        <hr class="my-4 md:min-w-full" />

        <ul class="md:flex-col md:min-w-full flex flex-col list-none">

          <li class="items-center" v-on:click="toggleCollapseShow('hidden')">
            <router-link to="/app/settings" v-slot="{ href, navigate, isActive }">
              <a :href="href" @click="navigate" class="text-xs uppercase py-3 font-bold block" :class="[
          isActive
            ? 'text-emerald-500 hover:text-emerald-600'
            : 'text-blueGray-700 hover:text-blueGray-500',
        ]">
                <i class="fas fa-tools mr-2 text-sm" :class="[isActive ? 'opacity-75' : 'text-blueGray-300']"></i>
                {{ $t('labels.settings') }}
              </a>
            </router-link>
          </li>
        </ul>

        <!-- Divider -->
        <hr class="my-4 md:min-w-full" />
        <!-- Heading -->

        <ul class="md:flex-col md:min-w-full flex flex-col list-none md:mb-4">
          <li class="items-center">
            <i class="fas fa-sign-out-alt text-blueGray-300 mr-2 text-sm"></i>
            <LogoutButton class="px-2 text-xs font-bold uppercase "></LogoutButton>
          </li>
        </ul>

        <!-- Divider -->
        <hr class="my-4 md:min-w-full" />
        <!-- Heading -->

      </div>
    </div>
  </nav>
</template>

<script>
import LogoutButton from "../Auth/LogoutButton.vue";
import WorkspaceService from "../../services/WorkspaceService.vue";
import LocalStorageServiceVue from '../../services/LocalStorageService.vue';
import AuthService from '../../services/AuthService.vue';
import EyeButton from "@/components/GenericComponents/EyeButton.vue";

export default {
  data() {
    return {
      workspace: null,
      collapseShow: "hidden",
      workspaces: []
    };
  },
  mounted() {
    this.workspaceList()
  },
  methods: {
    toggleCollapseShow: function (classes) {
      this.collapseShow = classes;
    },
    workspaceList: function () {
      const _this = this
      WorkspaceService.list().then((response) => {
        response.forEach((e) => {
          _this.workspaces.push(e)
        })
        _this.workspace = LocalStorageServiceVue.getWorkspaceId()
      })
    },
    changeWorkspace() {
      const _this = this
      LocalStorageServiceVue.setWorkspaceId(_this.workspace)
      AuthService.userInfo().then(() => {
        _this.$router.go(0);
      }).catch(() => {
        _this.$router.push({path : '/app/auth/login'});
      })
    }
  },
  components: {
    EyeButton,
    LogoutButton,
  },
};
</script>
