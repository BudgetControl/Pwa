<template>
    <section class="relative py-16 bg-blueGray-200">
        <div class="container mx-auto px-4">
            <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg ">
                <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0">
                    <HeaderButton back="/app/settings/label" title="Label settings" />

                    <div class="relative p-6 flex-auto">
                        <!-- Regular Input -->
                        <div class="mb-3 pt-0">
                            <input type="text" placeholder="" v-model="modal.name"
                                class="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm border border-blueGray-300 outline-none focus:outline-none focus:shadow-outline w-full" />
                        </div>

                        <div class="mb-3 pt-0">
                            <span class="text-xs text-blueGray-400">  {{ $t('labels.label_color') }}</span>
                            <color-picker :visible-formats="['hex']" :color="modal.color" @color-change="updateColor" />
                        </div>

                        <div class="mb-3 pt-0">
                            <label for="exclude_stats">
                                <input v-model="modal.archive" type="checkbox" class="p-1 border rounded"
                                    id="exclude_stats" :value="true" checked>  {{ $t('labels.archive') }}
                            </label>
                        </div>

                    </div>
                    <!--footer-->
                    <div class="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                        <button
                            class="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button" v-on:click="saveModal()">
                            {{ $t('labels.save') }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <AlertModal ref="alertModal" />
    </section>
</template>

<script>
import HeaderButton from '@/components/Button/HeaderButton.vue';
import CoreService from '../../../services/core.service';
import '@vuepic/vue-datepicker/dist/main.css'
import { ColorPicker } from 'vue-accessible-color-picker';
import AlertModal from '../../../components/GenericComponents/AlertModal.vue';
import { getHeaderTokens } from '@/utils/headers-token';

export default {
    components: {
        HeaderButton, ColorPicker, AlertModal
    },
    setup() {
        const headers = getHeaderTokens()
        const apiService = new CoreService(headers)

        return {
            apiService
        }
    },
    data() {
        return {
            color: null,
            form: {
                type: ['incoming', 'expenses', 'investments'],
            },
            modal: {
                id: null,
                name: null,
                archive: false
            }
        }
    },
    mounted: function () {
        this.openModal(this.$route.params.id, this.$route.params.subId)
    },
    created() {
    window.alert = (message, type = 'success') => {
      this.$refs.alertModal.show(message, type);
    };
  },
    methods: {
        showSub(id) {
            if (this.opentab == id) {
                this.opentab = null
            } else {
                this.opentab = id
            }

        },
        openModal(id) {
            this.apiService.label(id).then((resp) => {
                this.modal.id = resp.id
                this.modal.name = resp.name
                this.modal.archive = resp.archive
                this.modal.color = resp.color
                this.modal.uuid = resp.uuid
            })
        },

        saveModal() {
            const _this = this
            this.apiService.setLabel(this.modal.uuid, this.modal).then(() => {
                alert('Label updated')
                _this.$router.push({path : '/app/settings/label'})
            })
        },
        updateColor(eventData) {
            this.modal.color = eventData.cssColor
        },
    }
};
</script>

<style>
.vacp-color-input-group {
    display: none !important;
}

.vacp-copy-button {
    display: none !important;
}

.expenses {
    color: red
}

.incoming {
    color: green
}
</style>
  