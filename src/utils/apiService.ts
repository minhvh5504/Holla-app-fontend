import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'

import { tokenStorage } from './tokenStorage'
import type { AuthResponse, LoginCredentials, RegisterCredentials } from '../types/auth.types'

// Configure your API base URL here
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://your-api-url.com/api'

class ApiService {
  private axiosInstance: AxiosInstance
  private isRefreshing = false
  private failedQueue: {
    resolve: (value?: unknown) => void
    reject: (reason?: unknown) => void
  }[] = []

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    this.axiosInstance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const token = await tokenStorage.getAccessToken()
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error: AxiosError) => {
        return Promise.reject(error)
      }
    )

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject })
            })
              .then(() => {
                return this.axiosInstance(originalRequest)
              })
              .catch((err) => {
                return Promise.reject(err)
              })
          }

          originalRequest._retry = true
          this.isRefreshing = true

          try {
            const refreshToken = await tokenStorage.getRefreshToken()
            if (!refreshToken) {
              throw new Error('No refresh token available')
            }

            const response = await axios.post<AuthResponse>(`${API_BASE_URL}/auth/refresh`, {
              refreshToken,
            })

            const { tokens } = response.data
            await tokenStorage.saveTokens(tokens)

            this.processQueue(null)
            this.isRefreshing = false

            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`
            }

            return this.axiosInstance(originalRequest)
          } catch (refreshError) {
            this.processQueue(refreshError)
            this.isRefreshing = false
            await tokenStorage.clearTokens()
            return Promise.reject(refreshError)
          }
        }

        return Promise.reject(error)
      }
    )
  }

  private processQueue(error: unknown) {
    this.failedQueue.forEach((promise) => {
      if (error) {
        promise.reject(error)
      } else {
        promise.resolve()
      }
    })

    this.failedQueue = []
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.axiosInstance.post<AuthResponse>('/auth/login', credentials)
    return response.data
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await this.axiosInstance.post<AuthResponse>('/auth/register', credentials)
    return response.data
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await this.axiosInstance.post<AuthResponse>('/auth/refresh', {
      refreshToken,
    })
    return response.data
  }

  async logout(): Promise<void> {
    try {
      await this.axiosInstance.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance
  }
}

export const apiService = new ApiService()
export const api = apiService.getAxiosInstance()
