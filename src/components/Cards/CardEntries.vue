<template>
  <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded"
    :class="[color === 'light' ? 'bg-white' : 'bg-emerald-900 text-white']">
    <div class="rounded-t mb-0 px-4 py-3 border-0">
      <div class="flex flex-wrap items-center">
        <div class="lg:w-2/12 px-2">
          <h3 class="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
            Wallet
          </h3>
        </div>
      </div>
    </div>

    <EntriesTable ref="entry" />
    <!-- pagination -->
    <div class="py-2">
      <Paginator ref="_paginator"></Paginator>
    </div>
    <!-- end pagination -->

  </div>
</template>
<script>

import EntriesTable from "@/components/Entry/EntriesTable.vue";
import axios from 'axios'
import Paginator from "../GenericComponents/Paginator.vue";
import { useAppSettings } from '../../storage/settings.store';
import CoreService from "../../services/core.service";
import { getHeaderTokens } from "../../utils/headers-token";

export default {
  props: {
    color: {
      default: "light",
      validator: function (value) {
        // The value must match one of these strings
        return ["light", "dark"].indexOf(value) !== -1;
      },
    },
  },
  setup() {
    const appSettings = useAppSettings()
    const current_page = appSettings.get().current_page

    return {
      appSettings, current_page
    }
  },
  data() {
    return {
      filter: "",
      wallet: 0,
      selected: {
        wallet: 0
      },
      pagination: {
        enabled: false
      },
      action: {
        reset: true
      },
    }
  },
  components: {
    EntriesTable, Paginator
  },
  watch: {
    $route() {
      this.invoke()
    }
  },
  mounted() {
    this.invoke()
  },
  methods: {
    invoke() {
      let _this = this

      let currentPage = LocalStorageService.get('current_page') == null ? 1 : LocalStorageService.get('current_page')
      const filter = `?per_page=20&page=${currentPage}` + this.filterQueryString(this.$route.query)
      const headers = getHeaderTokens()
      const coreService = new CoreService(headers)
      coreService.getEntry(filter).then((res) => {
        if (res.data.length > 0) {
          _this.$refs.entry.buildEntriesTable(res.data)
        }

        if (this.$refs._paginator !== undefined) {
          this.$refs._paginator.hasMorePage = currentPage < res.last_page
        }
      })

    },
    get(path, callBack) {
      axios.get(path).then((resp) => {
        callBack(resp.data)
      }).catch((error) => {
        console.error(error);
      })
    },
    filterQueryString(query) {
      const lastDayOfCurrentMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()
      let filter = ''

      if (query.filter_date !== undefined) {

        if (query.filer_date_start !== undefined) {
          filter += `&filters[date_time]=>=|${query.filter_date_start}`
        } else {
          filter += `&filters[date_time]=>=|${new Date().getFullYear()}-${new Date().getMonth() + 1}-01`
        }
        filter += `&filters[date_time]=<=|${query.filter_date}`

      } else {
        filter = `&filters[date_time]=<=|${new Date().getFullYear()}-${new Date().getMonth() + 1}-${lastDayOfCurrentMonth}T23:59:59`
      }

      if (query.filter_wallet !== undefined) {
        filter += `&filters[account_id]=${this.$route.query.filter_wallet}`
      }

      if (query.filter_category !== undefined) {
        filter += `&filters[category_id]=${this.$route.query.filter_category}`
      }

      if (query.filter_type !== undefined) {
        filter += `&filters[type]=${this.$route.query.filter_type}`
      }

      if (query.filter_label !== undefined) {
        filter += `&filters[label]=${this.$route.query.filter_label}`
      }

      if (query.filter_payee !== undefined) {
        filter += `&filters[payee_id]=${this.$route.query.filter_payee}`
      }

      if (filter != '') {
        this.action.reset = true
      } else {
        this.action.reset = false
      }

      console.debug('filter', filter)

      return filter
    },
  },
};
</script>

<style scoped>
.transfer-color {
  background-color: #ffe08738;
}
</style>