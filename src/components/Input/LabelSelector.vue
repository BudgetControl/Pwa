<template>
  <div class="w-full">
    <label v-if="label" class="block uppercase text-slate-600 text-xs font-bold mb-2">
      {{ label }}
    </label>
    
    <!-- Search input -->
    <div class="w-full mb-3">
      <input 
        v-model="searchQuery"
        type="text"
        :placeholder="$t('labels.search_labels')"
        class="w-full border-0 px-3 py-2 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
      />
    </div>
    
    <!-- Lista di checkbox per desktop -->
    <div class="desktop-grid label-selector-grid w-full border-0 bg-white rounded text-sm shadow mb-3" v-if="!isMobile">
      <div class="flex flex-col">
        <div v-for="item in filteredLabels" 
            :key="item.id" 
            @click="toggleLabel(item)"
            class="label-item cursor-pointer p-1"
            :class="{ 'selected': isSelected(item) }">
          <span 
            class="text-xs font-semibold py-2 px-4 uppercase w-full text-center block"
            :style="'color: #fff; background-color: ' + item.color">
            {{ item.name }}
          </span>
        </div>
      </div>
    </div>

    <!-- Select multipla per mobile -->
    <div class="mobile-select w-full mb-3" v-if="isMobile">
      <select 
        v-model="selectedLabels"
        multiple
        class="w-full border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150">
        <option 
          v-for="item in filteredLabels" 
          :key="item.id" 
          :value="item"
          :style="'color: #fff; background-color: ' + item.color"
          class="text-xs font-semibold py-1 px-2 uppercase">
          {{ item.name }}
        </option>
      </select>
    </div>

    <!-- Input per creare nuove etichette -->
    <div class="flex w-full mb-3">
      <input 
        v-model="newLabelInput" 
        type="text" 
        :placeholder="$t('labels.or_insert_new_tag_name')"
        @keypress.enter.prevent="addNewLabel"
        @input="handleInputChange"
        class="flex-1 border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded-l text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150" />
      <button 
        @click="addNewLabel"
        class="px-4 bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm rounded-r shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
        :disabled="!newLabelInput.trim()">
        <i class="fas fa-plus"></i>
      </button>
    </div>

    <!-- Visualizzazione etichette selezionate -->
    <div class="w-full flex flex-wrap mt-3" v-if="selectedLabels.length > 0">
      <div v-for="(item, i) in selectedLabels" :key="i" class="mb-2">
        <span 
          @click="removeLabel(item)"
          class="ml-2 text-xs font-semibold justify-center py-1 px-2 uppercase rounded text-white cursor-pointer hover:opacity-75 transition-opacity"
          :style="'color: #fff; background-color: ' + item.color">
          {{ item.name }}
          <i class="fas fa-times ml-1"></i>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { libs } from '../../libs'

export default {
  name: 'LabelSelector',
  props: {
    modelValue: {
      type: Array,
      default: () => []
    },
    availableLabels: {
      type: Array,
      default: () => []
    },
    label: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    },
    hasError: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      newLabelInput: '',
      selectedLabels: [],
      isMobile: false,
      searchQuery: ''
    }
  },
  emits: ['update:modelValue', 'new-label'],
  computed: {
    sortedLabels() {
      return [...this.availableLabels].sort((a, b) => a.name.localeCompare(b.name))
    },
    filteredLabels() {
      const query = this.searchQuery.trim().toLowerCase()
      if (!query) {
        return this.sortedLabels
      }
      return this.sortedLabels.filter(label => 
        label.name.toLowerCase().includes(query)
      )
    }
  },
  async created() {
    this.isMobile = await libs.isMobile()
  },
  watch: {
    modelValue: {
      immediate: true,
      handler(newValue) {
        this.updateSelectedLabels(newValue)
      }
    },
    availableLabels: {
      immediate: true,
      handler() {
        this.updateSelectedLabels(this.modelValue)
      }
    }
  },
  methods: {
    isSelected(item) {
      return this.selectedLabels.some(label => label.id === item.id)
    },

    toggleLabel(item) {
      const index = this.selectedLabels.findIndex(label => label.id === item.id)
      if (index === -1) {
        this.selectedLabels.push(item)
      } else {
        this.selectedLabels.splice(index, 1)
      }
      this.emitSelectedLabels()
    },
    
    handleInputChange(event) {
      const value = event.target.value
      // Auto-aggiungi etichette quando l'utente digita uno spazio o virgola
      if (value.includes(' ') || value.includes(',')) {
        this.addNewLabel()
      }
    },
    
    addNewLabel() {
      if (this.newLabelInput.trim()) {
        // Split by space, comma, or combination
        const separators = /[\s,]+/
        const newLabels = this.newLabelInput.split(separators)
          .map(name => name.trim())
          .filter(name => name)
        
        newLabels.forEach(labelName => {
          // Controlla se l'etichetta esiste già
          const existingLabel = this.availableLabels.find(label => 
            label.name.toLowerCase() === labelName.toLowerCase()
          )
          
          if (existingLabel) {
            // Se l'etichetta esiste, selezionala automaticamente
            if (!this.selectedLabels.find(sl => sl.id === existingLabel.id)) {
              this.selectedLabels.push(existingLabel)
            }
          } else {
            // Crea una nuova etichetta
            const newLabel = {
              id: `temp_${Date.now()}_${Math.random()}`,
              name: labelName,
              color: this.generateRandomColor(),
              isNew: true
            }
            this.selectedLabels.push(newLabel)
            this.$emit('new-label', newLabel)
          }
        })
        
        // Pulisci l'input
        this.newLabelInput = ''
        // Aggiorna il model value
        this.emitSelectedLabels()
      }
    },
    
    removeLabel(labelToRemove) {
      // Rimuovi l'etichetta dalla lista selezionata
      this.selectedLabels = this.selectedLabels.filter(label => label.id !== labelToRemove.id)
      
      // Se era una nuova etichetta temporanea, rimuovila completamente
      if (labelToRemove.isNew) {
        this.$emit('update:modelValue', this.selectedLabels.map(label => label.id))
      } else {
        // Altrimenti aggiorna solo la lista delle selezioni
        this.emitSelectedLabels()
      }
    },
    
    updateSelectedLabels(selectedIds) {
      console.log('Updating selected labels with IDs:', selectedIds) // Debug
      if (!selectedIds || !Array.isArray(selectedIds)) {
        this.selectedLabels = []
        return
      }
      
      this.selectedLabels = selectedIds.map(id => {
        // Cerca nelle etichette disponibili
        const existing = this.availableLabels.find(label => label.id === id)
        if (existing) return existing
        
        // Se non trovata, potrebbe essere una nuova etichetta temporanea
        const temp = this.selectedLabels.find(label => label.id === id)
        return temp || null
      }).filter(Boolean)
      
      console.log('Updated selectedLabels:', this.selectedLabels) // Debug
    },
    
    updateModelValue(selectedIds) {
      // Mantieni sia le etichette esistenti che quelle nuove
      const allSelected = [
        ...selectedIds,
        ...this.selectedLabels.filter(label => label.isNew).map(label => label.id)
      ]
      
      console.log('Emitting model value:', allSelected) // Debug
      this.$emit('update:modelValue', allSelected)
    },
    
    emitSelectedLabels() {
      this.$emit('update:modelValue', this.selectedLabels.map(label => label.id))
    },
    
    generateRandomColor() {
      const colors = [
        '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', 
        '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
        '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
        '#ec4899', '#f43f5e'
      ]
      return colors[Math.floor(Math.random() * colors.length)]
    }
  }
}
</script>

<style scoped>
.close-icon {
  margin-left: 4px;
}
</style>
