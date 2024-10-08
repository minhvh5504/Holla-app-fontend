import LogoApple from '@assets/svg/logoApple.svg'
import LogoGoogle from '@assets/svg/logoGoogle.svg'
import BackUpIcon from '@components/BackUp/BackUpIcon'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native'

const RegisterScreen = ({ navigation }: { navigation: any }) => {
  const [checkPasswordVisible, setPasswordVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [userName, setUserName] = useState('')
  const [passWord, setPassWord] = useState('')

  const handleSignup = () => {
    if (!email) {
      Alert.alert('Error', 'Email is required!')
    } else if (!userName) {
      Alert.alert('Error', 'Username is required!')
    } else {
      if (!passWord) {
        Alert.alert('Error', 'Password is required!')
        return
      }
      if (email.length < 8 || email.length > 50) {
        Alert.alert('Error', 'Email must be between 8 and 50 characters!')
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
          Alert.alert('Error', 'Please enter a valid email address!')
        } else if (userName.length < 8 || userName.length > 50) {
          Alert.alert('Error', 'Username must be between 8 and 50 characters!')
        } else {
          if (passWord.length < 8 || passWord.length > 50) {
            Alert.alert('Error', 'Password must be between 8 and 50 characters!')
          } else {
            const usernameRegex = /^[A-Za-z]+$/
            if (!usernameRegex.test(userName)) {
              Alert.alert('Error', 'Username must contain only letters!')
            } else {
              const passwordRegex =
                /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,50}$/
              if (!passwordRegex.test(passWord)) {
                Alert.alert(
                  'Error',
                  'Password must include at least 1 uppercase letter, 1 special character, and both letters and numbers!'
                )
              } else {
                console.log('Signup account successful.')
              }
            }
          }
        }
      }
    }
  }

  const onBackUp = () => {
    navigation.goBack()
  }
  const onLoginGoogle = () => {
    console.log('onLoginGoogle.')
  }
  const onLoginApple = () => {
    console.log('onLoginApple.')
  }
  const onLogin = () => {
    navigation.navigate('Login')
  }

  return (
    <View>
      <View>
        <TouchableOpacity onPress={onBackUp}>
          <BackUpIcon />
        </TouchableOpacity>
        <View className="mt-14 items-center justify-center flex-row gap-10">
          <Text className="color-[#238C98] text-6xl font-bold">Sign up</Text>
        </View>
      </View>
      <View className="mt-12 p-8">
        <MaterialIcons name="email" size={25} className="mt-12 px-8 absolute opacity-60" />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          className=" mt-2 px-10 border-b-2 h-12 border-blue-300"
        />
        <MaterialIcons name="person" size={25} className="mt-36 px-8 absolute opacity-60" />
        <TextInput
          placeholder="Username"
          value={userName}
          onChangeText={setUserName}
          className="mt-12 px-10 border-b-2 h-12 border-blue-300"
        />
        <MaterialIcons name="lock" size={25} className="mt-60 px-8 absolute opacity-60" />
        <TextInput
          placeholder="Password"
          value={passWord}
          onChangeText={setPassWord}
          secureTextEntry={!checkPasswordVisible}
          className="mt-12 pl-10 border-b-2 h-12 border-blue-300"
        />
        <TouchableOpacity
          onPress={() => {
            setPasswordVisible(!checkPasswordVisible)
          }}
        >
          {checkPasswordVisible ? (
            <FontAwesome name="eye" size={25} className="-mt-9 absolute opacity-60 right-2" />
          ) : (
            <FontAwesome name="eye-slash" size={25} className="-mt-9 absolute opacity-60 right-2" />
          )}
        </TouchableOpacity>
      </View>
      <View className="mt-16 items-center flex gap-12">
        <View className="justify-center items-center w-80 h-12 bg-[#238C98] rounded-xl">
          <TouchableOpacity onPress={handleSignup}>
            <Text className="color-white text-lg font-bold">Sign up</Text>
          </TouchableOpacity>
        </View>
        <Text>or</Text>
        <View className="flex-row gap-8">
          <TouchableOpacity onPress={onLoginGoogle}>
            <LogoGoogle />
          </TouchableOpacity>
          <TouchableOpacity onPress={onLoginApple}>
            <LogoApple />
          </TouchableOpacity>
        </View>
      </View>
      <View className="mt-20 flex-row gap-3 justify-center w-11/12">
        <Text>Already have an account?</Text>
        <TouchableOpacity onPress={onLogin}>
          <Text className="font-black color-[#238C98]">Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default RegisterScreen
