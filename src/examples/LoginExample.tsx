import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import { useAuth } from '../contexts/AuthContext'

/**
 * Example Login Screen Component
 * This demonstrates how to use the useAuth hook for authentication
 * 
 * You can copy this code to your LoginScreen.tsx file
 */
export default function LoginExample() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }

    try {
      setLoading(true)
      await login({ email, password })
      // Navigation will happen automatically via RootNavigation
    } catch (error: any) {
      Alert.alert(
        'Login Failed',
        error.response?.data?.message || 'Invalid credentials. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className="flex-1 justify-center px-6 bg-white">
      <Text className="text-3xl font-bold mb-8 text-center">Login</Text>

      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3 mb-6"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        className="bg-blue-500 rounded-lg py-4 mb-4"
        onPress={handleLogin}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white text-center font-semibold text-lg">Login</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => {/* Navigate to Register */}}>
        <Text className="text-blue-500 text-center">Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  )
}
