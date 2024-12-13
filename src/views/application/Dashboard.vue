<template>
  <div>
    <HeaderMenu>
      <MenuButton :path="'/app/entry'" :label="$t('labels.add')" />

      <MenuButton :path="'/app/entries'" :label="$t('labels.show')" />

      <MenuButton :path="'/app/search'" :label="$t('labels.search')" />
    </HeaderMenu>
    <div class="mt-10">

      <div v-if="isMobile">
        <DashboardMobile />
      </div>

      <div v-if="!isMobile">
        <DashboardDesktop />
      </div>

    </div>
  </div>
</template>
<script>
import WorkspaceService from "../../services/workspace.service";
import AuthService from "../../services/auth.service";
import HeaderMenu from '../../components/Navbars/HeaderMenu.vue';
import MenuButton from '../../components/GenericComponents/MenuButton.vue';
import { useAppSettings } from '../../storage/settings.store';
import { useAuthStore } from "../../storage/auth-token.store";
import DashboardDesktop from "./dashboards/DashboardDesktop.vue";
import DashboardMobile from "./dashboards/DashboardMobile.vue";

export default {
  name: "dashboard-page",
  components: {
    HeaderMenu,
    MenuButton,
    DashboardDesktop,
    DashboardMobile
  },
  setup() {
    const settingsStore = useAppSettings()
    const authStore = useAuthStore()

    return {
      settingsStore, authStore
    }
  },
  data() {
    return {
      openTab: 1,
      isMobile: process.env.VUE_APP_MOBILE === 'true',
    }
  },
  mounted: async function () {
    const _this = this
    const authService = new AuthService()
    const tokens = this.authStore.get()
    const appSettings = this.settingsStore.get()

    if (tokens.authToken.token && appSettings.current_ws) {
      await authService.userInfo().then(
        response => {
          appSettings.user = response.userInfo

          const ws = response.userInfo.workspaces[0].uuid
          const workspaceService = new WorkspaceService()
          workspaceService.get(ws).then((res) => {
            appSettings.workspaces.push(res.workspace)
          })
        },
        error => {
          console.error(error);
          this.settingsStore.resetState()
          this.authStore.resetState()
          _this.$router.push({ path: '/app/auth/login' })
        }


      ).catch((e) => {
        console.error(e)
        _this.$router.push({ path: '/app/auth/login' })
      })
    } else {
      console.debug("NOT LOGGED")
      _this.$router.push({ path: '/app/auth/login' })
    }

  },
  methods: {
    toggleTabs: function (tabNumber) {
      this.openTab = tabNumber
    },
  },

};
</script>

<style>
@media (max-width: 767px) {

  #bar-chart,
  #table-chart {
    display: none;
  }
}

@media (min-width: 768px) {

  #bar-chart,
  #table-chart {
    display: block;
  }

  #widget .flex-wrap {
    flex-wrap: nowrap;
  }

  #widget .w-full {
    width: 25%;
  }
}
</style>