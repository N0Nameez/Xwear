<script setup>
    import { RouterLink, RouterView } from 'vue-router';

    import HeaderElement from './components/HeaderElement.vue'
    import FooterElement from './components/FooterElement.vue'
</script>

<template>
    <HeaderElement/>
    <RouterView/>
    <FooterElement/>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
}

#app {
  min-height: 100vh;
  width: 100%;
  font-family: Arial, sans-serif;
}
</style>
