<template>
    <section class="relative py-16 bg-blueGray-200">
        <div class="container mx-auto px-4">
            <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg ">
                <div
                    class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0">
                    <HeaderButton back="/app/settings" title="Workspace settings" />

                    <div class="container px-4 mx-auto ">
                        

                        <div class="container px-4 mx-auto" v-on:click="openModal(null)">

                            <button
                                class="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                type="button">
                                {{ $t('labels.add_new_workspace') }}
                            </button>

                        </div>

                    </div>
                    <!-- labels -->
                    <div class="container px-4 mx-auto " v-for="(item, k) in workspaces" :key="k">

                        <div class="flex border border-dotted m-1" v-on:click="openModal(item.uuid)">
                            <div class="flex lg:w-12/12 p-2">
                                {{ item.name }}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
<script>

import HeaderButton from '@/components/Button/HeaderButton.vue';
import '@vuepic/vue-datepicker/dist/main.css'
import WorkspaceService from "../../services/workspace.service";
import { getHeaderTokens } from '../../utils/headers-token';

export default {
    components: {
        HeaderButton
    },
    data() {
        return {
            workspaces: [],
        }
    },
    mounted: function () {
        const _this = this
        const headers = getHeaderTokens()
        const WorkspaceServiceVue = new WorkspaceService(headers)
        WorkspaceServiceVue.listByUser().then((res) => {
            _this.workspaces = res
        })
    },
    methods: {
        openModal(id) {
            if (id === null)
                this.$router.push({ path: `/app/settings/workspace/add` })
            else
                this.$router.push({ path: `/app/settings/workspace/edit/${id}` })
        },
    },
};
</script>

<style>
.vacp-color-input-group {
    display: none !important;
}

.vacp-copy-button {
    display: none !important;
}
</style>