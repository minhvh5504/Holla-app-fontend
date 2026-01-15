# 🚀 Quick Start - JWT Authentication

## ✅ What's Been Set Up

Your React Native app now has a complete JWT authentication system with:

- ✅ JWT token storage and verification
- ✅ Automatic token refresh
- ✅ Protected routes
- ✅ Auth context for global state
- ✅ API service with interceptors
- ✅ TypeScript support

## 📋 Next Steps

### 1. Configure Your API URL

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_API_URL=https://your-backend-api.com/api
```

### 2. Update Your Login Screen

Open `src/views/LoginScreen.tsx` and add the auth logic:

```typescript
import { useAuth } from '../contexts/AuthContext'

// Inside your component:
const { login } = useAuth()

const handleLogin = async () => {
  try {
    await login({ email, password })
    // User will be automatically navigated to home
  } catch (error) {
    Alert.alert('Error', 'Login failed')
  }
}
```

See `src/examples/LoginExample.tsx` for a complete example.

### 3. Update Your Register Screen

Open `src/views/RegisterScreen.tsx`:

```typescript
import { useAuth } from '../contexts/AuthContext'

const { register } = useAuth()

const handleRegister = async () => {
  try {
    await register({ name, email, password })
    // User will be automatically navigated to home
  } catch (error) {
    Alert.alert('Error', 'Registration failed')
  }
}
```

See `src/examples/RegisterExample.tsx` for a complete example.

### 4. Add Logout to Profile Screen

Open `src/views/ProfileScreen.tsx`:

```typescript
import { useAuth } from '../contexts/AuthContext'

const { user, logout } = useAuth()

const handleLogout = async () => {
  await logout()
  // User will be automatically navigated to login
}
```

See `src/examples/ProfileExample.tsx` for a complete example.

### 5. Make Authenticated API Calls

```typescript
import { api } from '@utils/apiService'

// GET request
const fetchData = async () => {
  const response = await api.get('/your-endpoint')
  return response.data
}

// POST request
const postData = async (data) => {
  const response = await api.post('/your-endpoint', data)
  return response.data
}
```

## 🔑 Key Files

| File | Purpose |
|------|---------|
| `src/contexts/AuthContext.tsx` | Auth state management |
| `src/utils/tokenStorage.ts` | Token storage & verification |
| `src/utils/apiService.ts` | API client with JWT interceptors |
| `src/types/auth.types.ts` | TypeScript types |
| `src/navigation/RootNavigation.tsx` | Auth-based routing |

## 🎯 How It Works

1. **App starts** → Checks for stored token
2. **Token valid** → Shows authenticated screens
3. **Token expired** → Attempts refresh
4. **No token** → Shows login screen
5. **User logs in** → Stores tokens → Shows authenticated screens
6. **API call** → Automatically adds token to headers
7. **Token expires** → Automatically refreshes → Retries request
8. **User logs out** → Clears tokens → Shows login screen

## 🧪 Testing

```bash
# Check TypeScript
npx tsc --noEmit

# Run linter
npm run lint
```

## 📚 Full Documentation

See `JWT_AUTH_README.md` for complete documentation including:
- Backend API requirements
- Security features
- Troubleshooting
- Customization options

## 💡 Quick Tips

1. **Test your backend first** - Use Postman to verify endpoints work
2. **Check token format** - Ensure JWT includes `userId`, `email`, `exp`
3. **Handle errors** - Always wrap auth calls in try-catch
4. **Never log tokens** - Remove console.logs in production
5. **Test token refresh** - Verify it works when token expires

## 🐛 Common Issues

**"Network Error"**
- Check your API_BASE_URL is correct
- Ensure backend is running

**"No refresh token available"**
- Verify backend returns both accessToken and refreshToken

**Token not being sent**
- Check AsyncStorage has the token
- Verify Authorization header format

## 🎉 You're Ready!

Your authentication system is fully set up. Just:
1. Configure your API URL
2. Update your Login/Register screens
3. Add logout to Profile
4. Start building!

For questions, see `JWT_AUTH_README.md` for detailed documentation.
