<template>
  <div>
    <HeaderMenu>
      <MenuButton :path="'/app/entry'" :label="$t('labels.add')" />

      <MenuButton :path="'/app/entries'" :label="$t('labels.show')" />

      <MenuButton :path="'/app/search'" :label="$t('labels.search')" />
    </HeaderMenu>
    <div class="mt-10">

      <AverageStats />

      <div class="flex flex-wrap mt-4">
        <CardLine_IncomingExpensesChart />
      </div>

      <div id="bar-chart" class="flex flex-wrap mt-4">
        <WidgetBarChartVue />
      </div>

      <div class="flex flex-wrap mt-4">
        <WidgetTable />
      </div>

      <div class="flex flex-wrap mt-4">
        <CardBudget />
      </div>
    </div>
  </div>
</template>
<script>
import CardLine_IncomingExpensesChart from "@/components/Charts/WidgetLine_IncomingExpensesChart.vue";
import CardBudget from "../../components/Charts/WidgetBudget.vue";
import WidgetTable from "../../components/Charts/WidgetTable.vue";
import WorkspaceService from "../../services/workspace.service";
import AuthService from "../../services/auth.service";
import HeaderMenu from '../../components/Navbars/HeaderMenu.vue';
import MenuButton from '../../components/GenericComponents/MenuButton.vue';
import AverageStats from '../../components/Charts/AverageStats.vue';
import WidgetBarChartVue from '../../components/Charts/WidgetBarChart.vue';
import { useAppSettings } from '../../storage/settings.store';
import { useAuthStore } from "../../storage/auth-token.store";

export default {
  name: "dashboard-page",
  components: {
    CardLine_IncomingExpensesChart,
    WidgetTable,
    CardBudget,
    HeaderMenu,
    MenuButton,
    AverageStats,
    WidgetBarChartVue
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
              appSettings.current_ws = res.workspace
          })
        },
        error => {
          console.error(error);
          LocalStorageService.clear() //FIXME:
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
  }
};
</script>

<style>
@media (max-width: 767px) {
  #bar-chart {
    display: none;
  }
}

@media (min-width: 768px) {
  #bar-chart {
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