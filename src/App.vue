<template>
    <router-view v-slot="{ Component }">
        <Suspense>
            <component :is="Component" />
        </Suspense>
    </router-view>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { useHead } from '@vueuse/head'

export default defineComponent({
    setup() {
        useHead({
            title: 'AGC Web',
            meta: [
                {
                    name: `description`,
                    content: 'Awsome Google Camera',
                },
            ],
        })
    },
})
</script>
