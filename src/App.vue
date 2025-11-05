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

</style>
