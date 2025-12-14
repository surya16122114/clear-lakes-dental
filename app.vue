<script setup>
useHead({
  title: 'clear-lakes-dental-demo',
  meta: [
    { name: 'description', content: 'Clear Lakes Dental Database Demo Application' }
  ]
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
html {
  margin: 0;
  padding: 0;
  height: 100%;
  background: linear-gradient(to bottom right, #eff6ff, #ecfdf5);
}

body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  height: 100%;
  background: linear-gradient(to bottom right, #eff6ff, #ecfdf5);
}

#__nuxt {
  min-height: 100vh;
  background: linear-gradient(to bottom right, #eff6ff, #ecfdf5);
}
</style>
