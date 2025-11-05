<script setup>
import axios from 'axios';
import WearCardElement from './WearCardElement.vue';
import { ref, computed, onMounted, watch } from 'vue';

const props = defineProps({
  categories: {
    type: Array,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  limit: {
    type: Number,
    default: 12
  }
});

const loading = ref(true);
const error = ref(null);
const products = ref([]);
const currentSlide = ref(0);
const itemsPerSlide = ref(4);

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

async function GetWear() {
  try {
    loading.value = true;
    
    const response = await axios.get("http://localhost:5177/api/Products");
    
    let filteredProducts = response.data
      .filter(product => props.categories.includes(product.category));
    
    filteredProducts = shuffleArray(filteredProducts);
    
    filteredProducts = filteredProducts.slice(0, props.limit);
    
    products.value = filteredProducts;
    error.value = null;
  } catch (err) {
    error.value = err;
    console.error("Ошибка загрузки товаров:", err);
  } finally {
    loading.value = false;
  }
}

const chunks = computed(() => {
  const result = [];
  for (let i = 0; i < products.value.length; i += itemsPerSlide.value) {
    result.push(products.value.slice(i, i + itemsPerSlide.value));
  }
  return result;
});

const totalSlides = computed(() => chunks.value.length);

function goToSlide(index) {
  if (index < 0) {
    currentSlide.value = totalSlides.value - 1;
  } else if (index >= totalSlides.value) {
    currentSlide.value = 0;
  } else {
    currentSlide.value = index;
  }
}

function prevSlide() {
  goToSlide(currentSlide.value - 1);
}

function nextSlide() {
  goToSlide(currentSlide.value + 1);
}

watch(() => props.categories, GetWear);

onMounted(() => {
  GetWear();
});
</script>

<template>
  <div class="products-slider">
    <div class="slider-header">
      <h2 class="slider-title">{{ title }}</h2>
      <div class="slider-controls">
        <a class="more-link">Больше товаров ></a>
      </div>
    </div>

    <div v-if="loading" class="loading">Загрузка товаров...</div>
    <div v-else-if="error" class="error">Ошибка загрузки: {{ error.message }}</div>
    <div v-else-if="products.length === 0" class="no-products">
      Нет товаров в категории "{{ title }}"
    </div>
    <div v-else class="slider-container">
      <div class="slider-track" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
        <div v-for="(chunk, index) in chunks" :key="index" class="slide">
          <div class="slide-content">
            <WearCardElement 
              v-for="product in chunk" 
              :key="product.id" 
              :product="product" 
              class="product-item"
            />
          </div>
        </div>
      </div>
      
      <div class="slider-pagination" v-if="totalSlides > 1">
        <button class="slider-btn prev" @click="prevSlide">‹</button>
        <button 
          v-for="index in totalSlides" 
          :key="index" 
          class="pagination-dot" 
          :class="{ active: currentSlide === index - 1 }"
          @click="goToSlide(index - 1)"
        ></button>
        <button class="slider-btn next" @click="nextSlide">›</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.products-slider {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px;
}

.slider-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.slider-title {
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.more-link {
  color: #666;
  text-decoration: none;
  font-size: 16px;
  transition: color 0.3s ease;
}

.more-link:hover {
  color: #333;
}

.slider-container {
  position: relative;
  overflow: hidden;
  border-radius: 16px;
}

.slider-track {
  display: flex;
  transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.slide {
  flex: 0 0 100%;
  min-width: 0;
}

.slide-content {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  padding: 20px 10px;
}

.product-item {
  min-width: 0;
}

.slider-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 40px;
}

.slider-btn {
  width: 48px;
  height: 48px;
  border: 2px solid #333;
  background: white;
  border-radius: 50%;
  cursor: pointer;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.slider-btn:hover {
  background: #333;
  color: white;
  transform: scale(1.05);
}

.pagination-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: none;
  background: #e0e0e0;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.pagination-dot:hover {
  background: #bdbdbd;
  transform: scale(1.1);
}

.pagination-dot.active {
  background: #333;
  transform: scale(1.2);
}

.pagination-dot.active::after {
  content: '';
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border: 2px solid #333;
  border-radius: 50%;
}

.loading, .error, .no-products {
  text-align: center;
  padding: 80px 20px;
  font-size: 20px;
  color: #666;
  background: #f9f9f9;
  border-radius: 12px;
}

.error {
  color: #e74c3c;
  background: #fee;
}

.no-products {
  color: #666;
  background: #f5f5f5;
}
</style>