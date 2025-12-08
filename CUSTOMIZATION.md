# Customization Guide - Adapting Shanuzz LMS for Other Departments

This guide explains how to customize the Shanuzz Academy LMS for use in different departments or business units beyond Lead Management. Whether you're using it for HR, Sales, Support, Inventory, or any other department, this document provides step-by-step instructions.

## Table of Contents
1. [General Customization Steps](#general-customization-steps)
2. [Department-Specific Examples](#department-specific-examples)
3. [UI/Branding Changes](#uibranding-changes)
4. [Database Schema Changes](#database-schema-changes)
5. [Field Customization](#field-customization)
6. [Status Workflow Customization](#status-workflow-customization)
7. [Role & Permissions Customization](#role--permissions-customization)

---

## General Customization Steps

### Step 1: Backup Your Current Setup
```bash
git clone https://github.com/syntaxFool/app-shanuzzacademy-lmsv9.git app-[new-department]
```
Create a new folder/branch for your department-specific version.

### Step 2: Update App Name & Branding
Search and replace in `index.html`:
- Find: `Shanuzz Academy LMS` → Replace: `[Department Name] Management System`
- Find: `LeadFlow` → Replace: `[Department Name]`
- Find: Primary color variables

### Step 3: Identify Core Entities
Instead of "Leads," your app might manage:
- **HR Department**: Employees, Job Candidates, Contractors
- **Sales Department**: Customers, Opportunities, Orders
- **Support Department**: Tickets, Issues, Service Requests
- **Inventory Department**: Items, Orders, Suppliers
- **Marketing Department**: Campaigns, Contacts, Subscribers

### Step 4: Customize Google Sheets Structure
Rename and restructure sheets based on your needs (see [Database Schema Changes](#database-schema-changes)).

### Step 5: Test Thoroughly
Test all CRUD operations, views, and filters with your new data model.

---

## Department-Specific Examples

### Example 1: HR Department - Employee Management System

#### What Changes

| Aspect | Lead Management | HR Management |
|--------|-----------------|---------------|
| **Main Entity** | Lead | Employee |
| **Status Values** | New, Contacted, Proposal, Won, Lost | Active, Inactive, On Leave, Terminated |
| **Key Fields** | Name, Phone, Email, Value | Name, ID, Department, Salary, Joining Date |
| **Activities** | Follow-ups, Calls, Meetings | Reviews, Meetings, Training, Performance Notes |
| **Tasks** | Follow-up Tasks | Training, Certifications, Performance Reviews |

#### Implementation Steps

**Step 1: Update Google Sheet**
```
Sheets to keep:
- Employees (renamed from Leads)
- Activities (keep same)
- Tasks (keep same)
- Users (keep same)
- Logs (keep same)
- Departments (new - for dropdown)
- Salaries (new - for payroll reference)
```

**Step 2: Update Employee Sheet Columns**
```
Old Columns (Leads):    New Columns (Employees):
id                      id
name                    name
phone                   phone
email                   email
status          →       status (Active/Inactive/On Leave/Terminated)
value           →       salary (monthly amount)
source          →       department (HR, Sales, IT, etc.)
interest        →       designation (Manager, Developer, etc.)
assignedTo      →       reportingManager (who supervises)
lostReason      →       terminationReason (if applicable)
createdAt       →       joiningDate
updatedAt       →       updatedAt
```

**Step 3: Update in `index.html`**

Find and replace column references:
```javascript
// Find: lead.status
// Replace: employee.status

// Find: lead.value
// Replace: employee.salary

// Find: "Lead" (in strings)
// Replace: "Employee"

// Find: Phone/Email columns
// Keep the same (universal fields)
```

**Step 4: Update Status Values**
```javascript
// Find this in index.html:
this.statusConfig = [
  { id: 'New', color: 'bg-slate-400' },
  { id: 'Contacted', color: 'bg-blue-400' },
  { id: 'Proposal', color: 'bg-yellow-400' },
  { id: 'Won', color: 'bg-green-400' },
  { id: 'Lost', color: 'bg-red-400' }
];

// Replace with:
this.statusConfig = [
  { id: 'Active', color: 'bg-green-400' },
  { id: 'Inactive', color: 'bg-slate-400' },
  { id: 'On Leave', color: 'bg-yellow-400' },
  { id: 'Terminated', color: 'bg-red-400' }
];
```

**Step 5: Update Google Apps Script (code.gs)**
```javascript
// Find: const leads = getSheetData('Leads');
// Replace: const employees = getSheetData('Employees');

// Update all sheet.getRange() calls to use 'Employees' instead of 'Leads'
```

**Step 6: Update UI Labels**
```javascript
// Find: renderTable() function
// In column headers, replace:
// "Name" → "Employee Name"
// "Value" → "Salary"
// "Source" → "Department"
// "Interest" → "Designation"
```

---

### Example 2: Sales Department - Customer & Order Management

#### What Changes

| Aspect | Lead Management | Order Management |
|--------|-----------------|-----------------|
| **Main Entity** | Lead | Order/Customer |
| **Status Values** | New, Contacted, Proposal, Won, Lost | Pending, Processing, Shipped, Delivered, Cancelled |
| **Key Fields** | Name, Phone, Email, Value | Order ID, Customer Name, Total, Delivery Date |
| **Activities** | Follow-ups, Calls | Order Updates, Shipping, Delivery Confirmations |
| **Tasks** | Follow-up Tasks | Fulfillment, QC, Packing |

#### Implementation Steps

**Step 1: Update Google Sheet**
```
Sheets:
- Orders (renamed from Leads)
- Customers (new - customer master data)
- Activities (keep same - for order updates)
- Tasks (keep same - for fulfillment tasks)
- Inventory (new - product stock levels)
```

**Step 2: Update Orders Sheet Columns**
```
id                      orderId
name                    customerName
phone                   customerPhone
email                   customerEmail
status          →       orderStatus (Pending/Processing/Shipped/Delivered/Cancelled)
value           →       totalAmount
source          →       paymentMethod (UPI/Card/Cash/Cheque)
interest        →       productCategory
assignedTo      →       assignedWarehouse
lostReason      →       cancellationReason
createdAt       →       orderDate
updatedAt       →       lastUpdatedDate
```

**Step 3: Update Status Workflow**
```javascript
this.statusConfig = [
  { id: 'Pending', color: 'bg-slate-400' },
  { id: 'Processing', color: 'bg-blue-400' },
  { id: 'Shipped', color: 'bg-yellow-400' },
  { id: 'Delivered', color: 'bg-green-400' },
  { id: 'Cancelled', color: 'bg-red-400' }
];
```

---

### Example 3: Support Department - Ticket Management System

#### What Changes

| Aspect | Lead Management | Ticket Management |
|--------|-----------------|------------------|
| **Main Entity** | Lead | Ticket/Issue |
| **Status Values** | New, Contacted, Proposal, Won, Lost | Open, In Progress, Waiting, Resolved, Closed |
| **Priority** | None | High, Medium, Low |
| **Key Fields** | Name, Phone, Email, Value | Ticket ID, Subject, Category, Priority, SLA |
| **Activities** | Follow-ups, Calls | Support Responses, Escalations, Updates |
| **Tasks** | Follow-up Tasks | Resolution Steps, Follow-up Actions |

#### Implementation Steps

**Step 1: Add Priority Field**
```
Add a new column to the Tickets sheet:
- priority (dropdown: High, Medium, Low)
- slaDeadline (when ticket must be resolved)
- category (Bug, Feature Request, Support, Billing)
```

**Step 2: Update Status Config**
```javascript
this.statusConfig = [
  { id: 'Open', color: 'bg-red-400' },
  { id: 'In Progress', color: 'bg-blue-400' },
  { id: 'Waiting', color: 'bg-yellow-400' },
  { id: 'Resolved', color: 'bg-green-400' },
  { id: 'Closed', color: 'bg-slate-400' }
];
```

**Step 3: Add Priority Styling**
```javascript
// In renderTable() or renderKanbanCard():
const priorityColors = {
  'High': 'bg-red-100 text-red-800',
  'Medium': 'bg-yellow-100 text-yellow-800',
  'Low': 'bg-blue-100 text-blue-800'
};

// Display priority badge:
<span class="${priorityColors[ticket.priority]}">${ticket.priority}</span>
```

---

## UI/Branding Changes

### 1. Update App Title & Logo
**File**: `index.html`

Find and replace:
```html
<!-- Line ~140 -->
<h1 class="text-2xl font-bold text-slate-800" id="loginTitle">LeadFlow</h1>

<!-- Replace with: -->
<h1 class="text-2xl font-bold text-slate-800" id="loginTitle">[Your Department Name]</h1>
```

### 2. Change Primary Color
**File**: `index.html`

Find (around line 108):
```javascript
tailwind.config = { 
  theme: { 
    extend: { 
      colors: { 
        primary: '#4f46e5',  // Current indigo
        secondary: '#64748b' 
      } 
    } 
  } 
}
```

Replace with your department colors:
```javascript
// HR Department (Green)
primary: '#059669'

// Sales Department (Blue)
primary: '#2563eb'

// Support Department (Purple)
primary: '#7c3aed'

// Inventory (Orange)
primary: '#ea580c'
```

### 3. Update Menu Labels
**File**: `index.html`

Find the sidebar menu labels and update:
```javascript
// Find and replace in renderMenu() or similar
"Kanban Board" → "Status Board" / "Ticket Board"
"Leads Table" → "Employees Table" / "Orders Table" / "Tickets Table"
"Reports" → "Analytics" / "Performance"
"Follow Ups" → "Follow Ups" / "SLA Tracking" / "Pending Tasks"
```

### 4. Update Icon Semantics
Keep the icons but adjust context:
```html
<!-- Current -->
<i class="ph-bold ph-users"></i> <!-- Agent Table -->

<!-- Change label to match department -->
<i class="ph-bold ph-users"></i> <!-- Department Heads / Managers / Support Team -->
```

---

## Database Schema Changes

### Step-by-Step Schema Redesign

#### Step 1: Identify Your Main Entity
```
Lead Management:  Leads
HR:              Employees
Sales:           Customers / Orders
Support:         Tickets
Inventory:       Items / Stock
Marketing:       Campaigns / Contacts
```

#### Step 2: Define Core Fields
Every system needs:
```
✅ Unique ID
✅ Name/Title
✅ Status
✅ Date Fields (created, updated)
✅ Owner/Assigned To
✅ Notes/Description

❓ Optional:
  - Value/Amount
  - Category/Type
  - Priority
  - Deadline
  - Custom fields
```

#### Step 3: Create New Sheet Headers
**Example for HR System:**
```
Google Sheet "Employees":
A: id (unique identifier)
B: name (full name)
C: email (work email)
D: phone (contact number)
E: employeeId (company ID)
F: department (Sales, HR, IT, etc.)
G: designation (Manager, Developer, etc.)
H: salary (monthly amount)
I: status (Active, Inactive, On Leave, Terminated)
J: reportingManager (supervisor username)
K: joiningDate (when hired)
L: updatedAt (last modified)
```

#### Step 4: Update Code.gs
```javascript
// In doGet():
function doGet(e) {
  const data = {
    employees: getSheetData('Employees'),  // Changed from 'Leads'
    activities: getSheetData('Activities'),
    tasks: getSheetData('Tasks'),
    users: getSheetData('Users'),
    logs: getSheetData('Logs'),
    departments: getSheetData('Departments'),  // New
    lastModified: PropertiesService.getScriptProperties().getProperty('LAST_UPDATE')
  };
  // ... rest of function
}

// In doPost():
// Update writeSheet() to use 'Employees' instead of 'Leads'
const targetSheet = 'Employees';  // Was 'Leads'
```

---

## Field Customization

### Adding New Fields

#### Example: Adding "Priority" to Support Tickets

**Step 1: Add Column to Google Sheet**
```
Tickets sheet, Column J: priority
Add dropdown validation: High | Medium | Low
```

**Step 2: Update Modal Form in index.html**
```html
<!-- Find the lead modal form -->
<!-- Add new field: -->
<div>
  <label class="text-xs font-semibold text-slate-600">Priority</label>
  <select name="priority" class="w-full border border-slate-300 rounded px-3 py-2">
    <option value="">Select Priority</option>
    <option value="High">High</option>
    <option value="Medium">Medium</option>
    <option value="Low">Low</option>
  </select>
</div>
```

**Step 3: Update Table Display**
```javascript
// In renderTable() function:
<td class="px-3 py-2">
  <span class="px-2 py-1 rounded text-xs font-medium ${getPriorityClass(lead.priority)}">
    ${lead.priority || '-'}
  </span>
</td>

// Add helper function:
getPriorityClass(priority) {
  const classes = {
    'High': 'bg-red-100 text-red-700',
    'Medium': 'bg-yellow-100 text-yellow-700',
    'Low': 'bg-blue-100 text-blue-700'
  };
  return classes[priority] || 'bg-slate-100 text-slate-700';
}
```

**Step 4: Update Code.gs**
```javascript
// In doPost(), add 'priority' to headers:
const headers = ['id', 'name', 'email', 'phone', 'status', 'priority', ...];
```

### Removing Unused Fields

**Example: Remove "Source" field if not needed**

1. Remove from Google Sheet columns
2. Remove from modal form in index.html
3. Remove from table columns in renderTable()
4. Remove from code.gs headers array
5. Test that saves still work

---

## Status Workflow Customization

### Current Status Workflow (Lead Management)
```
New → Contacted → Proposal → Won/Lost
```

### Custom Workflows for Other Departments

#### HR Department Workflow
```
Active (main status)
├─ Active (working)
├─ On Leave (temporary)
└─ Terminated (ended)
```

#### Support Ticket Workflow
```
Open → In Progress → Resolved → Closed
       ↓
    Waiting (customer response)
```

#### Sales Order Workflow
```
Pending → Processing → Shipped → Delivered
        ↓
     Cancelled
```

#### Implementation
```javascript
// Find statusConfig in index.html:
this.statusConfig = [
  { id: 'New', color: 'bg-slate-400', order: 1 },
  { id: 'Contacted', color: 'bg-blue-400', order: 2 },
  { id: 'Proposal', color: 'bg-yellow-400', order: 3 },
  { id: 'Won', color: 'bg-green-400', order: 4 },
  { id: 'Lost', color: 'bg-red-400', order: 5 }
];

// Replace with your workflow:
this.statusConfig = [
  { id: 'Open', color: 'bg-red-400', order: 1 },
  { id: 'In Progress', color: 'bg-blue-400', order: 2 },
  { id: 'Waiting', color: 'bg-yellow-400', order: 3 },
  { id: 'Resolved', color: 'bg-green-400', order: 4 },
  { id: 'Closed', color: 'bg-slate-400', order: 5 }
];
```

---

## Role & Permissions Customization

### Current Roles
```
Superuser → Full access
Admin      → Manage leads, users, settings
Agent      → Manage own leads only
User       → View only (read-only access)
```

### Department-Specific Roles

#### HR Department
```
HR Manager     → Full access (hire, terminate, manage all employees)
Department Head → Manage department employees only
Employee       → View own profile, request leave
```

#### Support Department
```
Support Manager → Assign tickets, manage team, view reports
Support Agent   → Respond to tickets assigned to them
Admin          → Overall system management
```

### Implementation in index.html

Find role-checking code:
```javascript
// Current:
if (this.currentUser.role === 'admin' || this.currentUser.role === 'superuser') {
  // Show admin features
}

// Change to:
if (this.currentUser.role === 'hr_manager' || this.currentUser.role === 'superuser') {
  // Show HR features
}
```

Update role definitions in Users sheet:
```
Instead of:  superuser, admin, agent, user
Use:         superuser, hr_manager, department_head, employee, guest
            OR
             superuser, support_manager, support_agent, customer, guest
```

---

## Testing Checklist

After customizing, test each item:

### Functionality Tests
- [ ] Login with different roles works
- [ ] Create new record works
- [ ] Edit record works
- [ ] Delete record works (if allowed)
- [ ] View switches work (Board/Table/Reports)
- [ ] Search/Filter works with new fields
- [ ] Sorting works on all columns
- [ ] Bulk operations work

### Data Tests
- [ ] New fields save to Google Sheet
- [ ] Status workflow transitions correctly
- [ ] Dropdowns populate from Settings sheet
- [ ] Date fields format correctly
- [ ] Currency/Numbers display correctly

### Mobile Tests
- [ ] Mobile responsive on all screen sizes
- [ ] Touch buttons work (not too small)
- [ ] Bottom nav works
- [ ] Modal opens/closes on mobile
- [ ] Tables scroll horizontally if needed

### Multi-User Tests
- [ ] Real-time sync works (10-second updates)
- [ ] Changes from User A appear for User B
- [ ] Notifications show updates
- [ ] No data conflicts when editing simultaneously

### UI Tests
- [ ] Colors match department branding
- [ ] Labels match new terminology
- [ ] No broken references to old field names
- [ ] Icons still make sense in context

---

## Quick Reference: Common Customizations

### 1. Change "Lead" to "Employee" Everywhere
```bash
# In code editor, use Find & Replace:
Find: lead
Replace: employee

Find: Lead
Replace: Employee

Find: leads
Replace: employees

Find: Leads
Replace: Employees
```

### 2. Change Status Column Name
```javascript
// In renderTable() header:
Find: "Status"
Replace: "Current State" / "Progress" / "Ticket Status"
```

### 3. Add New Dropdown Options
1. Go to Google Sheet > Settings tab
2. Add new column: e.g., "Categories"
3. In index.html, find setupAutocomplete()
4. Add new field mapping

### 4. Change Table View Columns
```javascript
// In renderTable() function:
// Hide column:
<td class="hidden md:table-cell">Column</td>

// Show column on all sizes:
<td class="p-3">Column</td>

// Remove column entirely:
// Delete the <td> line
```

### 5. Create Department-Specific Reports
```javascript
// Find renderReports() function
// Add new section:

// Employees by Department
// Tickets by Priority
// Orders by Status
// etc.
```

---

## Migration Path: From Lead Management to New Department

### Phase 1: Backup & Setup (1-2 hours)
- [ ] Clone current setup to new folder
- [ ] Create backup of original Google Sheet
- [ ] Create new Google Sheet for new department

### Phase 2: Schema Design (2-3 hours)
- [ ] List all required fields
- [ ] Design Google Sheets structure
- [ ] Define status workflow
- [ ] Plan role hierarchy

### Phase 3: Code Customization (4-6 hours)
- [ ] Update Google Sheet tabs
- [ ] Update index.html labels and forms
- [ ] Update code.gs sheet references
- [ ] Change color scheme and branding

### Phase 4: Testing (2-4 hours)
- [ ] Functionality testing
- [ ] Data testing
- [ ] Mobile testing
- [ ] Multi-user testing
- [ ] Performance testing

### Phase 5: Launch (1 hour)
- [ ] Deploy to web
- [ ] Share with team
- [ ] Train users
- [ ] Monitor for issues

---

## Need Help?

### For Code Questions
- Refer to `DEVELOPER.md` for technical details
- Check git commit history for similar changes
- Use browser DevTools (F12) to debug

### For Setup Questions
- Refer to `summary.md` for setup instructions
- Verify Google Sheet permissions
- Check Google Apps Script logs

### For Department-Specific Customizations
1. Identify your main entity and fields
2. Update Google Sheets schema
3. Customize code using examples in this guide
4. Test thoroughly before launch
5. Train your team on usage

---

**Last Updated**: December 8, 2025  
**For Version**: Shanuzz Academy LMS v9  
**Status**: Complete & Ready for Customization
