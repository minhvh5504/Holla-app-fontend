import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LoadingScreen from '@views/LoadingScreen'
import LoginScreen from '@views/LoginScreen'
import RegisterScreen from '@views/RegisterScreen'
import { useEffect, useState } from 'react'

import { AuthProvider, useAuth } from '../contexts/AuthContext'
import DrawerNavigation from './DrawerNavigation'

const Stack = createNativeStackNavigator()

const AuthStack = () => {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  )
}

const AppStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeDrawer" component={DrawerNavigation} />
    </Stack.Navigator>
  )
}

function Navigation() {
  const { isAuthenticated, isLoading } = useAuth()
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (showSplash || isLoading) {
    return <LoadingScreen />
  }

  return isAuthenticated ? <AppStack /> : <AuthStack />
}

export default function RootNavigation() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
    </AuthProvider>
  )
}
