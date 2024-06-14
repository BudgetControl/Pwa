<template>
    <li class="nav-item border border-solid border-blueGray-100 mx-2">
        <router-link :to=path v-slot="{ href, navigate, isActive }">
            <a :href="href" @click="navigate"
                class="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
                :class="[
                    isActive
                        ? 'text-white hover:text-emerald-600'
                        : 'text-white hover:text-blueGray-500',
                ]">
                {{label}}
            </a>
        </router-link>
    </li>
</template>

<script>

export default {
    props: {
        label: {
            type: String,
            required: true
        },
        path: {
            type: String,
            required: true
        }
    },
};
</script>