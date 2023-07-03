<template>
    <nav class="block">
        <ul class="flex pl-0 rounded list-none flex-wrap">
            <li>
                <a v-on:click="previus(pagination.previus)"
                    class="first:ml-0 text-xs font-semibold flex w-8 h-8 mx-1 p-0 rounded-full items-center justify-center leading-tight relative border border-solid border-emerald-500 text-white bg-emerald-500">
                    <i class="fas fa-chevron-left -ml-px"></i>
                </a>
            </li>
            <li>
                <a v-on:click="next(pagination.next)"
                    class="first:ml-0 text-xs font-semibold flex w-8 h-8 mx-1 p-0 rounded-full items-center justify-center leading-tight relative border border-solid border-emerald-500 text-white bg-emerald-500">
                    <i class="fas fa-chevron-right -mr-px"></i>
                </a>
            </li>
        </ul>
    </nav>
</template>

<script>
export default {
    data() {
        return {
            pagination: {
                enabled: false,
                previus: 1,
                next: 2,
                current: 1
            }
        }
    },
    methods: {
        resetFilter() {
            this.action.reset = false
            this.filter = ''
            this.getEntries('', null)
        },
        next(next) {
            this.pagination.next = next + 1
            this.pagination.previus = next - 1
        },
        previus(previus) {
            this.pagination.previus = previus - 1
            this.pagination.next = previus + 1
            if (this.pagination.next == this.pagination.last_page) {
                this.pagination.next = this.pagination.last_page
            }
        },
    }
}
</script>