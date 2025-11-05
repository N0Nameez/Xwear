<script setup>
import ProductsSlider from '../components/ProductsSlider.vue';
import SliderElements from '../components/SliderElement.vue';
import { categoryGroups } from '@/config/categories';
</script>

<template>
    <SliderElements />
    <div>
        <ProductsSlider 
        v-for="(group, key) in categoryGroups"
        :key="key"
        :categories="group.categories"
        :title="group.title"
        :limit="group.limit"
        />
    </div>
</template>

<style></style>