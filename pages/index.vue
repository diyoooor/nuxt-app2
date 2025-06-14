<template>
  <div>
    <h1 class="text-3xl font-bold underline">Hello World</h1>
    <section class="grid grid-cols-3 gap-4">
      <AppCard v-for="card in cards" :key="card.title" :title="card.title" :description="card.description" :link="card.link" />
    </section>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'default'
})
const cards = [
  {
    title: 'Card 1',
    description: 'This is the first card',
    link: '/travel'
  },
  {
    title: 'Card 2',
    description: 'This is the second card',
    link: '/card2'
  },
  {
    title: 'Card 3',
    description: 'This is the third card',
    link: '/card3'
  }
]
</script>

<style>

</style>