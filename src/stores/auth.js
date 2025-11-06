import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null)
    const isAuthenticated = computed(() => !!user.value)
    const loading = ref(false)
    const error = ref(null)

    const API_BASE = 'http://localhost:5177/api'

    const login = async (email, password) => {
        try {
            loading.value = true
            error.value = null

            const response = await axios.post(`${API_BASE}/user/login`, {
                email,
                password
            })

            user.value = response.data
            localStorage.setItem('user', JSON.stringify(response.data))
            return response.data
        } catch (err) {
            error.value = err.response?.data || 'Ошибка входа'
            throw err
        } finally {
            loading.value = false
        }
    }

    const register = async (email, password) => {
        try {
            loading.value = true
            error.value = null

            const response = await axios.post(`${API_BASE}/user/register`, {
                email,
                password
            })

            user.value = response.data
            localStorage.setItem('user', JSON.stringify(response.data))
            return response.data
        } catch (err) {
            error.value = err.response?.data || 'Ошибка регистрации'
            throw err
        } finally {
            loading.value = false
        }
    }

    const updateProfile = async (profileData) => {
        try {
            loading.value = true
            error.value = null
            
            console.log('Отправка данных профиля на сервер:', profileData)

            const response = await axios.put(`${API_BASE}/user/profile`, profileData)
            
            console.log('Ответ от сервера:', response.data)

            // Обновляем данные пользователя
            user.value = response.data
            localStorage.setItem('user', JSON.stringify(response.data))
            
            return response.data
        } catch (err) {
            console.error('Ошибка в updateProfile:', err)
            error.value = err.response?.data || 'Ошибка обновления профиля'
            throw err
        } finally {
            loading.value = false
        }
    }

    const logout = () => {
        user.value = null
        localStorage.removeItem('user')
    }

    const initialize = () => {
        const savedUser = localStorage.getItem('user')
        if (savedUser) {
            user.value = JSON.parse(savedUser)
        }
    }

    return {
        user,
        isAuthenticated,
        loading,
        error,
        login,
        register,
        updateProfile,
        logout,
        initialize
    }
})