<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const passwordError = ref('')

watch([password, confirmPassword], () => {
  if (password.value !== confirmPassword.value) {
    passwordError.value = 'Пароли не совпадают'
  } else {
    passwordError.value = ''
  }
})

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    passwordError.value = 'Пароли не совпадают'
    return
  }

  try {
    await authStore.register(email.value, password.value)
    router.push('/')
  } catch (error) {
    console.error('Registration error:', error)
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-header">
        <h1>Регистрация</h1>
        <p>Создайте новый аккаунт</p>
      </div>
      
      <div v-if="authStore.error" class="error-message">
        {{ authStore.error }}
      </div>
      
      <form class="auth-form" @submit.prevent="handleRegister">
        <div class="form-group">
          <label>Email</label>
          <input type="email" v-model="email" required placeholder="Введите ваш email">
        </div>
        
        <div class="form-group">
          <label>Пароль</label>
          <input type="password" v-model="password" required placeholder="Введите ваш пароль">
        </div>

        <div class="form-group">
          <label>Подтвердите пароль</label>
          <input type="password" v-model="confirmPassword" required placeholder="Повторите пароль">
        </div>
        
        <button type="submit" class="auth-submit-btn" :disabled="authStore.loading">
          {{ authStore.loading ? 'Регистрация...' : 'Зарегистрироваться' }}
        </button>
      </form>
      
      <div class="auth-footer">
        <p>Уже есть аккаунт? <router-link to="/login">Войти</router-link></p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  padding: 20px;
}

.auth-container {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.auth-header {
  text-align: center;
  margin-bottom: 30px;
}

.auth-header h1 {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
}

.auth-header p {
  color: #666;
  font-size: 14px;
}

.auth-form {
  margin-bottom: 20px;
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

.auth-submit-btn {
  width: 100%;
  padding: 14px;
  background: #49D0FF;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.auth-submit-btn:hover:not(:disabled) {
  background: #33c4ff;
}

.auth-submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.auth-footer {
  text-align: center;
}

.auth-footer p {
  color: #666;
  font-size: 14px;
}

.auth-footer a {
  color: #49D0FF;
  text-decoration: none;
  font-weight: 600;
}

.auth-footer a:hover {
  text-decoration: underline;
}

.error-message {
  background: #fee;
  color: #e74c3c;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 20px;
  font-size: 14px;
  text-align: center;
}
</style>