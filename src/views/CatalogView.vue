<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import WearCardElement from '../components/WearCardElement.vue';

const route = useRoute();
const products = ref([]);
const loading = ref(true);
const error = ref(null);
const searchQuery = ref('');
const selectedCategory = ref('');
const sortBy = ref('title');
const selectedSizes = ref([]);
const selectedBrands = ref([]);

// Mock данные для фильтров
const sizes = ref(['36.00', '37.00', '38.00', '39.00', '40.00', '41.00', '42.00', '43.00', '44.00', '45.00']);
const brands = ref(['Nike', 'Adidas', 'Puma', 'Reebok', 'New Balance', 'Converse', 'Vans']);

// Получение товаров
async function fetchProducts() {
  try {
    loading.value = true;
    error.value = null;
    const response = await axios.get("http://localhost:5177/api/Products");
    products.value = response.data;
  } catch (err) {
    error.value = err;
    console.error("Ошибка загрузки товаров:", err);
  } finally {
    loading.value = false;
  }
}

// Обработка query параметров при загрузке страницы
onMounted(() => {
  fetchProducts();
  
  if (route.query.category) {
    selectedCategory.value = route.query.category;
  }
});

// Следим за изменениями query параметров
watch(() => route.query, (newQuery) => {
  if (newQuery.category) {
    selectedCategory.value = newQuery.category;
  }
});

// Фильтрация и сортировка товаров
const filteredProducts = computed(() => {
  let filtered = products.value;

  // Фильтрация по поисковому запросу
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(product => 
      product.title?.toLowerCase().includes(query) ||
      product.brand?.toLowerCase().includes(query) ||
      product.model?.toLowerCase().includes(query) ||
      product.category?.toLowerCase().includes(query)
    );
  }

  // Фильтрация по категории
  if (selectedCategory.value) {
    filtered = filtered.filter(product => 
      product.category?.toLowerCase() === selectedCategory.value.toLowerCase()
    );
  }

  // Сортировка
  switch (sortBy.value) {
    case 'price':
      return filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
    case 'price_desc':
      return filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
    case 'title':
      return filtered.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    case 'newest':
      return filtered.sort((a, b) => (b.id || 0) - (a.id || 0));
    default:
      return filtered;
  }
});

// Уникальные категории для фильтра
const uniqueCategories = computed(() => {
  const categories = products.value.map(product => product.category);
  return [...new Set(categories)].sort();
});

// Текущее название категории для заголовка
const currentCategoryTitle = computed(() => {
  if (selectedCategory.value) {
    return selectedCategory.value.charAt(0).toUpperCase() + selectedCategory.value.slice(1);
  }
  return 'Все товары';
});

function clearFilters() {
  searchQuery.value = '';
  selectedCategory.value = '';
  selectedSizes.value = [];
  selectedBrands.value = [];
}

// Функции для работы с фильтрами
const toggleSize = (size) => {
  const index = selectedSizes.value.indexOf(size);
  if (index > -1) {
    selectedSizes.value.splice(index, 1);
  } else {
    selectedSizes.value.push(size);
  }
};

const toggleBrand = (brand) => {
  const index = selectedBrands.value.indexOf(brand);
  if (index > -1) {
    selectedBrands.value.splice(index, 1);
  } else {
    selectedBrands.value.push(brand);
  }
};
</script>

<template>
  <div class="catalog-page">
    <!-- Заголовок и количество товаров -->
    <div class="catalog-header">
      <h1 class="category-title">{{ currentCategoryTitle.toUpperCase() }}</h1>
      <span class="products-count">{{ filteredProducts.length }} товаров</span>
    </div>

    <div class="catalog-layout">
      <!-- Боковая панель с фильтрами -->
      <aside class="filters-sidebar">
        <!-- Фильтр по цене -->
        <div class="filter-group">
          <h3 class="filter-title">ФИЛЬТР ПО ЦЕНЕ</h3>
          <div class="price-filter">
            <input type="range" class="price-range" min="0" max="100000" step="1000" />
            <div class="price-labels">
              <span>0 ₽</span>
              <span>100 000 ₽</span>
            </div>
          </div>
        </div>

        <!-- Фильтр по размерам -->
        <div class="filter-group">
          <h3 class="filter-title">РАЗМЕРЫ (EU)</h3>
          <div class="sizes-grid">
            <button
              v-for="size in sizes"
              :key="size"
              class="size-option"
              :class="{ active: selectedSizes.includes(size) }"
              @click="toggleSize(size)"
            >
              {{ size }}
            </button>
          </div>
        </div>

        <!-- Фильтр по брендам -->
        <div class="filter-group">
          <h3 class="filter-title">БРЕНДЫ</h3>
          <div class="brands-list">
            <label
              v-for="brand in brands"
              :key="brand"
              class="brand-option"
            >
              <input
                type="checkbox"
                :value="brand"
                v-model="selectedBrands"
                class="brand-checkbox"
              />
              <span class="checkmark"></span>
              {{ brand }}
            </label>
          </div>
        </div>
      </aside>

      <!-- Основная область с товарами -->
      <main class="products-main">
        <!-- Панель управления -->
        <div class="controls-panel">
          <div class="search-box">
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Поиск товаров..." 
              class="search-input"
            >
            <button class="search-btn">🔍</button>
          </div>
          <div class="filter-controls">
            <select v-model="selectedCategory" class="category-filter">
              <option value="">Все категории</option>
              <option 
                v-for="category in uniqueCategories" 
                :key="category" 
                :value="category"
              >
                {{ category }}
              </option>
            </select>
            <select v-model="sortBy" class="sort-filter">
              <option value="title">По названию</option>
              <option value="price">По цене (возрастание)</option>
              <option value="price_desc">По цене (убывание)</option>
              <option value="newest">Сначала новые</option>
            </select>
          </div>
        </div>

        <!-- Состояния загрузки и ошибки -->
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Загрузка товаров...</p>
        </div>
        
        <div v-else-if="error" class="error-state">
          <p>Ошибка загрузки: {{ error.message }}</p>
          <button @click="fetchProducts" class="retry-btn">Попробовать снова</button>
        </div>

        <div v-else-if="filteredProducts.length === 0" class="empty-state">
          <p>Товары не найдены</p>
          <button 
            v-if="selectedCategory || searchQuery" 
            @click="clearFilters" 
            class="clear-filters-btn"
          >
            Сбросить фильтры
          </button>
        </div>

        <!-- Сетка товаров -->
        <div v-else class="products-grid">
          <div
            v-for="product in filteredProducts"
            :key="product.id"
            class="product-card"
          >
            <WearCardElement :product="product" />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.catalog-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px;
  min-height: 100vh;
}

.catalog-header {
  margin-bottom: 40px;
  text-align: center;
}

.category-title {
  font-size: 48px;
  font-weight: 700;
  color: #333;
  margin: 0 0 10px 0;
  letter-spacing: 1px;
}

.products-count {
  font-size: 18px;
  color: #666;
  font-weight: 500;
}

.catalog-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 40px;
  align-items: start;
}

/* Стили для боковой панели фильтров */
.filters-sidebar {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 30px;
  position: sticky;
  top: 20px;
}

.filter-group {
  margin-bottom: 40px;
}

.filter-group:last-child {
  margin-bottom: 0;
}

.filter-title {
  font-size: 16px;
  font-weight: 700;
  color: #333;
  margin: 0 0 20px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Стили для фильтра цен */
.price-filter {
  margin-top: 15px;
}

.price-range {
  width: 100%;
  height: 4px;
  background: #e0e0e0;
  border-radius: 2px;
  outline: none;
  -webkit-appearance: none;
}

.price-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  background: #333;
  border-radius: 50%;
  cursor: pointer;
}

.price-range::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background: #333;
  border-radius: 50%;
  cursor: pointer;
  border: none;
}

.price-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 14px;
  color: #666;
}

/* Стили для фильтра размеров */
.sizes-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 15px;
}

.size-option {
  padding: 12px 8px;
  border: 2px solid #e0e0e0;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  transition: all 0.3s ease;
  text-align: center;
}

.size-option:hover {
  border-color: #333;
  transform: translateY(-1px);
}

.size-option.active {
  background: #333;
  color: white;
  border-color: #333;
}

/* Стили для фильтра брендов */
.brands-list {
  margin-top: 15px;
}

.brand-option {
  display: flex;
  align-items: center;
  padding: 12px 0;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  transition: color 0.3s ease;
  position: relative;
}

.brand-option:hover {
  color: #000;
}

.brand-checkbox {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.checkmark {
  position: relative;
  height: 20px;
  width: 20px;
  background-color: white;
  border: 2px solid #e0e0e0;
  border-radius: 4px;
  margin-right: 12px;
  transition: all 0.3s ease;
}

.brand-checkbox:checked ~ .checkmark {
  background-color: #333;
  border-color: #333;
}

.brand-checkbox:checked ~ .checkmark:after {
  content: "";
  position: absolute;
  left: 6px;
  top: 2px;
  width: 6px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

/* Стили для основной области */
.products-main {
  min-height: 600px;
}

.controls-panel {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  gap: 20px;
}

.search-box {
  display: flex;
  flex: 1;
  max-width: 400px;
  position: relative;
}

.search-input {
  flex: 1;
  padding: 12px 50px 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 25px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  border-color: #333;
}

.search-btn {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  transition: background-color 0.3s ease;
}

.search-btn:hover {
  background-color: #f0f0f0;
}

.filter-controls {
  display: flex;
  gap: 15px;
}

.category-filter,
.sort-filter {
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  outline: none;
  transition: border-color 0.3s ease;
  min-width: 180px;
}

.category-filter:focus,
.sort-filter:focus {
  border-color: #333;
}

/* Сетка товаров */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.product-card {
  transition: transform 0.2s ease;
}

.product-card:hover {
  transform: translateY(-2px);
}

/* Состояния загрузки и ошибки */
.loading-state {
  text-align: center;
  padding: 80px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f0f0f0;
  border-top: 4px solid #333;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-state {
  text-align: center;
  padding: 80px 20px;
  background: #fee;
  border-radius: 12px;
  color: #e74c3c;
}

.retry-btn {
  margin-top: 15px;
  padding: 10px 20px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.retry-btn:hover {
  background: #c0392b;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: #f9f9f9;
  border-radius: 12px;
  color: #666;
}

.clear-filters-btn {
  margin-top: 15px;
  padding: 10px 20px;
  background: #333;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.clear-filters-btn:hover {
  background: #555;
}

/* Адаптивность */
@media (max-width: 1024px) {
  .catalog-layout {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .filters-sidebar {
    position: static;
    order: 2;
  }
  
  .products-main {
    order: 1;
  }
}

@media (max-width: 768px) {
  .catalog-page {
    padding: 20px 15px;
  }
  
  .category-title {
    font-size: 36px;
  }
  
  .controls-panel {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-box {
    max-width: none;
  }
  
  .filter-controls {
    justify-content: space-between;
  }
  
  .category-filter,
  .sort-filter {
    flex: 1;
    min-width: auto;
  }
  
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 16px;
  }
  
  .sizes-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
  
  .sizes-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .filter-controls {
    flex-direction: column;
    gap: 10px;
  }
}
</style>