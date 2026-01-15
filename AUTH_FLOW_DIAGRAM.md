# JWT Authentication Flow Diagram

## 🔄 Complete Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         APP STARTUP                              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    ┌─────────────────┐
                    │  AuthProvider   │
                    │  initializes    │
                    └─────────────────┘
                              ↓
                    ┌─────────────────┐
                    │ Check AsyncStorage│
                    │  for tokens     │
                    └─────────────────┘
                              ↓
                    ┌─────────────────┐
                    │  Token exists?  │
                    └─────────────────┘
                       ↙            ↘
                    YES              NO
                     ↓                ↓
            ┌──────────────┐   ┌──────────────┐
            │ Token valid? │   │ Show Login   │
            └──────────────┘   │   Screen     │
                 ↙      ↘       └──────────────┘
              YES        NO
               ↓          ↓
        ┌──────────┐  ┌──────────┐
        │   Show   │  │  Refresh │
        │   Home   │  │  Token   │
        └──────────┘  └──────────┘
                           ↓
                    ┌──────────────┐
                    │  Success?    │
                    └──────────────┘
                       ↙        ↘
                    YES          NO
                     ↓            ↓
              ┌──────────┐  ┌──────────┐
              │   Show   │  │  Logout  │
              │   Home   │  │ & Login  │
              └──────────┘  └──────────┘
```

## 🔐 Login Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER LOGIN                               │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    ┌─────────────────┐
                    │  User enters    │
                    │ email/password  │
                    └─────────────────┘
                              ↓
                    ┌─────────────────┐
                    │  Call login()   │
                    │  from useAuth   │
                    └─────────────────┘
                              ↓
                    ┌─────────────────┐
                    │ POST /auth/login│
                    └─────────────────┘
                              ↓
                    ┌─────────────────┐
                    │   Success?      │
                    └─────────────────┘
                       ↙            ↘
                    YES              NO
                     ↓                ↓
            ┌──────────────┐   ┌──────────────┐
            │ Save tokens  │   │ Show error   │
            │ to AsyncStorage│  │   message    │
            └──────────────┘   └──────────────┘
                     ↓
            ┌──────────────┐
            │  Set user    │
            │  in context  │
            └──────────────┘
                     ↓
            ┌──────────────┐
            │  Navigate    │
            │  to Home     │
            └──────────────┘
```

## 📡 API Call Flow with Token Refresh

```
┌─────────────────────────────────────────────────────────────────┐
│                      API REQUEST                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    ┌─────────────────┐
                    │ Axios Request   │
                    │  Interceptor    │
                    └─────────────────┘
                              ↓
                    ┌─────────────────┐
                    │  Get access     │
                    │  token from     │
                    │  AsyncStorage   │
                    └─────────────────┘
                              ↓
                    ┌─────────────────┐
                    │  Add Bearer     │
                    │  token to       │
                    │  headers        │
                    └─────────────────┘
                              ↓
                    ┌─────────────────┐
                    │  Send request   │
                    │  to API         │
                    └─────────────────┘
                              ↓
                    ┌─────────────────┐
                    │  Response?      │
                    └─────────────────┘
                       ↙            ↘
                   200 OK          401
                     ↓              ↓
            ┌──────────────┐  ┌──────────────┐
            │   Return     │  │  Is already  │
            │   data       │  │ refreshing?  │
            └──────────────┘  └──────────────┘
                                   ↙      ↘
                                 YES      NO
                                  ↓        ↓
                         ┌──────────┐  ┌──────────┐
                         │   Add    │  │  Start   │
                         │ to queue │  │ refresh  │
                         └──────────┘  └──────────┘
                                            ↓
                                   ┌──────────────┐
                                   │ POST /auth/  │
                                   │   refresh    │
                                   └──────────────┘
                                            ↓
                                   ┌──────────────┐
                                   │  Success?    │
                                   └──────────────┘
                                      ↙        ↘
                                   YES          NO
                                    ↓            ↓
                           ┌──────────────┐  ┌──────────┐
                           │ Save new     │  │  Logout  │
                           │   tokens     │  │   user   │
                           └──────────────┘  └──────────┘
                                    ↓
                           ┌──────────────┐
                           │ Process      │
                           │  queued      │
                           │  requests    │
                           └──────────────┘
                                    ↓
                           ┌──────────────┐
                           │  Retry       │
                           │  original    │
                           │  request     │
                           └──────────────┘
```

## 🚪 Logout Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER LOGOUT                              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    ┌─────────────────┐
                    │  User clicks    │
                    │  logout button  │
                    └─────────────────┘
                              ↓
                    ┌─────────────────┐
                    │  Call logout()  │
                    │  from useAuth   │
                    └─────────────────┘
                              ↓
                    ┌─────────────────┐
                    │ POST /auth/logout│
                    │ (optional)      │
                    └─────────────────┘
                              ↓
                    ┌─────────────────┐
                    │  Clear tokens   │
                    │  from AsyncStorage│
                    └─────────────────┘
                              ↓
                    ┌─────────────────┐
                    │  Clear user     │
                    │  from context   │
                    └─────────────────┘
                              ↓
                    ┌─────────────────┐
                    │  Navigate to    │
                    │  Login screen   │
                    └─────────────────┘
```

## 🔄 Token Refresh Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│                    TOKEN LIFECYCLE                               │
└─────────────────────────────────────────────────────────────────┘

Access Token (Short-lived: 15 min - 1 hour)
├── Used for API requests
├── Stored in AsyncStorage
├── Checked before each request
└── Refreshed when expired

Refresh Token (Long-lived: 7-30 days)
├── Used to get new access token
├── Stored in AsyncStorage
├── Sent to /auth/refresh endpoint
└── Cleared on logout

Token Refresh Triggers:
1. API returns 401 Unauthorized
2. Access token expired (checked before request)
3. App startup with expired access token

Refresh Process:
1. Detect expired/invalid access token
2. Get refresh token from storage
3. Call /auth/refresh endpoint
4. Receive new access + refresh tokens
5. Save new tokens to storage
6. Retry failed requests
7. Continue normal operation

If Refresh Fails:
1. Clear all tokens
2. Reset user state
3. Navigate to login
4. User must re-authenticate
```

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      COMPONENT LAYER                             │
│  LoginScreen  │  RegisterScreen  │  ProfileScreen  │  HomeScreen │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      CONTEXT LAYER                               │
│                      AuthContext                                 │
│  - user state                                                    │
│  - isAuthenticated                                               │
│  - login(), register(), logout()                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      SERVICE LAYER                               │
│  apiService          │         tokenStorage                      │
│  - login()           │         - saveTokens()                    │
│  - register()        │         - getAccessToken()                │
│  - refreshToken()    │         - getRefreshToken()               │
│  - logout()          │         - clearTokens()                   │
│  - axios instance    │         - isTokenExpired()                │
│  - interceptors      │         - decodeToken()                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      STORAGE LAYER                               │
│                    AsyncStorage                                  │
│  - @auth_access_token                                            │
│  - @auth_refresh_token                                           │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND API                                 │
│  POST /auth/login                                                │
│  POST /auth/register                                             │
│  POST /auth/refresh                                              │
│  POST /auth/logout                                               │
│  GET  /protected-endpoints                                       │
└─────────────────────────────────────────────────────────────────┘
```

## 🔒 Security Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      SECURITY MEASURES                           │
└─────────────────────────────────────────────────────────────────┘

1. Token Storage
   ├── AsyncStorage (encrypted on device)
   ├── Separate access & refresh tokens
   └── Cleared on logout

2. Token Transmission
   ├── HTTPS only (in production)
   ├── Authorization: Bearer header
   └── Never in URL parameters

3. Token Validation
   ├── JWT signature verification (backend)
   ├── Expiration checking (client & server)
   └── Decode and validate claims

4. Token Refresh
   ├── Automatic on expiration
   ├── Queue requests during refresh
   └── Logout on refresh failure

5. API Security
   ├── All requests authenticated
   ├── 401 handling with auto-refresh
   └── Timeout protection (10s default)

6. Error Handling
   ├── Network errors caught
   ├── Invalid tokens handled
   └── User feedback provided
```

## 📱 Navigation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    NAVIGATION STRUCTURE                          │
└─────────────────────────────────────────────────────────────────┘

RootNavigation
├── AuthProvider (wraps everything)
└── NavigationContainer
    └── Navigation Component
        ├── isLoading? → LoadingScreen
        └── isAuthenticated?
            ├── YES → AppStack
            │   └── HomeDrawer
            │       ├── Home
            │       ├── Profile
            │       ├── Booking
            │       └── etc.
            └── NO → AuthStack
                ├── Login
                └── Register

State Changes:
- Login success → AuthStack → AppStack
- Logout → AppStack → AuthStack
- Token refresh fail → AppStack → AuthStack
- App restart with valid token → AppStack
```

This diagram shows the complete flow of JWT authentication in your React Native app!
