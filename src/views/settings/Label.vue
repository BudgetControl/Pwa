<template>
    <div class="p-6 bg-gray-100 min-h-screen">
        <!-- Intestazione desktop -->
        <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
            <div>
                <h1 class="text-2xl font-bold text-gray-800">{{ $t('labels.label_settings') }}</h1>
                <p class="text-gray-600 mt-1">{{ $t('labels.manage_your_labels') }}</p>
            </div>
        </div>

        <div class="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div class="p-6">
                <div class="mt-4 lg:mt-0 flex flex-col sm:flex-row gap-3">

                    <button
                        class="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-2"
                        v-on:click="openLabelModal()">
                        <i class="fas fa-plus mr-2"></i> {{ $t('labels.add_new_label') }}
                    </button>
                    
                    <!-- Opzioni filtro -->
                    <select v-model="labelFilters"
                        class="border-0 px-3 py-2 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring focus:ring-emerald-200">
                        <option value="active">{{ $t('labels.active_labels') }}</option>
                        <option value="all">{{ $t('labels.all_labels') }}</option>
                        <option value="archived">{{ $t('labels.archived_labels') }}</option>
                    </select>
                </div>

                <!-- Lista etichette -->
                <div class="space-y-3 mt-6">
                    <div v-for="(item, k) in filteredLabels" :key="k"
                        class="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                        :style="'border-left: 4px solid ' + item.color">
                        <div class="flex items-center">
                            <span class="font-medium">{{ item.name }}</span>
                        </div>
                        <EntryActionDropdown>
                            <Action :onAction="() => openLabelModal(item)" :label="$t('labels.edit')"
                                iconClass="fa-solid fa-pen-to-square" />
                            <Action :onAction="() => deleteItem(k)" :label="$t('labels.delete')"
                                iconClass="fa-solid fa-trash text-red-400" />
                        </EntryActionDropdown>
                    </div>

                    <div v-if="labels.length === 0" class="text-center py-8 text-gray-500">
                        <i class="fas fa-tags text-4xl mb-3"></i>
                        <p>{{ $t('labels.no_labels_found') }}</p>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Modal per aggiungere/modificare etichetta -->
        <div v-if="showLabelModal"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-y-auto">
            <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto my-8 flex flex-col">
                <!-- Header della modale -->
                <div class="bg-white p-6 border-b border-gray-200 flex justify-between items-center">
                    <h3 class="text-xl font-bold text-gray-800">
                        {{ editingLabel ? $t('labels.edit_label') : $t('labels.add_label') }}
                    </h3>
                    <button @click="closeLabelModal" class="text-gray-400 hover:text-gray-600 p-2">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>

                <!-- Contenuto della modale -->
                <div class="p-6">
                    <div class="space-y-6">
                        <!-- Nome etichetta -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('labels.name') }} *</label>
                            <input type="text" v-model="currentLabel.name"
                                class="w-full border-0 px-4 py-3 placeholder-slate-300 text-slate-600 bg-gray-50 rounded-lg text-sm shadow focus:outline-none focus:ring focus:ring-emerald-200"
                                :placeholder="$t('labels.label_name')" />
                        </div>

                        <!-- Colore etichetta -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('labels.label_color') }}</label>
                            <div class="bg-gray-50 p-4 rounded-lg">
                                <color-picker 
                                    :visible-formats="['hex']" 
                                    :color="currentLabel.color" 
                                    @color-change="updateColor" 
                                />
                                <div class="flex items-center space-x-4 mt-4">
                                    <div class="w-12 h-12 rounded-full border-2 border-gray-300 shadow-sm"
                                        :style="{ backgroundColor: currentLabel.color }"></div>
                                    <input type="color" v-model="currentLabel.color"
                                        class="w-20 h-12 border-0 rounded-lg cursor-pointer shadow-sm" />
                                </div>
                            </div>
                        </div>

                        <!-- Checkbox options -->
                        <div class="bg-gray-50 mt-6 rounded-lg space-y-4 p-4">
                            <div class="flex items-center">
                                <input type="checkbox" id="archived" v-model="currentLabel.archive"
                                    class="h-4 w-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500 mr-3" />
                                <label for="archived" class="text-sm text-gray-700">{{ $t('labels.archived') }}</label>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Footer della modale -->
                <div class="bg-white p-6 border-t border-gray-200">
                    <div class="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                        <button @click="saveLabel"
                            class="flex-1 bg-emerald-500 text-white px-6 py-3 rounded-lg hover:bg-emerald-600 transition-colors font-medium">
                            {{ $t('labels.save') }}
                        </button>
                        <button @click="closeLabelModal"
                            class="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium">
                            {{ $t('labels.cancel') }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
        
        <ConfirmModal ref="confirmModal" />
        <AlertModal ref="alertModal" />
    </div>
</template>

<script>
import CoreService from '../../services/core.service';
import '@vuepic/vue-datepicker/dist/main.css'
import EntryActionDropdown from "@/components/Dropdowns/EntryActionDropdown.vue";
import Action from "@/components/Dropdowns/Action.vue";
import ConfirmModal from '@/components/GenericComponents/ConfirmModal.vue';
import AlertModal from '@/components/GenericComponents/AlertModal.vue';
import { ColorPicker } from 'vue-accessible-color-picker';

export default {
    components: {
        EntryActionDropdown, 
        Action, 
        ConfirmModal, 
        AlertModal,
        ColorPicker
    },
    setup() {
        const apiService = new CoreService()

        return {
            apiService
        }
    },
    data() {
        return {
            labelFilters: 'active',
            labels: [],
            showLabelModal: false,
            editingLabel: false,
            currentLabel: {
                id: null,
                name: '',
                color: '#' + Math.floor(Math.random() * 16777215).toString(16),
                archive: false,
                uuid: null
            },
            color: null,
            opentab: null,
            action: {
                archived: true
            }
        }
    },
    mounted: function () {
        this.loadLabels();
    },
    created() {
        window.confirm = (message) => {
            return this.$refs.confirmModal.show(message);
        };
        
        window.alert = (message, type = 'success') => {
            this.$refs.alertModal.show(message, type);
        };
    },
    computed: {
        filteredLabels() {
            switch (this.labelFilters) {
                case 'active':
                    return this.labels.filter(label => !label.archive);
                case 'archived':
                    return this.labels.filter(label => label.archive);
                case 'all':
                default:
                    return this.labels;
            }
        }
    },
    methods: {
        loadLabels() {
            this.apiService.labels('?archive=1').then((res) => {
                this.labels = res;
            });
        },
        
        openLabelModal(label = null) {
            if (label) {
                this.editingLabel = true;
                this.currentLabel = { ...label };
            } else {
                this.editingLabel = false;
                this.currentLabel = {
                    id: null,
                    name: '',
                    color: '#' + Math.floor(Math.random() * 16777215).toString(16),
                    archive: false,
                    uuid: null
                };
            }
            this.showLabelModal = true;
        },
        
        closeLabelModal() {
            this.showLabelModal = false;
            this.editingLabel = false;
        },
        
        updateColor(eventData) {
            this.currentLabel.color = eventData.cssColor;
        },
        
        saveLabel() {
            if (!this.currentLabel.name) {
                alert(this.$t('messages.label_name_required'), 'error');
                return;
            }
            
            this.apiService.setLabel(this.currentLabel.uuid, this.currentLabel).then(() => {
                this.loadLabels();
                this.closeLabelModal();
                alert(this.editingLabel ? this.$t('messages.label_updated') : this.$t('messages.label_created'), 'success');
            }).catch(() => {
                alert(this.$t('labels.generic_error'), 'error');
            });
        },

        deleteItemFromArray(index) {
            this.labels.splice(index, 1);
        },

        deleteItem(index) {
            const labelUuid = this.labels[index].uuid;
            if (!window.confirm(this.$t('messages.delete_label'))) {
                return;
            }
            
            this.apiService.deleteLabel(labelUuid).then(() => {
                this.deleteItemFromArray(index);
                alert(this.$t('messages.label_deleted'), 'success');
            }).catch(() => {
                alert(this.$t('labels.generic_error'), 'error');
            });
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

.radius-label {
    border-radius: 90%;
    width: 40px;
    height: 40px;
}
</style>