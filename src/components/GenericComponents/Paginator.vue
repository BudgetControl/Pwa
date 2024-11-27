<template>
    <nav class="block">
        <ul class="flex pl-0 rounded list-none flex-wrap jiustify-content">
            <li>
                <a v-on:click="previus()"
                    class="first:ml-0 text-xs font-semibold flex w-16 h-8 mx-1 p-0 rounded-full items-center justify-center leading-tight relative border border-solid border-emerald-500 text-white bg-emerald-500">
                    <i class="fas fa-chevron-left -ml-px"></i> <i class="fas fa-chevron-left -ml-px"></i>
                </a>
            </li>
            <li>
                <a v-on:click="next()"
                    class="first:ml-0 text-xs font-semibold flex w-16 h-8 mx-1 p-0 rounded-full items-center justify-center leading-tight relative border border-solid border-emerald-500 text-white bg-emerald-500">
                    <i class="fas fa-chevron-right -mr-px"></i> <i class="fas fa-chevron-right -mr-px"></i>
                </a>
            </li>
        </ul>
    </nav>
</template>

<script>
import { useAppSettings } from '../../storage/settings.store';

export default {
    data() {
        return {
            pagination: {
                current: 1,
                hasMorePage: true
            }
        }
    },
    setup() {
        const appSettings = useAppSettings()
        const current_page = appSettings.get().current_page

        return {
            appSettings, current_page
        }
    },
    methods: {
        next() {
            if (this.pagination.hasMorePage == true) {
                this.pagination.current++
                this.invokeEntry()
            }
        },
        previus() {
            if (this.pagination.current != 1) {
                this.pagination.current--
                this.invokeEntry()
            }
        },
        invokeEntry() {
            this.appSettings.settings.current_page = this.pagination.current
            this.$parent.invoke()
        }
    }
}
</script>
