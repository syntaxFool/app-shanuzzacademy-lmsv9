# Customization Guide - Adapting the App for Different Businesses

This guide explains how to customize the Shanuzz Academy LMS v9 for other businesses (Salon, Coaching, Real Estate, etc.). The app architecture remains the same—only configuration and branding change.

**Latest Version**: v9.5 includes enhanced lost reason tracking with required details for all reasons, emoji-enhanced lost reasons chart (💰 Price too high, 😕 Not interested, 🏆 Competitor, 📞 Invalid number, 🔄 Duplicate, 📝 Other), and bulk delete functionality for admin/superuser with audit logging. Previous versions included security hardening (XSS protection, HTML injection prevention), adaptive polling, and improved Kanban card layout.

---

## Overview: What Stays the Same vs. What Changes

### ✅ What STAYS THE SAME (No Code Changes Required)
- Frontend code (`index.html`) - 100% reusable
- Backend code (`code.gs`) - 100% reusable
- Database structure (7 Google Sheets tabs)
- All functionality (Kanban, Table, Reports, Sync)
- User roles and permissions
- Mobile and desktop responsiveness (optimized card spacing)
- Real-time multi-user sync (10-second heartbeat with LockService)
- Smart data display (name → phone fallback)
- No Action filtering for leads requiring attention

### 🔧 What CHANGES (Configuration Only)
- Google Sheet name and location
- Business-specific field names
- Dropdown options (Interests, Sources, Locations)
- Branding (title, colors, logo)
- Lead data structure (optional custom fields)

---

## Step-by-Step: Adapting for a New Business

### Example: Converting from Shanuzz Academy LMS → Shanuzz Salon LMS

---

## Phase 1: Create New Google Sheet Infrastructure

### Step 1: Create a Fresh Google Sheet for Your Business

1. Go to **Google Sheets** (sheets.google.com)
2. Click **"+ Create"** → **"Blank Spreadsheet"**
3. Rename the sheet: **"Shanuzz Salon LMS"** (or your business name)
4. Share it: Click **Share** → **"Anyone with the link"** → **"Editor"**

### Step 2: Create the 7 Required Tabs (Sheet Tabs)

At the bottom of the sheet, you'll see "Sheet1". We need to create 7 tabs with exact names:

**Tab names (Case Sensitive)**:
1. `Leads`
2. `Activities`
3. `Tasks`
4. `Users`
5. `Logs`
6. `Interests`
7. `Settings`

**How to rename/create tabs**:
- Right-click the sheet tab → **"Rename"** or **"Insert sheet"**

---

## Phase 2: Set Up the Database Schema

### Tab 1: "Leads" Sheet

This is your main data table. Create these columns in Row 1:

| Column | Data Type | Example (Academy) | Example (Salon) |
|--------|-----------|-------------------|-----------------|
| id | Text | UUID (auto-generated) | UUID (auto-generated) |
| name | Text | Student name | Client name |
| phone | Text | 9876543210 | 9876543210 |
| email | Email | student@email.com | client@email.com |
| status | Text (Dropdown) | New/Contacted/Proposal/Won/Lost | Inquiry/Booked/In-Progress/Completed/Cancelled |
| value | Number | 50000 | 5000 |
| source | Text (Dropdown) | Website/Referral/Social/Walk-in | Google/Instagram/Referral/Walk-in |
| interest | Text (Dropdown) | Full Stack/Python/UI Design | Hair Cut/Facial/Massage/Bridal |
| assignedTo | Text | agent_username | staff_username |
| lostReason | Text | Budget/Changed Mind | Not Interested/Budget |
| createdAt | Date | (auto-filled) | (auto-filled) |
| updatedAt | Date | (auto-filled) | (auto-filled) |

**Academy Version**:
```
id | name | phone | email | status | value | source | interest | assignedTo | lostReason | createdAt | updatedAt
```

**Salon Version**:
```
id | name | phone | email | status | value | source | service | assignedTo | cancelledReason | createdAt | updatedAt
```

---

### Tab 2: "Activities" Sheet

Tracks interactions (calls, notes, follow-ups).

| Column | Purpose |
|--------|---------|
| leadId | References the lead ID |
| type | follow_up / call / note / meeting |
| note | Activity description |
| timestamp | When it happened |
| user | Which staff member logged it |
| changes | (Optional) JSON tracking what changed |

**No changes needed** - use as-is for any business.

---

### Tab 3: "Tasks" Sheet

Action items and reminders.

| Column | Purpose |
|--------|---------|
| leadId | References the lead |
| title | Task description |
| dueDate | When due |
| status | pending / completed / dropped |
| note | Additional details |

**No changes needed** - use as-is.

---

### Tab 4: "Users" Sheet

Your team members (staff, agents, admins).

| Column | Purpose |
|--------|---------|
| id | Unique identifier |
| username | Login name (e.g., "riya_salon", "john_realtor") |
| password | Password (plain text for demo) |
| name | Full name |
| email | Email address |
| role | superuser / admin / agent / user |

**Add your team members here**:
```
id | username | password | name | email | role
1 | riya_sharma | pass123 | Riya Sharma | riya@salon.com | superuser
2 | priya_singh | pass123 | Priya Singh | priya@salon.com | agent
3 | deepak_manager | pass123 | Deepak Kumar | deepak@salon.com | admin
```

---

### Tab 5: "Logs" Sheet

Audit trail (auto-populated by backend).

| Column | Purpose |
|--------|---------|
| timestamp | When action happened |
| user | Who did it |
| action | Create / Update / Delete |
| message | Description |

**No setup needed** - backend fills this automatically.

---

### Tab 6: "Interests" Sheet

Dropdown options for services/products (Business-specific!).

**For Academy**:
| Name | Value |
|------|-------|
| Full Stack | 50000 |
| Python | 30000 |
| Web Development | 45000 |
| UI Design | 35000 |
| Data Science | 60000 |

**For Salon**:
| Name | Value |
|------|-------|
| Hair Cut | 500 |
| Hair Coloring | 2000 |
| Facial | 1500 |
| Massage | 3000 |
| Bridal Package | 15000 |
| Pedicure | 800 |

**For Real Estate**:
| Name | Value |
|------|-------|
| 1 BHK Apartment | 5000000 |
| 2 BHK Apartment | 8000000 |
| 3 BHK Villa | 15000000 |
| Commercial Space | 10000000 |

---

### Tab 7: "Settings" Sheet

App configuration (dropdown options for Location and Source).

**For Academy**:
| Location | Source |
|----------|--------|
| Delhi | Google |
| Mumbai | Instagram |
| Bangalore | Referral |
| Pune | Walk-in |
| Hyderabad | Facebook |

**For Salon**:
| Location | Source |
|----------|--------|
| Delhi Downtown | Google |
| Delhi East | Instagram |
| Mumbai Central | Facebook |
| Mumbai Suburbs | Referral |
| Bangalore | Walk-in |

**For Real Estate**:
| Location | Source |
|----------|--------|
| Delhi South | Google |
| Delhi North | Facebook |
| Gurgaon | LinkedIn |
| Noida | Referral |
| Mumbai | Walk-in |

---

## Phase 3: Deploy Backend (Same Code, Different Sheet)

### Step 1: Open Google Apps Script Editor

1. In your **new Google Sheet**, click **Extensions** → **Apps Script**
2. Delete any existing code
3. Paste the entire `code.gs` code (from your academy version)
4. **No code changes needed** - it works for any business!

### Step 2: Deploy as Web App

1. Click **Deploy** → **New Deployment**
2. Configuration:
   - Type: **Web App**
   - Description: **"Shanuzz Salon LMS API"** (update name)
   - Execute as: **Me**
   - Who has access: **Anyone**
3. Click **Deploy**
4. **Copy the Web App URL** (ends in `/exec`)

---

## Phase 4: Configure Frontend (index.html)

The frontend code remains **100% the same**. But you need to update:

### Option A: Change Business Name in UI (Simple)

Find and replace these text strings in `index.html`:

#### 1. Change App Title
```javascript
// Find this line (around line 160):
<h1 class="text-2xl font-bold text-slate-800" id="loginTitle">LeadFlow</h1>

// Change to:
<h1 class="text-2xl font-bold text-slate-800" id="loginTitle">Shanuzz Salon</h1>
```

#### 2. Change App Name in Settings/Header
Find lines with "Shanuzz Academy" and replace with your business name.

#### 3. Update Field Names (Optional, for clarity)

Search for these and replace if needed:

| Current (Academy) | New (Salon) | Search in index.html |
|------------------|-------------|---------------------|
| "interest" | "service" | Search "Interest" and change labels |
| "value" | "price" | Search "Value" and change labels |
| "lostReason" | "cancelledReason" | Search "lostReason" and change labels |

**Example change**:
```javascript
// Before:
<label>Interest</label>
<select name="interest">...</select>

// After:
<label>Service</label>
<select name="service">...</select>
```

### Option B: Change Branding Colors

Find these color codes and replace with your brand colors:

```javascript
// Primary color (blue)
'primary: #4f46e5'  → Change to your brand color hex

// Find and replace:
text-blue-600 → text-[your-color]-600
bg-blue-600 → bg-[your-color]-600
```

---

## Phase 5: Connect Frontend to New Backend

### Step 1: Open index.html in Browser

1. Double-click `index.html` to open in browser
2. You'll see the login screen

### Step 2: Configure Web App URL

1. Login with **any credentials** (or create superuser on first login)
2. Click **Menu (≡)** → **Settings > SYS Config**
3. Paste your **new Google Apps Script Web App URL** into the field
4. Click **Save & Sync**
5. Wait for data to load

**Done!** Your app is now connected to the new Google Sheet.

---

## Quick Reference: What to Change for Each Business Type

### For Salon Business

```
Field Changes:
- "interest" → "service" (Hair, Facial, Massage, etc.)
- "value" → "price" (₹500-₹15000 per service)
- "status" → "Inquiry / Booked / In-Progress / Completed / Cancelled"
- "lostReason" → "cancelledReason"

Interests Tab (Services):
- Hair Cut (₹500)
- Hair Coloring (₹2000)
- Facial (₹1500)
- Massage (₹3000)
- Bridal Package (₹15000)

Users (Staff):
- Receptionist (admin)
- Hair Stylist (agent)
- Beautician (agent)
- Massage Therapist (agent)
```

### For Real Estate Business

```
Field Changes:
- "interest" → "property_type" (Apartment, Villa, Commercial)
- "value" → "price" (₹50L - ₹5Cr)
- "status" → "Lead / Site Visit / Negotiation / Deal / Cancelled"

Interests Tab (Properties):
- 1 BHK Apartment (₹50,00,000)
- 2 BHK Apartment (₹80,00,000)
- 3 BHK Villa (₹1,50,00,000)
- Commercial Space (₹1,00,00,000)

Users (Sales Team):
- Sales Manager (admin)
- Sales Agent 1 (agent)
- Sales Agent 2 (agent)
```

### For Coaching Center

```
Field Changes:
- "interest" → "course" (Python, Java, Web Dev, etc.)
- "value" → "fees" (₹10,000 - ₹50,000)
- "status" → "Inquiry / Demo / Enrolled / Completed / Dropped"

Interests Tab (Courses):
- Python Programming (₹15,000)
- Web Development (₹20,000)
- Data Science (₹30,000)
- Mobile Development (₹25,000)
- Advanced Java (₹18,000)

Users (Staff):
- Director (superuser)
- Admission Manager (admin)
- Instructor 1 (agent)
- Instructor 2 (agent)
```

---

## Checklist: Deploying for New Business

### Google Sheet Setup
- [ ] Create new Google Sheet
- [ ] Create 7 tabs (Leads, Activities, Tasks, Users, Logs, Interests, Settings)
- [ ] Add column headers to each tab
- [ ] Populate Interests (Services/Courses/Products)
- [ ] Populate Settings (Locations, Sources)
- [ ] Populate Users (Team members with login credentials)
- [ ] Share sheet with Editor access

### Backend Deployment
- [ ] Open Google Apps Script
- [ ] Paste code.gs
- [ ] Deploy as Web App
- [ ] Copy Web App URL
- [ ] Note down the URL

### Frontend Configuration
- [ ] Update app title in index.html (optional)
- [ ] Update field names if needed (optional)
- [ ] Update colors if needed (optional)
- [ ] Open index.html in browser
- [ ] Login and go to Settings
- [ ] Paste Web App URL and Save
- [ ] Wait for data sync
- [ ] Create test lead to verify

### Testing
- [ ] Test creating a lead
- [ ] Test editing a lead
- [ ] Test switching between Kanban/Table/Reports views
- [ ] Test on mobile (use browser DevTools)
- [ ] Test multi-user sync (open in 2 tabs)
- [ ] Test follow-ups and activities

---

## Advanced: Custom Fields for Your Business

If you need additional fields beyond the standard ones, you can add them to the Leads sheet.

### Example: Add "Budget" field for Real Estate

**Step 1**: Add column in Google Sheet
```
Column M: "budget" (in Leads sheet header)
```

**Step 2**: Update backend (`code.gs`)
```javascript
// Find this line in doPost function:
const headers = ['id', 'name', 'phone', 'email', 'status', 'value', 'source', 'interest', 'assignedTo', 'lostReason', 'createdAt', 'updatedAt'];

// Change to:
const headers = ['id', 'name', 'phone', 'email', 'status', 'value', 'source', 'interest', 'assignedTo', 'lostReason', 'budget', 'createdAt', 'updatedAt'];
```

**Step 3**: Update frontend (`index.html`)
```javascript
// Find the form in Lead Modal and add:
<div>
  <label class="text-xs font-semibold">Budget</label>
  <input type="number" name="budget" placeholder="Enter budget">
</div>

// Update renderTable() to display budget column:
<td>${lead.budget || '-'}</td>
```

**Redeploy** and test.

---

## Important Notes

### Database Independence
- Each Google Sheet is **completely independent**
- Changing one doesn't affect the others
- You can run multiple instances simultaneously

### Code Reusability
- The same `index.html` and `code.gs` work for **any business**
- No need to maintain multiple versions
- Updates to logic apply to all instances automatically

### Data Migration (Copying an Existing Instance)
If you want to copy an existing instance:

1. Open existing Google Sheet
2. **File** → **Make a copy**
3. Rename the copy (e.g., "Salon LMS")
4. Update data in Interests/Settings/Users tabs
5. Deploy new Apps Script
6. Update Web App URL in frontend

---

## Troubleshooting Customization

### Issue: "Dropdowns are empty"
- **Solution**: Verify data exists in Interests and Settings tabs
- Click refresh icon in header to force sync

### Issue: "New field not showing in table"
- **Solution**: Make sure you added column to Google Sheet AND updated code.gs headers array
- Redeploy Apps Script

### Issue: "Cannot save data"
- **Solution**: Verify Google Sheet is shared with "Editor" access
- Check that column headers match exactly (case-sensitive)

### Issue: "Web App URL not connecting"
- **Solution**: Ensure deployment is set to "Anyone" access
- Copy URL exactly from deployment URL (not the script page URL)

---

## Summary: Core Principle

**The app is architecture-agnostic.** It works for ANY business because:

1. **Frontend** - Generic lead management UI (name, phone, email, status, value, source, interest, assigned-to)
2. **Backend** - Generic CRUD operations (Create, Read, Update, Delete)
3. **Database** - Standardized 7-tab structure

Only **business-specific values** change (Interests, Locations, Sources, user names, field labels).

---

## Next Steps

1. Create new Google Sheet for your business
2. Set up the 7 tabs with business-specific data
3. Deploy Apps Script from existing code.gs
4. Configure frontend with new Web App URL
5. Test with your team
6. Go live!

For detailed code documentation, see `DEVELOPER.md`.
For user guide, see `summary.md`.

---

**Last Updated**: December 8, 2025  
**Version**: 1.0
