# Shanuzz Academy LMS v9

A lightweight, mobile-first Lead Management System designed for educational academies. It features Kanban and Table views, real-time multi-user sync, and seamless integration with Google Sheets for data storage.

## 🌟 Key Features

### Core Functionality
- **Kanban Board**: Visual lead management with status columns (New, Contacted, Proposal, Won, Lost)
- **Leads Table**: Spreadsheet-style view with sorting, filtering, and bulk operations
- **Agent Performance Table**: Real-time metrics showing leads, conversions, and revenue
- **Reports & Analytics**: Pipeline insights with KPI cards and date filters
- **Real-Time Sync**: 10-second heartbeat polling for collaborative multi-user updates

### Lead Management
- Create, edit, and delete leads
- Track lead status, value, source, and interest
- Assign leads to agents
- Log follow-ups and activities
- Manage tasks with due dates and priorities
- View activity timeline for each lead

### Mobile Optimization
- Mobile-first responsive design (sm:, md:, lg: breakpoints)
- Bottom navigation for easy thumb access
- Touch-friendly buttons and inputs (44px minimum)
- Optimized table columns (hidden/visible by screen size)
- Full-screen modals on mobile, centered on desktop

### Communication Integration
- One-tap Phone Calls (+91 prefix handling)
- Direct WhatsApp chat links
- Quick contact actions (Call, WhatsApp)

### Follow-Up Dashboard
- Categorized follow-ups: Overdue, Today, Upcoming
- Agent filter (Admin/Superuser only)
- Quick access from sidebar

### Role-Based Access Control (RBAC)
- **Superuser**: Complete system access (cannot be deleted)
- **Admin**: Manage leads, users, and settings
- **Agent**: View and manage assigned leads only
- **User**: Limited access (read-only)

### Notifications
- Real-time change notifications
- Multi-type alerts (success, error, warning, info)
- Detailed change tracking ("User X changed Field from Old to New")
- Notification center for history
- Toast notifications with auto-dismiss

## 🛠️ Setup Guide

### 1. Google Sheet Setup (Backend)

1. Create a new Google Sheet
2. Rename the sheet tabs exactly (Case Sensitive):
   - **Leads** - Main lead data
   - **Activities** - Follow-ups, notes, calls
   - **Tasks** - Action items
   - **Users** - Team members
   - **Logs** - Audit trail
   - **Interests** - Course options
   - **Settings** - App configuration

3. Initialize data:
   - **Interests Tab**: Headers in Row 1: `Name` | `Value`. Add course names and pricing
   - **Settings Tab**: Headers in Row 1: `Location` | `Source`. Add cities and lead sources
   - **Users Tab**: Create initial users with headers: `id` | `username` | `password` | `name` | `email` | `role`

### 2. Google Apps Script Deployment

1. Open your Google Sheet
2. Go to **Extensions > Apps Script**
3. Paste the provided `code.gs` file into the editor
4. Click **Deploy > New Deployment**
5. Configuration:
   - Type: **Web App**
   - Description: Shanuzz Academy LMS API
   - Execute as: **Me** (your account)
   - Who has access: **Anyone** (critical for functionality)
6. Click **Deploy** and copy the Web App URL (ends in `/exec`)

### 3. Application Configuration (Frontend)

1. Open `index.html` in a web browser
2. Use your default superuser credentials to login (or create one)
3. Open the **Menu (≡)** → **Settings > SYS Config**
4. Paste your **Google Apps Script Web App URL** into the field
5. Click **Save & Sync**
6. Wait for data to load

## 👥 User Roles & Capabilities

| Role | Create Leads | Edit Leads | Delete Leads | Manage Users | View Reports | View Agent Table |
|------|---|---|---|---|---|---|
| **Superuser** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Admin** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Agent** | ✅ | ✅ (own) | ❌ | ❌ | ✅ | ❌ |
| **User** | ❌ | ✅ (own) | ❌ | ❌ | ❌ | ❌ |

### Adding a New User

1. Login as **Superuser** or **Admin**
2. Go to **Menu > Settings > SYS Config**
3. Scroll to "User Management" section
4. Fill in the form with:
   - Username (unique login name)
   - Password
   - Full Name
   - Email
   - Role (superuser, admin, agent, user)
5. Click **Add User**

## 📱 Usage Tips

### Navigation
- **Bottom Nav (Mobile)**: Board, Leads, Reports, More
- **Hamburger Menu (≡)**: Full navigation menu
- **Views**: Kanban Board, Leads Table, Agent Performance, Reports

### Lead Management
- Click lead name to open details modal
- Edit info, add activities, create tasks
- Call or WhatsApp directly from Contact tab
- Follow-ups automatically logged in Activities

### Table Features
- **Sort**: Click column header to sort
- **Filter**: Use search and status/agent filters
- **Bulk Select**: Check boxes to select multiple leads
- **Bulk Assign**: Select multiple leads and assign to agent

### Kanban Board
- Cards show lead name, status, and value
- Mobile tabs for easy status switching
- Status categories: New, Contacted, Proposal, Won, Lost

### Reports
- View pipeline metrics (total, won, conversion rate, revenue)
- Filter by date range (Till Date, This Day, This Week, This Month)
- Export functionality (planned)

## ⚠️ Troubleshooting

### "Invalid Credentials"
- Verify username and password are correct
- Ensure the Users sheet has been populated
- Check that user role is not "User" (limited access)

### "Sync Failed" or "Cannot Load Data"
1. Check your internet connection
2. Verify Google Apps Script URL in Settings is correct
3. Ensure Google Sheet is shared (Share > Anyone with link)
4. Check that Apps Script deployment access is set to "Anyone"
5. Look at browser console (F12) for error messages

### Data Not Saving
1. Verify Google Sheet has write permissions
2. Check Apps Script execution logs for errors
3. Ensure all required columns exist in sheets
4. Try clicking "Force Sync" (refresh icon in header)

### Notifications Not Appearing
1. Check browser notifications are enabled
2. Verify notification tray is visible at top of screen
3. Open browser console (F12) and check for JavaScript errors

### Empty Dropdowns
1. Go to your Google Sheet
2. Verify data exists in **Interests** and **Settings** tabs
3. Click refresh icon in app header to force sync

## 🔒 Security Notes

- This is a demo app with plain-text passwords
- For production use, implement proper authentication (Firebase, OAuth)
- Keep your Google Apps Script URL confidential
- Use HTTPS only in production
- Regularly backup your Google Sheet

## 📊 Data Structure

### Leads Sheet
Columns: id, name, phone, email, status, value, source, interest, assignedTo, lostReason, createdAt, updatedAt

### Activities Sheet
Columns: leadId, type, note, timestamp, user, changes (JSON for tracking what changed)

### Tasks Sheet
Columns: leadId, title, dueDate, status, note

### Users Sheet
Columns: id, username, password, name, email, role

## 🚀 Getting Started Checklist

- [ ] Create Google Sheet with required tabs
- [ ] Add initial data (Interests, Settings)
- [ ] Deploy Google Apps Script
- [ ] Open index.html in browser
- [ ] Configure Web App URL in Settings
- [ ] Create admin users
- [ ] Test creating a lead
- [ ] Test multi-user sync (open in 2 tabs)
- [ ] Test mobile responsiveness
- [ ] Share with your team

## 💡 Best Practices

1. **Regular Backups**: Backup your Google Sheet weekly
2. **Data Cleanup**: Archive old/lost leads periodically
3. **User Training**: Teach team about follow-ups and activity logging
4. **Consistent Naming**: Use same terms for location, source, interest
5. **Monitor Performance**: Check app with growing data (1000+ leads may slow down)

## 📞 Support

For technical questions, refer to `DEVELOPER.md` for detailed code documentation and troubleshooting guides.