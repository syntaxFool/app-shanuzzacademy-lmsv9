# Google Apps Script Backend Integration Guide

## Overview

This document explains how the Vue.js frontend connects to the Google Apps Script backend for the Shanuzz Academy LMS.

## Architecture

```
┌─────────────────────────────────────────┐
│   Vue.js 3 Frontend (Netlify)          │
│  ┌───────────────────────────────────┐ │
│  │   Login Component                 │ │
│  │   ├─ Form Validation             │ │
│  │   └─ Auth Store (Pinia)          │ │
│  └───────────────┬─────────────────┘ │
│                  │                    │
│                  │ POST Request       │
│                  ▼                    │
│  ┌───────────────────────────────────┐ │
│  │   API Service (Axios)             │ │
│  │   ├─ Request Interceptor          │ │
│  │   ├─ Response Interceptor         │ │
│  │   └─ CORS Headers                 │ │
│  └───────────────┬─────────────────┘ │
│                  │                    │
└──────────────────┼────────────────────┘
                   │ HTTPS
                   │ POST /usercodeappscript
                   │
                   ▼
┌─────────────────────────────────────────┐
│   Google Apps Script (Cloud)            │
│  ┌───────────────────────────────────┐ │
│  │   doPost(e) - Main Handler        │ │
│  │   ├─ authenticateUser()           │ │
│  │   ├─ validateToken()              │ │
│  │   ├─ getLeads()                   │ │
│  │   └─ ...other functions...        │ │
│  └───────────────┬─────────────────┘ │
│                  │                    │
│                  │ JSON Response      │
│                  ▼                    │
│  ┌───────────────────────────────────┐ │
│  │   Google Sheets Database          │ │
│  │   ├─ Users                        │ │
│  │   ├─ Leads                        │ │
│  │   ├─ Activities                   │ │
│  │   ├─ Tasks                        │ │
│  │   └─ Settings                     │ │
│  └───────────────────────────────────┘ │
│                  ▲                    │
│                  │ Read/Write         │
│                  └────────────────────┘
└─────────────────────────────────────────┘
```

## Request/Response Flow

### Authentication Flow

```
User enters credentials
        │
        ▼
┌──────────────────────────────────┐
│  Login.vue Component             │
│  - Validates email/password      │
│  - Calls authStore.login()       │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│  Auth Store (Pinia)              │
│  - Sets loading state            │
│  - Calls authService.login()     │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│  Auth Service                    │
│  - Calls gasApi.execute()        │
│  - Sends to GAS backend          │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│  API Client (Axios)              │
│  - Adds CORS headers             │
│  - Adds timestamp                │
│  - Logs request                  │
│  POST to GAS URL                 │
└──────────┬───────────────────────┘
           │ (HTTPS)
           ▼
    Google Apps Script
           │
           ▼
┌──────────────────────────────────┐
│  doPost(e)                       │
│  - Parses JSON payload           │
│  - Routes to authenticateUser()  │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│  authenticateUser(credentials)   │
│  - Queries Users sheet           │
│  - Verifies password             │
│  - Generates JWT token           │
│  - Returns user + token          │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│  Response JSON                   │
│  {                               │
│    "success": true,              │
│    "data": {                     │
│      "user": {...},              │
│      "token": "jwt_token"        │
│    }                             │
│  }                               │
└──────────┬───────────────────────┘
           │ (HTTPS)
           ▼
    Axios Response Interceptor
           │
           ▼
    Auth Service Returns
           │
           ▼
    Auth Store Stores User + Token
           │
           ▼
    Save to localStorage
           │
           ▼
    Redirect to Dashboard
```

## File Structure & Connections

```
Frontend (Vue.js)
├── src/
│   ├── views/
│   │   └── Login.vue ──────────┐
│   │                          │
│   ├── stores/               │
│   │   └── auth.ts ──────────┼──┐
│   │                          │  │
│   ├── services/             │  │
│   │   ├── auth.ts ──────────┼──┼──┐
│   │   └── api.ts ───────────┼──┼──┼──┐
│   │                          │  │  │  │
│   └── env.d.ts              │  │  │  │
│                              │  │  │  │
├── .env.production ───────────┼──┼──┼──┼──┐
│                              │  │  │  │  │
│                              ▼  ▼  ▼  ▼  ▼
│                        VITE_API_BASE_URL
│                             (GAS URL)
│                              │
│                              │ HTTPS POST
│                              ▼
Backend (Google Apps Script)
├── code.gs
│   ├── doPost(e) ◄──────────┐
│   │   ├── authenticateUser()│
│   │   ├── validateToken()   │
│   │   ├── updateUserProfile()
│   │   └── ...               │
│   │                         │
│   └── Database Functions    │
│       └── Google Sheets ◄───┘
└── Google Sheet (Database)
    ├── Users
    ├── Leads
    ├── Activities
    ├── Tasks
    └── Settings
```

## API Communication

### Request Format

All requests from frontend to Google Apps Script follow this format:

```javascript
{
  "function": "functionName",
  "parameters": [{ data object }]
}
```

### Response Format

All responses from Google Apps Script follow this format:

```javascript
{
  "success": true/false,
  "data": { response data },
  "error": "error message if applicable"
}
```

## Implemented Functions

### Authentication Functions

#### authenticateUser(credentials)
**Request:**
```javascript
{
  "function": "authenticateUser",
  "parameters": [{
    "email": "user@example.com",
    "password": "password123"
  }]
}
```

**Response:**
```javascript
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "User Name",
      "email": "user@example.com",
      "role": "admin",
      "picture": "url"
    },
    "token": "jwt_token_string"
  }
}
```

#### validateToken(tokenData)
**Request:**
```javascript
{
  "function": "validateToken",
  "parameters": [{
    "token": "jwt_token_string"
  }]
}
```

**Response:**
```javascript
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "User Name",
    "email": "user@example.com",
    "role": "admin"
  }
}
```

### Data Functions

#### getLeads(userId)
**Request:**
```javascript
{
  "function": "getLeads",
  "parameters": ["user_id"]
}
```

**Response:**
```javascript
{
  "success": true,
  "data": {
    "leads": [
      {
        "id": "uuid",
        "name": "Lead Name",
        "email": "lead@example.com",
        "status": "new",
        ...
      }
    ]
  }
}
```

## Token Management

### JWT Token Structure

The system uses simplified JWT tokens with the following structure:

```
header.payload.signature
```

**Payload contains:**
```javascript
{
  "user": { user object },
  "iat": 1671234567,        // issued at
  "exp": 1671320967         // expires at (24 hours later)
}
```

### Token Storage

Tokens are stored in browser's localStorage:
```javascript
localStorage.setItem('lms_auth_token', token)
localStorage.setItem('lms_user', JSON.stringify(user))
```

### Token Usage

Every API request automatically includes the token:

```javascript
// Request Interceptor in api.ts
headers.Authorization = `Bearer ${token}`
```

## CORS Configuration

The backend handles CORS requests by:

1. Setting response headers in `createCORSResponse()`:
   ```javascript
   'Access-Control-Allow-Origin': '*'
   'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
   'Access-Control-Allow-Headers': 'Content-Type, Authorization'
   ```

2. Frontend can make requests without CORS errors

3. **For production**, restrict origin to your domain:
   ```javascript
   'Access-Control-Allow-Origin': 'https://your-domain.netlify.app'
   ```

## Error Handling

### Frontend Error Handling

1. **Request Error** - Network/timeout issues
   ```javascript
   catch (error) {
     return { success: false, error: 'Network error' }
   }
   ```

2. **401 Unauthorized** - Token expired/invalid
   ```javascript
   if (error.response?.status === 401) {
     localStorage.removeItem('lms_auth_token')
     window.location.href = '/login'
   }
   ```

3. **API Error** - Backend returns error
   ```javascript
   if (!response.success) {
     return { success: false, error: response.error }
   }
   ```

### Backend Error Handling

Google Apps Script wraps functions in try/catch:

```javascript
try {
  // Function logic
  return { success: true, data: {...} }
} catch (error) {
  return { success: false, error: error.message }
}
```

## Performance Optimization

### Frontend Optimization
1. **Token Caching** - Store in localStorage
2. **Request Deduplication** - Prevent duplicate calls
3. **Lazy Loading** - Load components on demand
4. **Code Splitting** - Separate bundle chunks

### Backend Optimization
1. **Lock Service** - Prevent concurrent writes
2. **Hash Maps** - O(N) lookups instead of O(N²)
3. **Differential Sync** - Only fetch changed data
4. **Caching** - Cache user data in memory

## Testing the Connection

### Manual Test

Open browser console and run:

```javascript
const payload = {
  function: 'authenticateUser',
  parameters: [{
    email: 'demo@shanuzz.com',
    password: 'demo123'
  }]
};

fetch('https://script.google.com/macros/s/YOUR_ID/usercodeappscript', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
})
.then(r => r.json())
.then(d => console.log('Response:', d))
.catch(e => console.error('Error:', e));
```

### UI Test

1. Start dev server: `npm run dev`
2. Go to http://localhost:3000/login
3. Enter demo credentials
4. Check Network tab for API call
5. Verify response in Console

## Deployment Checklist

- [ ] Google Sheet created
- [ ] Google Apps Script code added
- [ ] Script variables updated (SHEET_ID, SECRET_KEY)
- [ ] initializeSheets() run successfully
- [ ] Google Apps Script deployed as Web App
- [ ] Web App URL copied
- [ ] Frontend .env.production updated
- [ ] Login tested locally
- [ ] Login tested after build
- [ ] Netlify environment variables set
- [ ] Frontend deployed to Netlify
- [ ] Login tested on production URL
- [ ] CORS working properly
- [ ] Token storage verified
- [ ] Session persistence working

## Troubleshooting

### API Call Fails

1. Check Network tab for request/response
2. Verify URL is correct in .env.production
3. Check browser console for errors
4. Verify CORS headers are present

### 401 Unauthorized

1. Check if token is in localStorage
2. Run validateToken manually
3. Check token expiration
4. Re-login to get new token

### CORS Errors

1. Check createCORSResponse in code.gs
2. Verify headers are set correctly
3. Try from different domain
4. Check browser CORS policy

### Blank Page After Login

1. Open DevTools Console
2. Check for JavaScript errors
3. Check Network tab for API errors
4. Verify user data returned
5. Check localStorage
6. Check router guards

## Next Steps

1. Follow `GAS_SETUP.md` for detailed setup
2. Use `QUICK_START_GAS.md` for quick reference
3. Test the connection thoroughly
4. Monitor Google Apps Script logs
5. Deploy to Netlify
6. Test in production

---

**Last Updated**: December 19, 2025
**Version**: 1.0.0

For more details, see:
- `GAS_SETUP.md` - Complete setup guide
- `QUICK_START_GAS.md` - Quick reference
- `DEPLOYMENT.md` - Deployment guide
- `TESTING.md` - Testing procedures
