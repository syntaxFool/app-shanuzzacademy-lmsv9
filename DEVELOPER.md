# Developer Documentation - Shanuzz Academy LMS v9

## 1. Project Overview
**Shanuzz Academy LMS** is a lightweight Lead Management System designed for educational academies to manage student inquiries and conversions efficiently.

- **Frontend:** Single Page Application (SPA) using HTML5, Vanilla JavaScript, and Tailwind CSS
- **Backend:** Google Apps Script (GAS) serving as a REST API
- **Database:** Google Sheets (7 sheets: Leads, Activities, Tasks, Users, Logs, Interests, Settings)
- **Hosting:** Netlify (Frontend) + Google Cloud (Backend Script)
- **Real-Time Sync:** 10-second heartbeat polling with change detection

## 2. Technology Stack

### Frontend
- **HTML5**: Semantic markup
- **JavaScript (ES6+)**: Vanilla JS (no frameworks)
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Phosphor Icons**: Icon library for UI elements
- **LocalStorage**: Client-side state persistence

### Backend
- **Google Apps Script**: JavaScript runtime for Google Workspace
- **Google Sheets**: Cloud-based database
- **ContentService**: Response handling and JSON serialization

### Key Libraries/Tools
- **Git/GitHub**: Version control and collaboration

## 3. Architecture & Data Flow

### 3.1 Polling Architecture
The app uses a **10-second heartbeat polling system** to simulate real-time collaboration:

```
┌─────────────┐
│  User A     │ Saves Lead → POST /script
└─────────────┘
      ↓
┌─────────────────────────────┐
│  Backend (code.gs)          │
│  Updates LAST_UPDATE Time   │
└─────────────────────────────┘
      ↑
┌─────────────┐
│  User B     │ Every 10s: GET /script → Checks LAST_UPDATE
└─────────────┘
      ↓
 If Server Time > Local Time → Refresh Data
 Display: "Data updated from other users"
```

### 3.2 Component Architecture

```
┌─────────────────────────────────────────┐
│         Frontend (index.html)            │
├─────────────────────────────────────────┤
│  App Class (Main Controller)             │
│  ├─ LeadStore (State Management)         │
│  ├─ UI (Visual Elements)                 │
│  └─ Render Functions (Board/Table/etc)   │
└──────────────┬──────────────────────────┘
               │ API Calls
┌──────────────▼──────────────────────────┐
│   Backend (code.gs)                      │
│  ├─ doGet() → Read data                  │
│  ├─ doPost() → Write data                │
│  └─ LockService → Prevent conflicts      │
└──────────────┬──────────────────────────┘
               │ Sheet Operations
┌──────────────▼──────────────────────────┐
│   Google Sheets Database                 │
│  ├─ Leads (Main table)                   │
│  ├─ Activities (Follow-ups, notes)       │
│  ├─ Tasks (Action items)                 │
│  ├─ Users (Team members)                 │
│  ├─ Logs (Audit trail)                   │
│  ├─ Interests (Dropdown options)         │
│  └─ Settings (Configuration)             │
└─────────────────────────────────────────┘
```

## 4. Key Files & Their Purpose

### 4.1 `index.html` (2936 lines - Main Frontend File)

#### Structure:
- **CSS Styles (Lines 1-100)**: Custom Tailwind extensions and animations
- **HTML Template (Lines 105-400)**: All UI elements
- **JavaScript Classes (Lines 410-2936)**: Application logic

#### Key Classes:

##### `class App`
**Purpose**: Main controller that orchestrates the entire application

**Key Properties**:
- `store`: Holds all data (leads, users, activities, etc.)
- `currentUser`: Logged-in user
- `activeView`: Current view (kanban, table, reports, agentTable)
- `currentModalTab`: Active tab in lead modal (info, activity, task, contact)
- `_notifications`: Array of notification messages

**Critical Methods**:
```javascript
// Main render dispatcher
render(leads) {
  if (this.activeView === 'table') {
    this.renderTable(leads);
    return;
  }
  // Renders kanban board by default
}

// Switch between views
switchViewMode(mode) {
  this.activeView = mode;
  this.render(this.store.state);
}

// Handle login
handleLogin(event) {
  // Validates credentials and sets currentUser
  // Starts the sync heartbeat
}

// Save lead (called on form submit)
handleSaveLead(event) {
  // Collects form data
  // Sends to backend via POST
  // Shows success/error notification
}
```

**Why It Exists**: Centralizes application logic. All user interactions flow through this class.

---

##### `LeadStore` (Lines 755-820)
**Purpose**: Manages data state and synchronization

**Key Properties**:
- `state`: Array of all leads
- `users`: Array of all team members
- `settings`: Configuration (dropdown options)
- `logs`: Audit trail
- `lastModified`: Timestamp of last server update

**Critical Methods**:
```javascript
// Fetch all data from backend
async loadData() {
  const response = await fetch(SCRIPT_URL + '?action=getData');
  return response.json();
}

// Main sync function (called every 10 seconds)
async syncWithCloud() {
  const newData = await this.loadData();
  this.state = newData.leads;
  this.users = newData.users;
  // ...
}

// Check if server has newer data
async checkForServerUpdates() {
  const serverTime = await this.getLastModified();
  if (serverTime > this.lastModified) {
    this.notify('Data updated from other users', 'success');
    await this.syncWithCloud();
  }
}
```

**Why It Exists**: Single source of truth for application data. Prevents multiple sources of data confusion.

---

##### `class UI` (Lines 2744-2880)
**Purpose**: Handles all visual feedback and modal management

**Key Methods**:
```javascript
// Show loading overlay
showLoading(text = 'Loading...') {
  document.getElementById('loadingOverlay').classList.remove('hidden');
}

// Display notification
notify(msg, type = 'info') {
  // Shows color-coded toast (green=success, red=error, amber=warning)
}

// Toggle side menu
toggleMenu(show) {
  // Slide menu in/out with animation
}

// Show modal with animation
toggleModal(show) {
  // Opens/closes lead editor
}
```

**Why It Exists**: Separates UI concerns from business logic. Makes the code modular and testable.

---

### 4.2 `code.gs` (227 lines - Backend API)

**Location**: Google Apps Script Editor (apps.script.google.com)

#### Structure:
- **Configuration (Lines 1-20)**: API keys, sheet ranges
- **Main Functions (Lines 25-150)**: doGet, doPost
- **Helper Functions (Lines 155-227)**: Data processing

#### Key Functions:

##### `doGet(e)` - Data Retrieval
```javascript
function doGet(e) {
  const action = e.parameter.action || 'getData';
  
  if (action === 'getData') {
    const data = {
      leads: getSheetData('Leads'),
      users: getSheetData('Users'),
      activities: getSheetData('Activities'),
      // ... other sheets
      lastModified: PropertiesService.getScriptProperties().getProperty('LAST_UPDATE')
    };
    
    return ContentService.createTextOutput(JSON.stringify(data))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

**Why**: Reads all data at once (faster than row-by-row). Returns JSON that frontend can parse.

---

##### `doPost(e)` - Data Writing
```javascript
function doPost(e) {
  try {
    const lock = LockService.getScriptLock();
    lock.waitLock(30000); // Wait up to 30 seconds for lock
    
    const data = JSON.parse(e.postData.contents);
    
    // Write to appropriate sheet
    const sheet = SpreadsheetApp.getActive().getSheetByName(data.sheet);
    if (data.action === 'append') {
      appendRow(sheet, data.values);
    } else if (data.action === 'update') {
      updateRow(sheet, data.rowIndex, data.values);
    }
    
    updateLastModified(); // Timestamp the change
    
    return ContentService.createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({error: error.message}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

**Why**: 
- `LockService` prevents two simultaneous writes from corrupting data
- `updateLastModified()` notifies other users that data changed
- Try-catch ensures errors are reported, not silently failing

---

##### `updateLastModified()` - Change Notification
```javascript
function updateLastModified() {
  const props = PropertiesService.getScriptProperties();
  props.setProperty('LAST_UPDATE', new Date().getTime());
}
```

**Why**: This is the "heartbeat" of the system. When any user saves data, the backend updates this timestamp. Other users' apps check this every 10 seconds and refresh if it's newer.

---

### 4.3 Google Sheets Structure

#### Sheet 1: "Leads" (Main Data)
| Column | Type | Purpose |
|--------|------|---------|
| id | Text | Unique identifier (UUID) |
| name | Text | Student/Lead name |
| phone | Text | Contact number |
| email | Email | Email address |
| status | Dropdown | New/Contacted/Proposal/Won/Lost |
| value | Number | Deal value in ₹ |
| source | Dropdown | Where lead came from |
| interest | Dropdown | Course interest |
| assignedTo | Text | Agent's username |
| lostReason | Text | Why deal was lost |
| createdAt | Date | When lead was created |
| updatedAt | Date | When last modified |

#### Sheet 2: "Activities"
| Column | Purpose |
|--------|---------|
| leadId | Links to Leads sheet |
| type | follow_up, call, email, note |
| note | Activity description |
| timestamp | When activity happened |
| user | Which team member logged it |

#### Sheet 3: "Tasks"
| Column | Purpose |
|--------|---------|
| leadId | Links to Leads sheet |
| title | Task description |
| dueDate | When task is due |
| status | pending/completed/dropped |
| note | Additional details |

#### Sheet 4: "Users"
| Column | Purpose |
|--------|---------|
| id | User identifier |
| username | Login username |
| password | Hashed password |
| name | Full name |
| email | Email address |
| role | admin/agent/user |

#### Sheet 5: "Logs"
| Column | Purpose |
|--------|---------|
| timestamp | When action happened |
| user | Which user did it |
| action | What they did (Create/Update/Delete) |
| message | Description |

#### Sheet 6: "Interests"
| Column | Purpose |
|--------|---------|
| id | Option identifier |
| name | Display name (e.g., "Full Stack", "Web Dev") |

#### Sheet 7: "Settings"
| Column | Purpose |
|--------|---------|
| setting | Key name |
| value | Setting value (Script URL, dropdown options) |

---

## 5. Core Features Explained

### 5.1 Real-Time Sync (The Heartbeat)

**How It Works**:
1. Frontend sets up interval: `setInterval(() => app.store.checkForServerUpdates(), 10000)`
2. Every 10 seconds, frontend asks: "What is the current server timestamp?"
3. Backend returns the `LAST_UPDATE` time
4. If Server Time > Local Time → Another user changed data → Refresh automatically
5. Show notification: "Data updated from other users"

**Code Location**: `checkForServerUpdates()` in index.html (line ~1070)

**Safety Feature**: If user is editing in modal, app shows notification but doesn't refresh until modal closes.

---

### 5.2 View Modes (Kanban / Table / Reports)

**Kanban View**:
- Shows leads as cards in columns (Status-based)
- Each column = New, Contacted, Proposal, Won, Lost
- Visual at a glance of pipeline health
- Renders via `renderKanbanBoard()` function

**Table View**:
- Spreadsheet-style view of all leads
- Sortable columns (click header to sort)
- Filterable (search name, filter by status/agent)
- Bulk operations (select multiple, assign together)
- Renders via `renderTable()` function
- Mobile-optimized: Hidden columns on small screens (hidden/sm:table-cell/md:table-cell)

**Agent Performance Table**:
- Shows agent metrics (total leads, won leads, conversion rate, revenue)
- Ranked by revenue (trophy icon for #1)
- Visual progress bars for conversion rate
- Admin-only view

**Reports/Analytics**:
- KPI cards (Total Leads, Won, Won Value, Conversion Rate)
- Date filter (Till Date, This Day, This Week, This Month)
- Charts and graphs
- Export capability (planned)

---

### 5.3 Lead Modal (CRUD Operations)

**Tabs**:
1. **Info Tab**: Edit lead details (name, email, phone, status, value, source, interest)
2. **Activity Tab**: View timeline (follow-ups, notes, calls)
3. **Task Tab**: Manage action items (create, edit, delete)
4. **Contact Tab**: Quick links (Call via phone, WhatsApp)

**Form Validation**:
- Required fields: name, email, phone
- Email format validation
- Phone format validation (Indian format)

**Auto-Save Features**:
- Autocomplete for source, interest (from Settings sheet)
- Agent assignment dropdown (for admin)

---

### 5.4 Notifications System

**Types**:
- **Success** (Green): Lead saved, operation completed
- **Error** (Red): Validation failed, save error
- **Warning** (Amber): Lead already exists, confirm action
- **Info** (Blue): Data updated from other users, new lead assigned

**Location**: Notification tray (top-left on mobile, top-center on desktop)

**Notification Center**: 
- Sidebar panel
- Shows all recent notifications
- Delete individual notifications
- Clear all button

---

### 5.5 Mobile Responsiveness

**Technique**: Tailwind CSS responsive prefixes

```html
<!-- Hidden on small screens, visible on sm and up -->
<div class="hidden sm:block">Desktop content</div>

<!-- Stack on mobile, grid on desktop -->
<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">Items</div>

<!-- Responsive padding -->
<div class="p-3 sm:p-4 md:p-6">Content</div>

<!-- Hidden columns on mobile, visible on larger screens -->
<th class="hidden md:table-cell">Desktop-only column</th>
```

**Mobile Optimizations**:
- Bottom navigation for easy thumb access
- Larger touch targets (44px minimum)
- Simplified modals (full-screen on mobile, centered on desktop)
- Responsive text sizing (text-xs sm:text-sm)
- Horizontal scrolling for tables (when necessary)

---

### 5.6 User Authentication

**Login Flow**:
1. User enters username and password on login screen
2. Frontend searches Users sheet for match
3. If found and password matches → Set `currentUser`
4. Hide login screen, show main app
5. Store user in `sessionStorage` (session-based, clears on browser close)

**Roles**:
- **Admin**: Full access (view all leads, manage users, view reports)
- **Agent**: Can see assigned leads, manage own leads
- **User**: Can see assigned leads only (limited access)
- **Superuser**: Same as admin + system configuration

**Why Not Hash Passwords?**: Google Sheets is not secure for passwords. This is a demo app. For production, use Firebase Authentication or OAuth.

---

## 6. How to Extend the Application

### 6.1 Adding a New Field (Example: "Budget")

**Step 1**: Add column to Google Sheet
- Open Google Sheet → Leads sheet
- Add column header "budget" in next available column

**Step 2**: Update HTML form
```javascript
// Find this in index.html (Lead Modal form)
<div>
  <label class="text-xs font-semibold text-slate-600">Budget</label>
  <input type="number" name="budget" placeholder="Enter budget" />
</div>
```

**Step 3**: Update render functions to display the field
```javascript
// In renderTable() function:
<td>${lead.budget || '-'}</td>

// In renderKanbanCard():
<div class="text-sm">Budget: ₹${lead.budget}</div>
```

**Step 4**: Update backend (code.gs)
```javascript
// In doPost() function, add 'budget' to headers array:
const headers = ['id', 'name', 'phone', 'email', 'status', 'value', 'source', 'interest', 'assignedTo', 'lostReason', 'budget'];
```

---

### 6.2 Adding a New View (Example: "Pipeline")

**Step 1**: Add HTML structure
```html
<div id="pipelineView" class="h-full w-full hidden overflow-auto bg-white">
  <!-- Your pipeline UI here -->
</div>
```

**Step 2**: Add render function
```javascript
renderPipeline() {
  // Logic to display pipeline visualization
}
```

**Step 3**: Add view mode case
```javascript
switchViewMode(mode) {
  if (mode === 'pipeline') {
    this.activeView = 'pipeline';
    this.renderPipeline();
  }
}
```

**Step 4**: Add navigation button
```html
<button onclick="app.switchViewMode('pipeline')">Pipeline</button>
```

---

### 6.3 Changing Color Scheme

All colors use Tailwind CSS classes. Search and replace:

| Current | New (Example) |
|---------|---|
| `bg-blue-600` | `bg-purple-600` |
| `text-green-600` | `text-emerald-600` |
| `border-slate-200` | `border-gray-300` |

Common color locations:
- Buttons: `bg-primary` (defined as `#4f46e5` in Tailwind config)
- Status badges: `bg-green-50`, `bg-amber-50`, `bg-red-50`
- Icons: `text-blue-600`, `text-green-600`

---

## 7. Troubleshooting Guide

### Issue: "CORS Error" when loading data
**Cause**: Google Apps Script permissions not set correctly
**Solution**:
1. Open Google Apps Script (apps.script.google.com)
2. Click "Deploy" → "New Deployment"
3. Select "Web App"
4. Set "Execute as: Me"
5. Set "Who has access: Anyone"
6. Copy the URL
7. Paste into Settings sheet (Row 2, Column B)

---

### Issue: Data not saving
**Cause**: 
- Google Sheet locked or unshared
- Backend error in Apps Script
- Network timeout

**Solution**:
1. Check Google Sheets permissions (Share → Anyone with link)
2. Open Apps Script editor → Click "Executions" tab
3. Look for failed doPost() calls
4. Check browser console (F12) for error messages
5. Ensure sheet column headers match exactly (case-sensitive)

---

### Issue: Login not working
**Cause**: 
- Username/password mismatch
- Users sheet not properly set up

**Solution**:
1. Open Users sheet in Google Sheets
2. Verify:
   - Column A: id (unique)
   - Column B: username (the login username)
   - Column C: password (plain text in this demo)
   - Column D: name
   - Column E: email
   - Column F: role
3. Try exact username from sheet

---

### Issue: Notifications not appearing
**Cause**: 
- Notification service not initialized
- CSS classes hidden

**Solution**:
1. Open browser DevTools (F12)
2. Type: `app.notify('Test message', 'success')`
3. Look for notification tray at top
4. Check if `notificationTray` element exists in HTML
5. Verify CSS classes not conflicting

---

## 8. Performance Optimization Tips

### Current Bottlenecks
- Google Sheets read/write operations (slow)
- Large datasets rendering all at once

### Optimization Strategies
1. **Pagination**: Only load 50 leads at a time
2. **Virtual Scrolling**: Render only visible rows
3. **Caching**: Store data locally in IndexedDB
4. **Lazy Loading**: Load images as they come into view
5. **Compression**: Minify index.html and code.gs

---

## 9. Security Considerations

### Current Implementation (Demo-level)
- ✅ Client-side validation
- ✅ Server-side validation
- ❌ No encryption
- ❌ Plain-text passwords
- ❌ No rate limiting

### Production Recommendations
- 🔐 Use Firebase Authentication or OAuth
- 🔐 Hash passwords (bcrypt)
- 🔐 HTTPS only
- 🔐 Rate limiting on API
- 🔐 CORS restrictions
- 🔐 Input sanitization

---

## 10. Deployment Checklist

### Before Going Live
- [ ] Test on mobile devices
- [ ] Test with multiple users simultaneously
- [ ] Verify Google Sheets shared with correct permissions
- [ ] Test all CRUD operations (Create, Read, Update, Delete)
- [ ] Backup Google Sheet
- [ ] Update branding (colors, logo)
- [ ] Set up monitoring/error tracking
- [ ] Create user documentation
- [ ] Train team on how to use

### Deployment Steps
1. **Backend**: Deploy code.gs as Web App
2. **Frontend**: Build and deploy to Netlify/Vercel
3. **Configuration**: Set SCRIPT_URL in Settings sheet
4. **Testing**: Verify end-to-end workflow
5. **Launch**: Announce to team

---

## 11. File Structure

```
app-shanuzzacademy-lmsv9/
├── index.html              # Main frontend (2936 lines)
├── code.gs                 # Backend script (227 lines)
├── DEVELOPER.md            # This file
├── summary.md              # Project summary
├── package.json            # (Optional) For dependencies
└── .gitignore              # Git ignore rules
```

---

## 12. Version History

| Version | Date | Changes |
|---------|------|---------|
| v9 | Dec 8, 2025 | Mobile optimizations, notification improvements, agent table redesign |
| v8 | Dec 7, 2025 | Add agent filter to Follow ups |
| v7 | Dec 6, 2025 | Notification system enhancements |
| v1 | Nov 2025 | Initial release |

---

## 13. Contact & Support

For questions about the code:
1. Check this documentation
2. Review git commit messages for context
3. Use browser DevTools (F12) to debug
4. Check Google Apps Script logs for backend errors

---

**Last Updated**: December 8, 2025  
**Maintained By**: Development Team  
**Status**: Active Development
