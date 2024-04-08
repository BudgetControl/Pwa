<template>
    <section class="relative py-16 bg-blueGray-200">
        <div class="container mx-auto px-4">
            <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
                <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0">
                    <HeaderButton back="/app/settings" title="Workspace settings" />

                    <div class="container px-4 mx-auto ">
                        <p class="px-2 mb-2 text-sm font-medium text-gray-400 dark:text-gray-500">Set up your workspaces
                        </p>

                        <div class="container px-4 mx-auto" v-on:click="openModal(null)">
                        <div class="flex border border-dotted m-1 bg-blueGray-200">
                            <div class="flex lg:w-2/12 p-2">
                                <i class="fas fa-plus fa-lg"></i>
                            </div>
                            <div class="flex lg:w-10/12 p-2">
                                <p>
                                    Add new workspace
                                </p>
                            </div>
                        </div>
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
import WorkspaceServiceVue from '../../services/WorkspaceService.vue';

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
        WorkspaceServiceVue.list().then((res) => {
            _this.workspaces = res
        })
    },
    methods: {
        openModal(id) {
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
}</style>
  