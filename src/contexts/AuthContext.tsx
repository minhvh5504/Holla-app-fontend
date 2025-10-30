import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

import { apiService } from '@utils/apiService'
import { tokenStorage } from '@utils/tokenStorage'
import type {
  AuthContextType,
  User,
  LoginCredentials,
  RegisterCredentials,
} from '../types/auth.types'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const accessToken = await tokenStorage.getAccessToken()

      if (!accessToken) {
        setIsLoading(false)
        return
      }

      if (tokenStorage.isTokenExpired(accessToken)) {
        const storedRefreshToken = await tokenStorage.getRefreshToken()
        if (storedRefreshToken) {
          const response = await apiService.refreshToken(storedRefreshToken)
          await tokenStorage.saveTokens(response.tokens)
          setUser(response.user)
        } else {
          await logout()
        }
      } else {
        const decoded = tokenStorage.decodeToken(accessToken)
        if (decoded) {
          setUser({
            id: decoded.userId,
            email: decoded.email,
            name: decoded.email.split('@')[0],
          })
        }
      }
    } catch (error) {
      console.error('Auth check error:', error)
      await logout()
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true)
      const response = await apiService.login(credentials)

      await tokenStorage.saveTokens(response.tokens)
      setUser(response.user)
    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (credentials: RegisterCredentials) => {
    try {
      setIsLoading(true)
      const response = await apiService.register(credentials)

      await tokenStorage.saveTokens(response.tokens)
      setUser(response.user)
    } catch (error) {
      console.error('Register error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      setIsLoading(true)
      await apiService.logout()
      await tokenStorage.clearTokens()
      setUser(null)
    } catch (error) {
      console.error('Logout error:', error)
      await tokenStorage.clearTokens()
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshToken = async () => {
    try {
      const refreshTokenValue = await tokenStorage.getRefreshToken()
      if (!refreshTokenValue) {
        throw new Error('No refresh token available')
      }

      const response = await apiService.refreshToken(refreshTokenValue)
      await tokenStorage.saveTokens(response.tokens)
      setUser(response.user)
    } catch (error) {
      console.error('Token refresh error:', error)
      await logout()
      throw error
    }
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    refreshToken,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
