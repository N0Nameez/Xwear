<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';


const API_BASE = 'http://localhost:5177/api'
const route = useRoute();
const router = useRouter();
const product = ref({});
const loading = ref(true);
const error = ref(null);
const selectedImageIndex = ref(0);
const selectedSize = ref('');
const quantity = ref(1);

const sizes = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];

const productTitle = computed(() => {
    return product.value.title || `${product.value.brand || ''} ${product.value.model || ''}`.trim();
});

const formattedPrice = computed(() => {
    return product.value.price ? `${product.value.price} ₽` : 'Цена не указана';
});

const mainImage = computed(() => {
    if (product.value.images && product.value.images.length > 0) {
        return product.value.images[selectedImageIndex.value];
    }
    return product.value.imageUrl;
});

async function fetchProduct() {
    try {
        loading.value = true;
        error.value = null;
        const response = await axios.get(`http://localhost:5177/api/Products/${route.params.id}`);
        product.value = response.data;
    } catch (err) {
        error.value = err;
        console.error("Ошибка загрузки товара:", err);
    } finally {
        loading.value = false;
    }
}

function selectImage(index) {
    selectedImageIndex.value = index;
}

function selectSize(size) {
    selectedSize.value = size;
}

async function addToCart() {
    if (!selectedSize.value) {
        alert('Пожалуйста, выберите размер');
        return;
    }
    console.log('Добавлено в корзину:', {
        product: product.value,
        size: selectedSize.value,
        quantity: quantity.value
    });

    console.log(product.value.id);

    const id = product.value.id
    const response = await axios.post(`${API_BASE}/Products/buy`, {
        id
    })

    console.log(response.data);

    alert(response.data);
}

function incrementQuantity() {
    quantity.value++;
}

function decrementQuantity() {
    if (quantity.value > 1) {
        quantity.value--;
    }
}

onMounted(() => {
    fetchProduct();
});
</script>

<template>
    <div class="product-page">
        <div class="breadcrumb">
            <button @click="router.back()" class="back-button">← Назад</button>
        </div>

        <div v-if="loading" class="loading-state">
            <div class="loading-spinner"></div>
            <p>Загрузка товара...</p>
        </div>

        <div v-else-if="error" class="error-state">
            <p>Ошибка загрузки товара: {{ error.message }}</p>
            <button @click="fetchProduct" class="retry-btn">Попробовать снова</button>
        </div>

        <div v-else-if="product" class="product-content">
            <div class="product-gallery">
                <div class="main-image">
                    <img :src="mainImage" :alt="productTitle" class="product-image" />
                </div>
                <div v-if="product.images && product.images.length > 1" class="image-thumbnails">
                    <div
                        v-for="(image, index) in product.images"
                        :key="index"
                        class="thumbnail"
                        :class="{ active: selectedImageIndex === index }"
                        @click="selectImage(index)"
                    >
                        <img :src="image" :alt="`${productTitle} ${index + 1}`" />
                    </div>
                </div>
            </div>

            <div class="product-info">
                <h1 class="product-title">{{ productTitle }}</h1>
                <p class="product-category">{{ product.category }}</p>
                <p class="product-price">{{ formattedPrice }}</p>

                <div class="size-selection">
                    <h3>Выберите размер:</h3>
                    <div class="size-options">
                        <button
                            v-for="size in sizes"
                            :key="size"
                            class="size-option"
                            :class="{ active: selectedSize === size }"
                            @click="selectSize(size)"
                        >
                            {{ size }}
                        </button>
                    </div>
                </div>

                <div class="quantity-selection">
                    <h3>Количество:</h3>
                    <div class="quantity-controls">
                        <button @click="decrementQuantity" class="quantity-btn">-</button>
                        <span class="quantity-display">{{ quantity }}</span>
                        <button @click="incrementQuantity" class="quantity-btn">+</button>
                    </div>
                </div>

                <button @click="addToCart" class="add-to-cart-btn">Добавить в корзину</button>

                <div class="product-description">
                    <h3>Описание товара</h3>
                    <p>{{ product.description || 'Описание товара скоро появится.' }}</p>
                </div>

                <div class="product-details">
                    <h3>Детали</h3>
                    <div class="details-grid">
                        <div class="detail-item">
                            <span class="detail-label">Бренд:</span>
                            <span class="detail-value">{{ product.brand || 'Не указан' }}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Модель:</span>
                            <span class="detail-value">{{ product.model || 'Не указана' }}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Категория:</span>
                            <span class="detail-value">{{ product.category || 'Не указана' }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.product-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 20px;
    min-height: 100vh;
}

.breadcrumb {
    margin-bottom: 30px;
}

.back-button {
    background: none;
    border: 2px solid #333;
    color: #333;
    padding: 10px 20px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 600;
    transition: all 0.3s ease;
}

.back-button:hover {
    background: #333;
    color: white;
}

.loading-state,
.error-state {
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

.retry-btn {
    padding: 10px 20px;
    background: #333;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.retry-btn:hover {
    background: #555;
}

.product-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: start;
}

.product-gallery {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.main-image {
    width: 100%;
    border-radius: 12px;
    overflow: hidden;
    background: #f8f9fa;
}

.product-image {
    width: 100%;
    height: 500px;
    object-fit: contain;
}

.image-thumbnails {
    display: flex;
    gap: 10px;
    overflow-x: auto;
    padding: 10px 0;
}

.thumbnail {
    width: 80px;
    height: 80px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    transition: border-color 0.3s ease;
    flex-shrink: 0;
}

.thumbnail.active {
    border-color: #333;
}

.thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.product-info {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.product-title {
    font-size: 32px;
    font-weight: 700;
    color: #333;
    margin: 0;
    line-height: 1.2;
}

.product-category {
    font-size: 16px;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin: 0;
}

.product-price {
    font-size: 28px;
    font-weight: 700;
    color: #000;
    margin: 0;
}

.size-selection h3,
.quantity-selection h3 {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin: 0 0 15px 0;
}

.size-options {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 10px;
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

.quantity-controls {
    display: flex;
    align-items: center;
    gap: 15px;
}

.quantity-btn {
    width: 40px;
    height: 40px;
    border: 2px solid #e0e0e0;
    background: white;
    border-radius: 8px;
    cursor: pointer;
    font-size: 18px;
    font-weight: 600;
    color: #333;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.quantity-btn:hover {
    border-color: #333;
    background: #f8f9fa;
}

.quantity-display {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    min-width: 40px;
    text-align: center;
}

.add-to-cart-btn {
    background: #333;
    color: white;
    border: none;
    padding: 16px 32px;
    border-radius: 8px;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s ease;
    margin-top: 10px;
}

.add-to-cart-btn:hover {
    background: #555;
}

.add-to-cart-btn:active {
    transform: translateY(1px);
}

.product-description,
.product-details {
    padding-top: 24px;
    border-top: 1px solid #e0e0e0;
}

.product-description h3,
.product-details h3 {
    font-size: 20px;
    font-weight: 600;
    color: #333;
    margin: 0 0 15px 0;
}

.product-description p {
    line-height: 1.6;
    color: #666;
    margin: 0;
}

.details-grid {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.detail-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
}

.detail-label {
    font-weight: 600;
    color: #333;
}

.detail-value {
    color: #666;
}

@media (max-width: 1024px) {
    .product-content {
        gap: 40px;
    }
}

@media (max-width: 768px) {
    .product-page {
        padding: 20px 15px;
    }

    .product-content {
        grid-template-columns: 1fr;
        gap: 30px;
    }

    .product-image {
        height: 400px;
    }

    .product-title {
        font-size: 24px;
    }

    .product-price {
        font-size: 24px;
    }

    .size-options {
        grid-template-columns: repeat(4, 1fr);
    }

    .add-to-cart-btn {
        padding: 14px 24px;
        font-size: 16px;
    }
}

@media (max-width: 480px) {
    .size-options {
        grid-template-columns: repeat(3, 1fr);
    }

    .image-thumbnails {
        justify-content: center;
    }
}
</style>