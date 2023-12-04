<template>
    <!-- seggins nav bar -->
    <nav class="relative flex flex-wrap items-center justify-between px-2 py-3 navbar-expand-lg bg-emerald-500 mb-3">
        <div class="container mx-auto flex flex-wrap items-center justify-between">

            <div class="w-full relative flex lg:w-auto lg:static lg:block lg:justify-start">
                <router-link
                    :to=back
                    class="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-xs px-4 py-2 rounded hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button">
                    <i class="fas fa-arrow-left"></i>
                </router-link>
                <p class="text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-no-wrap uppercase text-white">
                    {{title}}
                </p>
            </div>
        </div>
    </nav>
    <!-- seggins nav bar -->
</template>
<script>

export default {
    props: {
        back: {
            type: String,
        },
        title: {
            type: String,
            default: null,
        },
    }
};
</script>
  