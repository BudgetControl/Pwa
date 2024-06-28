<template>
  <div>
    <HeaderMenu>
        <MenuButton
          :path="'/app/entry'"
          :label="$t('labels.add')"
        />

        <MenuButton
          :path="'/app/entries'"
          :label="$t('labels.show')"
        />

        <MenuButton
          :path="'/app/search'"
          :label="$t('labels.search')"
        />
    </HeaderMenu>
  <div class="mt-10">
    <div class="py-5">
      <FilterBar />
    </div>
    <div class="flex flex-wrap">
      <div class="w-full">
        <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
          <div class="px-4 py-5 flex-auto">
            <CardLine_IncomingExpensesChart />
          </div>
        </div>
      </div>
      <div class="w-full xl:w-8/12 px-4">
        <card-bar-chart path="category" :title="$t('labels.category')" ID_GRAPH="category_all" />
      </div>
      <div class="w-full xl:w-4/12 px-4">
        <CardPieLabelChart ID_GRAPH="label" />
      </div>
    </div>
    <div class="flex flex-wrap mt-4">
      <CardCategoryResume />
    </div>

    <div class="flex flex-wrap mt-4">
      <CardBudget />
    </div>
  </div>
</div>
</template>
<script>
import FilterBar from "@/components/Navbars/FilterBar.vue";
import CardBarChart from "@/components/Cards/Chart/WidgetBarChart.vue";
import CardLine_IncomingExpensesChart from "@/components/Cards/Chart/WidgetLine_IncomingExpensesChart.vue";
import CardPieLabelChart from "../../components/Cards/Chart/WidgetPieLabelChart.vue";
import CardCategoryResume from "../../components/Cards/Chart/WidgetCategoryResume.vue";
import LocalStorageService from "../../services/LocalStorageService.vue";
import CardBudget from "../../components/Cards/Chart/WidgetBudget.vue";
import WorkspaceService from "../../services/WorkspaceService.vue";
import WorkspaceServiceVue from "../../services/WorkspaceService.vue";
import AuthService from "../../services/AuthService.vue";
import HeaderMenu from '../../components/Navbars/HeaderMenu.vue';
import MenuButton from '../../components/GenericComponents/MenuButton.vue';

export default {
  name: "dashboard-page",
  components: {
    FilterBar,
    CardBarChart,
    CardLine_IncomingExpensesChart,
    CardPieLabelChart,
    CardCategoryResume,
    CardBudget,
    HeaderMenu,
    MenuButton
  },
  data() {
    return {
      openTab: 1
    }
  },
  mounted: async function () {
    const _this = this
    if(LocalStorageService.getToken() && LocalStorageService.getWorkspaceId()) {
      await AuthService.userInfo().then(
        response => {
          LocalStorageService.setUser(response.userInfo);
        },
        error => {
          console.log(error);
        }
      ).catch((e) => {
        console.error(e)
        _this.$router.push({ path: '/app/auth/login' })
      )
      })
    } else {
      // redirect to login
      _this.$router.push({ path: '/app/auth/login' })
    }

    const ws = LocalStorageService.getUser().workspaces[0]
    WorkspaceService.get(ws.uuid).then((res) => {
      const wsUuid = res.workspace.uuid
      let settings = {
        'workspace' : {
          'name': res.workspace.name,
          'uuid': wsUuid
        }
      }
      if(LocalStorageService.getWorkspaceId() === null) {
        LocalStorageService.setWorkspaceId(wsUuid)
      }

      LocalStorageService.set('workspace', settings)
      WorkspaceServiceVue.activeWorkspace(wsUuid)
    })
  },
  methods: {
    toggleTabs: function (tabNumber) {
      this.openTab = tabNumber
    }
  }
};
</script>
