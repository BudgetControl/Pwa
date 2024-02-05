<template>

    <ul class="flex ">
    <li>
        <input type="checkbox" id="show-planned" value="" class="hidden peer" required="">
        <label for="show-planned" class="ml-5 uppercase text-xs inline-flex items-center justify-between p-2 bg-gray-200 border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">                           
           show planned
        </label>
    </li>
    <li>
        <input type="checkbox" id="show-transfer" value="" class="hidden peer">
        <label for="show-transfer" class="ml-5 uppercase text-xs inline-flex items-center justify-between p-2 bg-gray-200 border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
            show transfer
        </label>
    </li>
    <li>
        <input type="checkbox" id="show debit" value="" class="hidden peer">
        <label for="show debit" class="ml-5 uppercase text-xs inline-flex items-center justify-between p-2 bg-gray-200 border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
            show debit
        </label>
    </li>
</ul>

</template>

<script>

export default {

}
</script>
