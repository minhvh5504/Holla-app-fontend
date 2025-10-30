import AsyncStorage from '@react-native-async-storage/async-storage'
import { jwtDecode } from 'jwt-decode'

import type { AuthTokens, DecodedToken } from '../types/auth.types'

const ACCESS_TOKEN_KEY = '@auth_access_token'
const REFRESH_TOKEN_KEY = '@auth_refresh_token'

export const tokenStorage = {
  async saveTokens(tokens: AuthTokens): Promise<void> {
    try {
      await AsyncStorage.multiSet([
        [ACCESS_TOKEN_KEY, tokens.accessToken],
        [REFRESH_TOKEN_KEY, tokens.refreshToken],
      ])
    } catch (error) {
      console.error('Error saving tokens:', error)
      throw error
    }
  },

  async getAccessToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(ACCESS_TOKEN_KEY)
    } catch (error) {
      console.error('Error getting access token:', error)
      return null
    }
  },

  async getRefreshToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(REFRESH_TOKEN_KEY)
    } catch (error) {
      console.error('Error getting refresh token:', error)
      return null
    }
  },

  async clearTokens(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY])
    } catch (error) {
      console.error('Error clearing tokens:', error)
      throw error
    }
  },

  decodeToken(token: string): DecodedToken | null {
    try {
      return jwtDecode<DecodedToken>(token)
    } catch (error) {
      console.error('Error decoding token:', error)
      return null
    }
  },

  isTokenExpired(token: string): boolean {
    try {
      const decoded = this.decodeToken(token)
      if (!decoded) return true

      const currentTime = Date.now() / 1000
      return decoded.exp < currentTime
    } catch (error) {
      return true
    }
  },

  async isAuthenticated(): Promise<boolean> {
    try {
      const accessToken = await this.getAccessToken()
      if (!accessToken) return false

      return !this.isTokenExpired(accessToken)
    } catch {
      return false
    }
  },
}
