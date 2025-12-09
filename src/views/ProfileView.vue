<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const editData = ref({
  name: '',
  email: '',
  currentPassword: '',
  newPassword: ''
})

const orders = ref([])
const loading = ref(false)

onMounted(() => {
  console.log('=== PROFILE MOUNTED ===')
  console.log('authStore.user:', authStore.user)
  console.log('authStore.isAuthenticated:', authStore.isAuthenticated)
  console.log('localStorage user:', localStorage.getItem('user'))
  
  if (!authStore.isAuthenticated) {
    console.log('Not authenticated, redirecting to login')
    router.push('/login')
    return
  }
  
  if (authStore.user) {
    console.log('User data available, keys:', Object.keys(authStore.user))
    console.log('User name:', authStore.user.name)
    console.log('User email:', authStore.user.email)
    console.log('User id:', authStore.user.id)
    
    editData.value.name = authStore.user.name || ''
    editData.value.email = authStore.user.email || ''
  } else {
    console.log('No user data in authStore')
  }
})

const updateProfile = async () => {
  if (editData.value.newPassword && !editData.value.currentPassword) {
    alert('Для изменения пароля введите текущий пароль')
    return
  }
  
  if (!editData.value.newPassword && editData.value.currentPassword) {
    alert('Введите новый пароль')
    return
  }

  console.log('updateProfile called, editData:', editData.value)
  loading.value = true
  
  try {
    const profileData = {
      UserId: authStore.user.id,
      Name: editData.value.name,
      Email: editData.value.email,
      CurrentPassword: editData.value.currentPassword,
      NewPassword: editData.value.newPassword
    }

    console.log('Отправка данных на сервер:', profileData)
    const updatedUser = await authStore.updateProfile(profileData)
    
    console.log('Профиль успешно обновлен:', updatedUser)

    editData.value.name = updatedUser.name || ''
    editData.value.email = updatedUser.email || ''

    editData.value.currentPassword = ''
    editData.value.newPassword = ''
    
    alert('Профиль успешно обновлен!')
    
  } catch (error) {
    console.error('Ошибка обновления профиля:', error)
    const errorMessage = error.response?.data || error.message || 'Ошибка обновления профиля'
    alert(errorMessage)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="profile-page">
    <div class="profile-container">
      <div class="profile-header">
        <h1>Профиль пользователя</h1>
        <p>Управление вашими данными</p>
      </div>

      <div v-if="authStore.user && authStore.user.id" class="profile-content">
        <div class="profile-section">
          <h2>Личная информация</h2>
          <div class="user-info">
            <div class="info-item">
              <label>Имя:</label>
              <span>{{ authStore.user.name }}</span>
            </div>
            <div class="info-item">
              <label>Email:</label>
              <span>{{ authStore.user.email }}</span>
            </div>
            <div class="info-item">
              <label>ID:</label>
              <span>#{{ authStore.user.id }}</span>
            </div>
          </div>
        </div>
        <div class="profile-section">
          <h2>Редактировать профиль</h2>
          <form class="edit-form" @submit.prevent="updateProfile">
            <div class="form-group">
              <label for="name">Имя</label>
              <input 
                type="text" 
                id="name" 
                v-model="editData.name" 
                placeholder="Введите ваше имя"
              >
            </div>
            
            <div class="form-group">
              <label for="email">Email</label>
              <input 
                type="email" 
                id="email" 
                v-model="editData.email" 
                placeholder="Введите ваш email"
              >
            </div>

            <div class="form-group">
              <label for="currentPassword">Текущий пароль</label>
              <input 
                type="password" 
                id="currentPassword" 
                v-model="editData.currentPassword" 
                placeholder="Введите текущий пароль"
              >
            </div>

            <div class="form-group">
              <label for="newPassword">Новый пароль</label>
              <input 
                type="password" 
                id="newPassword" 
                v-model="editData.newPassword" 
                placeholder="Введите новый пароль"
              >
            </div>

            <button type="submit" class="save-btn" :disabled="loading">
              {{ loading ? 'Сохранение...' : 'Сохранить изменения' }}
            </button>
          </form>
        </div>

        <div class="profile-section">
          <h2>История заказов</h2>
          <div class="orders-list">
            <div class="empty-orders" v-if="orders.length === 0">
              <p>У вас пока нет заказов</p>
              <router-link to="/catalog" class="browse-catalog">Перейти в каталог</router-link>
            </div>
            <div v-else class="order-item" v-for="order in orders" :key="order.id">
            </div>
          </div>
        </div>
      </div>

      <div v-else class="loading">
        Загрузка профиля...
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: #f8f9fa;
  padding: 40px 20px;
}

.profile-container {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.profile-header {
  background: linear-gradient(135deg, #121214 0%, #1a1a1c 100%);
  color: white;
  padding: 40px;
  text-align: center;
}

.profile-header h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
  font-weight: 700;
}

.profile-header p {
  color: #D4D4DD;
  font-size: 1.1rem;
}

.profile-content {
  padding: 40px;
}

.profile-section {
  margin-bottom: 40px;
  padding-bottom: 30px;
  border-bottom: 1px solid #e9ecef;
}

.profile-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.profile-section h2 {
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #333;
  font-weight: 600;
}

.user-info {
  display: grid;
  gap: 15px;
}

.info-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f8f9fa;
}

.info-item:last-child {
  border-bottom: none;
}

.info-item label {
  font-weight: 600;
  color: #555;
  min-width: 120px;
}

.info-item span {
  color: #333;
}

.edit-form {
  max-width: 500px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #49D0FF;
}

.save-btn {
  background: #49D0FF;
  color: white;
  border: none;
  padding: 14px 30px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.save-btn:hover:not(:disabled) {
  background: #33c4ff;
}

.save-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.empty-orders {
  text-align: center;
  padding: 40px;
  color: #666;
}

.browse-catalog {
  display: inline-block;
  margin-top: 15px;
  color: #49D0FF;
  text-decoration: none;
  font-weight: 600;
}

.browse-catalog:hover {
  text-decoration: underline;
}

.loading {
  text-align: center;
  padding: 60px;
  color: #666;
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .profile-content {
    padding: 20px;
  }
  
  .profile-header {
    padding: 30px 20px;
  }
  
  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
}
</style>