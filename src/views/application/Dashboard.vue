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
import WorkspaceService from "../../services/workspace.service";
import AuthService from "../../services/auth.service";
import HeaderMenu from '../../components/Navbars/HeaderMenu.vue';
import MenuButton from '../../components/GenericComponents/MenuButton.vue';
import LocalStorage from '../..//utils/local-storage'

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
    const settings = settingsStore.get()

    return {
      settings
    }
  },
  data() {
    return {
      openTab: 1,
    }
  },
  mounted: async function () {
    const _this = this
    const tokens = getHeaderTokens()
    const authService = new AuthService(tokens)

    if(tokens.auth.token && tokens.workspace.uuid) {
      await authService.userInfo().then(
        response => {
          this.settings.user = response
        },
        error => {
          console.error(error);
          LocalStorageService.clear()
          _this.$router.push({ path: '/app/auth/login' })
        }
      ).catch((e) => {
        console.debug(e)
        _this.$router.push({ path: '/app/auth/login' })
      })
    } else {
      _this.$router.push({ path: '/app/auth/login' })
    }

    const ws = tokens.workspace.uuid
    const headers = getHeaderTokens()
    const workspaceService = new WorkspaceService(headers)
    workspaceService.get(ws).then((res) => {
      const wsUuid = res.workspace.uuid
      let settings = {
        'workspace': {
          'name': res.workspace.name,
          'uuid': wsUuid
        }
      }
      if(tokens.workspace.uuid == {}) {
        tokens.workspace = res.workspace
      }

      WorkspaceServiceVue.activeWorkspace(wsUuid)
    })
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