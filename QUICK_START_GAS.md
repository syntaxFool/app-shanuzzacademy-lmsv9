# Quick Start: Connect Google Apps Script Backend

## 5-Minute Setup

### Step 1: Get Your Sheet ID
1. Create a Google Sheet: [sheets.google.com](https://sheets.google.com)
2. Copy Sheet ID from URL:
   ```
   https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit
   ```

### Step 2: Set Up Google Apps Script
1. In your Sheet → **Extensions** → **Apps Script**
2. Paste code from `code.gs` file
3. Update lines 1 & 79:
   ```javascript
   const SHEET_ID = 'your_sheet_id_here';
   const SECRET_KEY = 'your_secret_key_here';
   ```
4. Click **Deploy** → **New Deployment**
5. Select **Web app**
6. Choose "Execute as: [Your Account]" + "Who has access: Anyone"
7. Copy the **Web App URL**

### Step 3: Update Frontend
Add to `.env.production`:
```env
VITE_API_BASE_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/usercodeappscript
```

### Step 4: Initialize Database
1. In Apps Script, click **Run** → `initializeSheets`
2. Grant permissions when prompted

### Step 5: Test Login
Visit http://localhost:3000/login and try:
- **Email**: demo@shanuzz.com
- **Password**: demo123

## Demo Credentials
```
Email: demo@shanuzz.com
Password: demo123
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Authorization required" | Run initializeSheets() in Apps Script |
| "Invalid email or password" | Verify demo user exists in Users sheet |
| CORS error | Make sure createCORSResponse is used in doPost |
| Blank page after login | Check browser console, verify API URL |

## Need More Details?
See `GAS_SETUP.md` for complete guide.

---

**Ready?** Follow these 5 steps and you'll have authentication working!
