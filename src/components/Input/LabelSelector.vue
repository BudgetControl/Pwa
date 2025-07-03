<template>
  <div class="w-full">
    <label v-if="label" class="block uppercase text-slate-600 text-xs font-bold mb-2">
      {{ label }}
    </label>
    
    <!-- Select per scegliere etichette esistenti -->
    <select 
      :value="modelValue" 
      @input="handleLabelSelect"
      multiple
      :class="[
        'w-full border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150 mb-3',
        { 'border-red-300 bg-red-50': hasError }
      ]">
      <option 
        v-for="item in availableLabels" 
        :key="item.id" 
        :value="item.id"
        :style="'color: #fff; background-color: ' + item.color"
        class="text-xs font-semibold justify-center py-1 px-2 uppercase rounded text-white-600">
        {{ item.name }}
      </option>
    </select>

    <!-- Suggerimento per l'utente -->
    <p class="text-xs text-slate-500 mb-3">
      {{ $t('labels.label_input_hint') }}
    </p>

    <!-- Input per creare nuove etichette -->
    <input 
      v-model="newLabelInput" 
      type="text" 
      :placeholder="$t('labels.or_nsert_new_tag_name')"
      @keypress.enter="addNewLabel"
      @input="handleInputChange"
      class="w-full border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150 mb-3" />


    <!-- Visualizzazione etichette selezionate -->
    <div class="w-full flex flex-wrap" v-if="selectedLabels.length > 0">
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
      selectedLabels: []
    }
  },
  emits: ['update:modelValue', 'new-label'],
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
    handleLabelSelect(event) {
      const selectedIds = Array.from(event.target.selectedOptions).map(option => option.value)
      console.log('Selected from dropdown:', selectedIds) // Debug
      this.updateModelValue(selectedIds)
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
        console.log('Adding new label:', this.newLabelInput) // Debug
        
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
          
          if (!existingLabel) {
            // Crea una nuova etichetta temporanea
            const newLabel = {
              id: `temp_${Date.now()}_${Math.random()}`,
              name: labelName,
              color: this.generateRandomColor(),
              isNew: true
            }
            
            console.log('Created new label:', newLabel) // Debug
            
            // Aggiungi la nuova etichetta alle selectedLabels
            this.selectedLabels.push(newLabel)
            
            // Emetti immediatamente la nuova label al componente padre
            this.$emit('new-label', newLabel)
          } else {
            console.log('Adding existing label:', existingLabel) // Debug
            // Aggiungi l'etichetta esistente se non è già selezionata
            if (!this.selectedLabels.find(selected => selected.id === existingLabel.id)) {
              this.selectedLabels.push(existingLabel)
            }
          }
        })
        
        // Pulisci l'input
        this.newLabelInput = ''
        
        // Aggiorna il model value con tutti gli ID selezionati
        this.emitSelectedLabels()
      }
    },
    
    removeLabel(labelToRemove) {
      console.log('Removing label:', labelToRemove) // Debug
      this.selectedLabels = this.selectedLabels.filter(label => label.id !== labelToRemove.id)
      this.emitSelectedLabels()
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
      const selectedIds = this.selectedLabels.map(label => label.id)
      console.log('Emitting selected labels:', selectedIds) // Debug
      this.$emit('update:modelValue', selectedIds)
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
