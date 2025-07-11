<template>
  <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded"
    :class="[color === 'light' ? 'bg-white' : 'bg-emerald-900 text-white']">
    <div class="rounded-t mb-0 px-4 py-3 border-0">
      <div class="flex flex-wrap items-center">
        <div class="lg:w-2/12 px-2">
          <h3 class="text-slate-400 text-sm mt-3 mb-6 font-bold uppercase">
            Wallet
          </h3>
        </div>
      </div>
    </div>

    <EntriesTable 
      ref="entry" 
      :external-show-planned="action.show_planned"
      @toggle-planned="handleTogglePlanned">
      
      <!-- Inietta il CheckboxButton tramite slot -->
      <template #controls="{ showPlanned }">
        <CheckboxButton 
          @update:active="handleTogglePlanned"
          :status="showPlanned"
          :label="$t('labels.show_planned_entries')"
        />
      </template>
    </EntriesTable>
    
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
import CheckboxButton from "../Button/CheckboxButton.vue";

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
    appSettings.settings.current_page = 1
    
    return {
      appSettings
    }
  },
  data() {
    return {
      filter: "",
      wallet: 0,
      entries: [],
      selected: {
        wallet: 0
      },
      pagination: {
        enabled: false
      },
      action: {
        reset: true,
        show_planned: true
      },
    }
  },
  components: {
    EntriesTable, 
    Paginator, 
    CheckboxButton  // Manteniamo questo perché viene usato nello slot
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
    async invoke() {
      const currentPage = this.appSettings.settings.current_page
      const filter = `?per_page=30&page=${currentPage}` + this.filterQueryString(this.$route.query) + "&filters[planned]=0";
      const filterPlannedEntry = `?per_page=30&page=${currentPage}&filters[planned]=1`;
      const coreService = new CoreService();

      try {
        const [plannedRes, regularRes] = await Promise.all([
          coreService.getEntry(filterPlannedEntry),
          coreService.getEntry(filter),
        ]);

        let plannedEntries = plannedRes.data;
        let regularEntries = regularRes.data;

        // Unisci le entries
        let entries
        if(this.$route.query.filter_planned == 0 ) {
          entries = regularEntries;
        } else {
          entries = regularEntries.concat(plannedEntries);
        }

        if (entries.length > 0) {
          entries.sort((a, b) => new Date(b.date_time) - new Date(a.date_time));
          this.$refs.entry.buildEntriesTable(entries);
        }

        if (this.$refs._paginator !== undefined) {
          this.$refs._paginator.hasMorePage = this.currentPage < regularRes.last_page;
        }
      } catch (error) {
        console.error('Errore durante il recupero delle entries:', error);
      }

    },
    get(path, callBack) {
      axios.get(path).then((resp) => {
        callBack(resp.data)
      }).catch((error) => {
        console.error(error);
      })
    },
    filterQueryString(query) {
      let filter = ''

      if (query.filter_date !== undefined) {

        if (query.filer_date_start !== undefined) {
          filter += `&filters[date_time]=>=|${query.filter_date_start}`
        } else {
          filter += `&filters[date_time]=>=|${new Date().getFullYear()}-${new Date().getMonth() + 1}-01`
        }
        filter += `&filters[date_time]=<=|${query.filter_date}`

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

      if (query.filter_planned !== undefined) {
        filter += `&filters[planned]=${this.$route.query.filter_planned}`
      }

      if (filter != '') {
        this.action.reset = true
      } else {
        this.action.reset = false
      }

      console.debug('filter', filter)

      return filter
    },
    handleTogglePlanned() {
      this.action.show_planned = !this.action.show_planned
      // Ricarica i dati se necessario
      this.invoke()
    },
  },
};
</script>

<style scoped>
.transfer-color {
  background-color: #ffe08738;
}
</style>