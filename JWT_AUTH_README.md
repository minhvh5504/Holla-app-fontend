# JWT Authentication Setup

This project now includes a complete JWT authentication system with token verification, automatic refresh, and secure storage.

## 📁 File Structure

```
src/
├── types/
│   └── auth.types.ts          # TypeScript interfaces for auth
├── utils/
│   ├── tokenStorage.ts        # JWT token storage & verification
│   └── apiService.ts          # API client with JWT interceptors
├── contexts/
│   └── AuthContext.tsx        # Auth state management
├── examples/
│   ├── LoginExample.tsx       # Example login implementation
│   ├── RegisterExample.tsx    # Example register implementation
│   └── ProfileExample.tsx     # Example profile with logout
└── navigation/
    └── RootNavigation.tsx     # Updated with auth routing
```

## 🚀 Features

- ✅ JWT token storage using AsyncStorage
- ✅ Automatic token refresh on 401 errors
- ✅ Token expiration checking
- ✅ Axios interceptors for automatic token injection
- ✅ Protected routes based on authentication status
- ✅ TypeScript support with full type safety
- ✅ Context API for global auth state
- ✅ Automatic navigation based on auth status

## 🔧 Configuration

### 1. Set Your API URL

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_API_URL=https://your-api-url.com/api
```

Or update the default URL in `src/utils/apiService.ts`:

```typescript
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://your-api-url.com/api'
```

### 2. Backend API Requirements

Your backend should provide these endpoints:

#### POST `/auth/login`
```json
Request:
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "User Name",
    "avatar": "optional-url"
  },
  "tokens": {
    "accessToken": "jwt-access-token",
    "refreshToken": "jwt-refresh-token"
  }
}
```

#### POST `/auth/register`
```json
Request:
{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name"
}

Response: Same as login
```

#### POST `/auth/refresh`
```json
Request:
{
  "refreshToken": "jwt-refresh-token"
}

Response: Same as login
```

#### POST `/auth/logout`
```json
Request: (Authorization header with Bearer token)
Response: 200 OK
```

### 3. JWT Token Format

Your JWT access token should include these claims:

```json
{
  "userId": "user-id",
  "email": "user@example.com",
  "exp": 1234567890,
  "iat": 1234567890
}
```

## 📖 Usage

### Using Auth in Components

```typescript
import { useAuth } from '../contexts/AuthContext'

function MyComponent() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth()

  // Check if user is authenticated
  if (isAuthenticated) {
    console.log('User:', user)
  }

  // Login
  const handleLogin = async () => {
    try {
      await login({ email: 'user@example.com', password: 'password' })
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  // Logout
  const handleLogout = async () => {
    await logout()
  }

  return (
    // Your component JSX
  )
}
```

### Making Authenticated API Calls

```typescript
import { api } from '@utils/apiService'

// The token is automatically added to headers
async function fetchUserData() {
  try {
    const response = await api.get('/user/profile')
    return response.data
  } catch (error) {
    console.error('API call failed:', error)
  }
}

// POST request
async function updateProfile(data) {
  const response = await api.post('/user/profile', data)
  return response.data
}
```

### Implementing Login Screen

See `src/examples/LoginExample.tsx` for a complete example. Key points:

```typescript
import { useAuth } from '../contexts/AuthContext'

const { login } = useAuth()

const handleLogin = async () => {
  try {
    await login({ email, password })
    // User will be automatically navigated to authenticated screens
  } catch (error) {
    // Handle error
  }
}
```

### Implementing Register Screen

See `src/examples/RegisterExample.tsx` for a complete example.

### Implementing Profile/Logout

See `src/examples/ProfileExample.tsx` for a complete example.

## 🔐 Security Features

### Token Storage
- Tokens are stored securely using `@react-native-async-storage/async-storage`
- Tokens are cleared on logout
- Access token and refresh token are stored separately

### Token Verification
- Automatic token expiration checking
- JWT decoding to extract user information
- Token validation before API calls

### Automatic Token Refresh
- When API returns 401, automatically attempts to refresh token
- Failed requests are queued and retried after successful refresh
- If refresh fails, user is logged out automatically

### API Security
- All authenticated requests include `Authorization: Bearer <token>` header
- Axios interceptors handle token injection automatically
- Request/response interceptors for error handling

## 🎯 How It Works

### Authentication Flow

1. **Initial Load**
   - App checks for stored access token
   - If token exists and is valid, user is authenticated
   - If token is expired, attempts to refresh
   - If no token or refresh fails, shows login screen

2. **Login**
   - User enters credentials
   - API call to `/auth/login`
   - Tokens are stored in AsyncStorage
   - User state is updated
   - Navigation automatically switches to authenticated screens

3. **API Calls**
   - Access token is automatically added to request headers
   - If API returns 401, token refresh is attempted
   - After successful refresh, original request is retried
   - If refresh fails, user is logged out

4. **Logout**
   - API call to `/auth/logout`
   - Tokens are cleared from AsyncStorage
   - User state is reset
   - Navigation automatically switches to login screen

## 🧪 Testing

### Check TypeScript Compilation
```bash
npx tsc --noEmit
```

### Run Linting
```bash
npm run lint
```

## 📝 Customization

### Modify Token Storage Keys
Edit `src/utils/tokenStorage.ts`:
```typescript
const ACCESS_TOKEN_KEY = '@your_app_access_token'
const REFRESH_TOKEN_KEY = '@your_app_refresh_token'
```

### Change API Timeout
Edit `src/utils/apiService.ts`:
```typescript
this.axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  // ...
})
```

### Add Custom Headers
Edit `src/utils/apiService.ts`:
```typescript
headers: {
  'Content-Type': 'application/json',
  'X-Custom-Header': 'value',
}
```

## 🐛 Troubleshooting

### "No refresh token available"
- Ensure your backend returns both accessToken and refreshToken
- Check that tokens are being saved correctly

### "Network Error"
- Verify your API_BASE_URL is correct
- Check that your backend is running
- Ensure CORS is configured on your backend

### Token not being sent
- Check that the token is stored: `await tokenStorage.getAccessToken()`
- Verify the Authorization header format: `Bearer <token>`

### Auto-refresh not working
- Ensure your backend returns 401 for expired tokens
- Check that refresh endpoint returns the same response format as login

## 📚 Additional Resources

- [JWT.io](https://jwt.io/) - JWT debugger
- [Axios Documentation](https://axios-http.com/)
- [React Navigation](https://reactnavigation.org/)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)

## 🤝 Integration Checklist

- [ ] Set API_BASE_URL in environment variables
- [ ] Update backend endpoints if different from defaults
- [ ] Implement login UI in LoginScreen.tsx
- [ ] Implement register UI in RegisterScreen.tsx
- [ ] Add logout button in ProfileScreen.tsx
- [ ] Test login flow
- [ ] Test registration flow
- [ ] Test token refresh
- [ ] Test logout flow
- [ ] Test protected API calls

## 💡 Tips

1. **Development**: Use a tool like Postman to test your backend endpoints first
2. **Debugging**: Check AsyncStorage contents using React Native Debugger
3. **Security**: Never log tokens in production
4. **Testing**: Test with expired tokens to verify refresh logic
5. **Error Handling**: Always wrap auth calls in try-catch blocks
