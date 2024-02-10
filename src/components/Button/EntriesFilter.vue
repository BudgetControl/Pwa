<template>

    <ul class="relative flex flex-wrap items-center justify-between px-5 py-5 navbar-expand-lg rounded">
    <li>
        <input @click="showPlanned()" type="checkbox" id="show-planned" value="" class="hidden peer" required="">
        <label for="show-planned" class="min-w-20 ml-5 uppercase text-xs inline-flex items-center justify-between p-2 bg-gray-100 border-2 cursor-pointer peer-checked:border-emerald-600">                           
        planned
        </label>
    </li>
    <li>
        <input @click="showTransfer()" type="checkbox" id="show-transfer" value="" class="hidden peer">
        <label for="show-transfer" class="min-w-20 ml-5 uppercase text-xs inline-flex items-center justify-between p-2 bg-gray-100 border-2 border-gray-200  cursor-pointe peer-checked:border-emerald-600 ">
            transfer
        </label>
    </li>
    <li>
        <input @click="showDebit()" type="checkbox" id="show debit" value="" class="hidden peer">
        <label for="show debit" class="min-w-20 ml-5 uppercase text-xs inline-flex items-center justify-between p-2 bg-gray-100 border-2 border-gray-200  cursor-pointer peer-checked:border-emerald-600">
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
}
</script>

<style>
.min-w-20 {
    min-width: 5.5rem;
    text-align: center;
}
</style>