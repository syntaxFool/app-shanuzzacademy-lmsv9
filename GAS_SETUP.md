# Google Apps Script Backend Setup Guide

## Overview

This guide explains how to set up and deploy the Google Apps Script backend for the Shanuzz Academy LMS. The backend handles:

- User authentication
- Lead management (CRUD operations)
- Activity tracking
- Task management
- Data synchronization with Google Sheets

## Prerequisites

1. **Google Account** - Required to access Google Apps Script
2. **Google Sheet** - Where all data will be stored
3. **Frontend Deployed** - Vue.js app ready to connect

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Click "Create new" → "Spreadsheet"
3. Name it: `Shanuzz Academy LMS Data`
4. Copy the Google Sheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit
   ```
   Save this ID - you'll need it later.

## Step 2: Open Google Apps Script Editor

1. In your Google Sheet, go to **Extensions** → **Apps Script**
2. A new tab will open with the Apps Script editor
3. Delete any existing code
4. Copy and paste the entire content from `code.gs` file

## Step 3: Configure the Script

Update the following variables in `code.gs`:

```javascript
// Line 1 - Replace with your Google Sheet ID
const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID';

// Line 79 - Replace with a secure secret key
const SECRET_KEY = 'your_secure_secret_key_here';
```

### Example:
```javascript
const SHEET_ID = 'abc123xyz789def456ghi789';
const SECRET_KEY = 'my_super_secure_key_2025';
```

## Step 4: Initialize the Database

1. In the Apps Script editor, click the **Run** button next to `initializeSheets`
2. A popup will ask for permissions - click **Review Permissions**
3. Select your Google Account
4. Click **Allow** to grant access to your Google Sheet
5. The script will create all necessary sheets and add a demo user:
   - **Email**: `demo@shanuzz.com`
   - **Password**: `demo123`

## Step 5: Deploy as Web App

1. In the Apps Script editor, click **Deploy** → **New Deployment**
2. Select **Type** → **Web app**
3. Configure:
   - **Execute as**: Your Google Account
   - **Who has access**: Anyone
4. Click **Deploy**
5. A popup will show your **Deployment ID** and **Web app URL**
6. Copy the **Web app URL** - this is your API endpoint

### Example Web App URL:
```
https://script.google.com/macros/s/AKfycbx...../usercodeappscript
```

## Step 6: Update Frontend Environment Variables

1. Open the `.env.production` file in your Vue project:
   ```env
   VITE_API_BASE_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/usercodeappscript
   ```

2. Replace `YOUR_DEPLOYMENT_ID` with the ID from the web app URL

### Example:
```env
VITE_API_BASE_URL=https://script.google.com/macros/s/AKfycbx1q2w3e4r5t6y7u8i9o0p1a2s3d4f5/usercodeappscript
```

## Step 7: Update Netlify Environment

If deploying to Netlify:

1. Go to **Site settings** → **Build & deploy** → **Environment**
2. Click **Edit variables**
3. Add/update:
   ```
   VITE_API_BASE_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/usercodeappscript
   ```

## Step 8: Test the Connection

### Test 1: Check Login API

Open your browser's Developer Tools (F12) and run:

```javascript
const loginData = {
  function: 'authenticateUser',
  parameters: [{ email: 'demo@shanuzz.com', password: 'demo123' }]
};

fetch('https://your-gas-url/usercodeappscript', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(loginData)
})
.then(r => r.json())
.then(d => console.log(d));
```

### Expected Response:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "abc-123-def",
      "name": "Demo User",
      "email": "demo@shanuzz.com",
      "role": "admin",
      "picture": "https://via.placeholder.com/50"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Test 2: Login in Your App

1. Start your Vue dev server:
   ```bash
   npm run dev
   ```

2. Navigate to http://localhost:3000/login

3. Enter:
   - Email: `demo@shanuzz.com`
   - Password: `demo123`

4. Click "Sign In"

5. You should see a success message and redirect to dashboard

## Sheet Structure

The Google Sheet contains the following sheets (auto-created):

### Users Sheet
| Column | Description |
|--------|-------------|
| username | Login email |
| password | User password (plain text - improve in production) |
| name | User's full name |
| role | User role (admin, user, manager) |
| id | Unique user ID |
| picture | Profile picture URL |

### Leads Sheet
| Column | Description |
|--------|-------------|
| id | Unique lead ID |
| name | Lead name |
| phone | Contact phone |
| email | Contact email |
| status | Lead status (new, contacted, qualified, converted, lost) |
| value | Deal value |
| interest | Interest level |
| location | Lead location |
| source | Lead source (manual, website, referral, etc.) |
| assignedTo | Assigned user |
| notes | Internal notes |
| temperature | Lead temperature (hot, warm, cold) |
| lostReason | Reason if lost |
| createdAt | Creation timestamp |
| updatedAt | Last update timestamp |

### Activities Sheet
| Column | Description |
|--------|-------------|
| id | Activity ID |
| leadId | Associated lead ID |
| type | Activity type (call, email, meeting, note) |
| note | Activity details |
| timestamp | When activity occurred |
| createdBy | User who created activity |
| role | User's role at creation |

### Tasks Sheet
| Column | Description |
|--------|-------------|
| id | Task ID |
| leadId | Associated lead ID |
| title | Task title |
| status | Task status (open, completed, overdue) |
| dueDate | Task due date |
| note | Task details |
| createdAt | Creation timestamp |
| completedAt | Completion timestamp |

## API Endpoints

The Google Apps Script exposes these functions:

### Authentication

**authenticateUser**
```json
{
  "function": "authenticateUser",
  "parameters": [{ "email": "user@email.com", "password": "password" }]
}
```

**validateToken**
```json
{
  "function": "validateToken",
  "parameters": [{ "token": "jwt_token_here" }]
}
```

**updateUserProfile**
```json
{
  "function": "updateUserProfile",
  "parameters": [{ "user": {...}, "updates": { "name": "New Name" } }]
}
```

**logoutUser**
```json
{
  "function": "logoutUser",
  "parameters": [{ "user": {...} }]
}
```

### Data Management

**Sync Data** (GET request)
```
https://script.google.com/macros/s/YOUR_ID/usercodeappscript?lastSyncTime=1234567890
```

## Troubleshooting

### Issue: "Authorization required"

**Solution:**
1. Click **Deploy** again
2. Select "Execute as: [Your Account]"
3. Make sure "Who has access" is set to "Anyone"

### Issue: "Invalid email or password"

**Solution:**
1. Check if demo user was created (run initializeSheets again)
2. Verify email/password is exactly: demo@shanuzz.com / demo123
3. Check Users sheet in Google Sheet

### Issue: "CORS error" or "No 'Access-Control-Allow-Origin' header"

**Solution:**
1. Verify the createCORSResponse function is called in doPost
2. Make sure the Access-Control headers are set
3. Deploy a new version of the script

### Issue: "Cannot read property 'getDataRange'"

**Solution:**
1. Sheets may not be created
2. Run `initializeSheets()` function
3. Check if sheets exist in Google Sheet

### Issue: Blank page after login

**Solution:**
1. Open browser DevTools (F12)
2. Check Console for errors
3. Check Network tab - verify API call is made
4. Check if token is saved in localStorage
5. Verify VITE_API_BASE_URL is correct in .env.production

## Adding New Users

To add new users to the system:

1. Open your Google Sheet
2. Go to the "Users" sheet
3. Add a new row with:
   - **username**: email address (e.g., user@example.com)
   - **password**: password (plain text in development)
   - **name**: user's name
   - **role**: admin, user, or manager
   - **id**: unique ID (can use UUIDs)
   - **picture**: profile image URL

### Example Row:
```
alice@shanuzz.com | alice123 | Alice Johnson | admin | abc-123-xyz | https://via.placeholder.com/50
```

## Security Considerations

⚠️ **Important for Production:**

1. **Password Storage**: The current implementation stores passwords in plain text. For production:
   - Use proper password hashing (bcrypt, Argon2)
   - Never store plain text passwords
   - Implement salt-based hashing

2. **JWT Secret**: Change the SECRET_KEY from default value:
   ```javascript
   const SECRET_KEY = 'generate_a_secure_random_string_here';
   ```

3. **HTTPS**: Google Apps Script URLs are automatically HTTPS

4. **CORS**: Change from `'*'` to your specific domain:
   ```javascript
   const CORS_ORIGIN = 'https://your-domain.netlify.app';
   ```

5. **Rate Limiting**: Implement rate limiting for login attempts

6. **Audit Logging**: Keep audit trail of all operations

## Monitoring & Logging

View execution logs:

1. In Apps Script editor, click **Executions** tab
2. See recent function calls and any errors
3. Use `Logger.log()` for debugging

### Example:
```javascript
Logger.log('User logged in: ' + email);
Logger.log('Lead created: ' + leadData);
```

View in **Executions** tab with timestamps.

## Updating the Script

To update the Google Apps Script:

1. Make changes in the editor
2. Click **Save** (Ctrl+S / Cmd+S)
3. Click **Deploy** → **Manage Deployments**
4. Select the web app deployment
5. Click the edit icon (pencil)
6. Change "Description" to indicate version
7. Click "Deploy"
8. No need to redeploy - changes are automatic

## Quota Limits

Google Apps Script has quotas:

- **Daily executions**: 20,000
- **Concurrent executions**: 30
- **Spreadsheet operations**: Limited by Google Sheets API
- **Execution time**: 30 minutes max per execution

For a growing application, consider:
- Database: Google Cloud SQL or Firestore
- API Gateway: Cloud Functions
- Cache: Cloud Memorystore

## Support & Resources

- [Google Apps Script Documentation](https://developers.google.com/apps-script)
- [SpreadsheetApp Reference](https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet-app)
- [JWT Standard](https://jwt.io)
- [Google Sheets API](https://developers.google.com/sheets/api)

## Next Steps

1. ✅ Set up Google Sheet
2. ✅ Configure Google Apps Script
3. ✅ Deploy as Web App
4. ✅ Update frontend API endpoint
5. ✅ Test authentication
6. ✅ Deploy to Netlify
7. ✅ Monitor performance

---

**Last Updated**: December 19, 2025
**Version**: 1.0.0

Your backend is now ready! If you encounter any issues, check the troubleshooting section or review the Google Apps Script execution logs.
