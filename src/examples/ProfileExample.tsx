import React from 'react'
import { View, Text, TouchableOpacity, Alert } from 'react-native'
import { useAuth } from '../contexts/AuthContext'

/**
 * Example Profile Screen Component
 * This demonstrates how to use the useAuth hook to display user info and logout
 * 
 * You can copy this code to your ProfileScreen.tsx file
 */
export default function ProfileExample() {
  const { user, logout, isLoading } = useAuth()

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await logout()
            // Navigation will happen automatically via RootNavigation
          } catch (error) {
            Alert.alert('Error', 'Failed to logout. Please try again.')
          }
        },
      },
    ])
  }

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text>Loading...</Text>
      </View>
    )
  }

  return (
    <View className="flex-1 px-6 py-8 bg-white">
      <Text className="text-3xl font-bold mb-8">Profile</Text>

      <View className="bg-gray-100 rounded-lg p-6 mb-6">
        <Text className="text-gray-600 mb-2">Name</Text>
        <Text className="text-xl font-semibold mb-4">{user?.name || 'N/A'}</Text>

        <Text className="text-gray-600 mb-2">Email</Text>
        <Text className="text-xl font-semibold mb-4">{user?.email || 'N/A'}</Text>

        <Text className="text-gray-600 mb-2">User ID</Text>
        <Text className="text-sm text-gray-500">{user?.id || 'N/A'}</Text>
      </View>

      <TouchableOpacity
        className="bg-red-500 rounded-lg py-4"
        onPress={handleLogout}
        disabled={isLoading}>
        <Text className="text-white text-center font-semibold text-lg">Logout</Text>
      </TouchableOpacity>
    </View>
  )
}
