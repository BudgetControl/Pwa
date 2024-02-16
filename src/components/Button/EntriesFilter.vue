<template>

    <ul class="relative flex px-5 py-5 navbar-expand-lg text-center">
    <li class="flex-l w-full m-1">
        <input @click="showPlanned()" type="checkbox" id="show-planned" value="" class="hidden peer" required="" v-model="isCheckedPlanned">
        <label for="show-planned" class="w-full  uppercase text-xs inline-flex p-2 bg-gray-100 border-2 cursor-pointer"
        :class="{ 'border-emerald-600': isCheckedPlanned === true }">                           
        planned
        </label>
    </li>
    <li class="flex-l w-full m-1">
        <input @click="showTransfer()" type="checkbox" id="show-transfer" value="" class="hidden peer"  v-model="isCheckedTransfer">
        <label for="show-transfer" class="w-full  uppercase text-xs inline-flex p-2 bg-gray-100 border-2 cursor-pointer"
        :class="{ 'border-emerald-600': isCheckedTransfer === true }">  
            transfer
        </label>
    </li>
    <li class="flex-l w-full m-1">
        <input @click="showDebit()" type="checkbox" id="show debit" value="" class="hidden peer"  v-model="isCheckedDebit">  
        <label for="show debit" class="w-full uppercase text-xs inline-flex p-2 bg-gray-100 border-2 cursor-pointer"
        :class="{ 'border-emerald-600': isCheckedDebit === true }" >
            debit
        </label>
    </li>
</ul>

</template>

<script>

export default {
    props: {
        showPlanned: Function,
        showTransfer: Function,
        showDebit: Function,
  },
  data(){
    return {
        isCheckedPlanned: false,
        isCheckedTransfer: false,
        isCheckedDebit: false,
    }

  }
}
</script>

<style>
.min-w-20 {
    min-width: 5.5rem;
    text-align: center;
}
</style>