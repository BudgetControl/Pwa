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
import CardLine_IncomingExpensesChart from "@/components/Cards/Chart/WidgetLine_IncomingExpensesChart.vue";
import CardBudget from "../../components/Cards/Chart/WidgetBudget.vue";
import WorkspaceService from "../../services/WorkspaceService.vue";
import WorkspaceServiceVue from "../../services/WorkspaceService.vue";
import AuthService from "../../services/AuthService.vue";
import HeaderMenu from '../../components/Navbars/HeaderMenu.vue';
import MenuButton from '../../components/GenericComponents/MenuButton.vue';
import LocalStorage from '../..//utils/local-storage'
import AverageStats from "../../components/Charts/AverageStats.vue";
import WidgetBarChartVue from '../../components/Charts/WidgetBarChart.vue';

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
  data() {
    return {
      openTab: 1,
    }
  },
  mounted: async function () {
    const _this = this
    if(LocalStorage.getToken() && LocalStorage.getWorkspaceId()) {
      await AuthService.userInfo().then(
        response => {
          LocalStorage.setUser(response);
        },
        error => {
          console.log(error);
        }
      ).catch((e) => {
        console.error(e)
        _this.$router.push({ path: '/app/auth/login' })
      })
    } else {
      _this.$router.push({ path: '/app/auth/login' })
    }

    const ws = LocalStorage.getUser().workspaces[0]
    WorkspaceService.get(ws.uuid).then((res) => {
      const wsUuid = res.workspace.uuid
      let settings = {
        'workspace': {
          'name': res.workspace.name,
          'uuid': wsUuid
        }
      }
      if(LocalStorage.getWorkspaceId() === null) {
        LocalStorage.setWorkspaceId(wsUuid)
      }

      LocalStorage.set('workspace', settings)
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