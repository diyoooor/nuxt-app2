<template>
  <div class="bg-white rounded-lg shadow-md p-4">
    <h2 class="text-lg font-bold">{{ title }}</h2>
    <p class="text-sm text-gray-500">{{ description }}</p>
    <NuxtLink @click="handleClick" :to="link" class="text-blue-500">View</NuxtLink>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  title: string
  description: string
  link: string
}>()

const handleClick = () => {
  console.log('clicked')
}
</script>

<style>

</style>