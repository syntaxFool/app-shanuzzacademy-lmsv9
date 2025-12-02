LeadFlow India - Mobile CRM

A lightweight, mobile-first Customer Relationship Management (CRM) tool designed for Indian businesses. It features a Kanban board interface, Role-Based Access Control (RBAC), and seamless integration with Google Sheets for data storage.

🌟 Key Features

Mobile-First Design: Optimized for touch interactions with a responsive layout.

Kanban & Table Views: Switch between a drag-and-drop board and a detailed list view.

Indian Localization:

Currency formatting (₹ Lakhs/Crores).

Phone number prefix (+91) handling.

Role-Based Access Control (RBAC):

Superuser: Complete control (cannot be deleted).

Admin: Manage users and app settings (Max 2).

Agent: Manage leads only (Max 10).

Communication Integration:

One-tap Phone Calls.

Direct WhatsApp chat links.

Smart Fields:

Interests: Multi-select with auto-sum valuation.

Autocomplete: Suggestions for Location and Lead Source based on settings.

Activity Timeline: Log calls, meetings, notes, and file attachments.

Follow-Up Dashboard: dedicated panel for Overdue, Today, and Upcoming tasks.

🛠️ Setup Guide

1. Google Sheet Setup (Backend)

Create a new Google Sheet.

Rename the tabs at the bottom exactly as follows (Case Sensitive):

Leads

Activities

Users

Logs

Interests

Settings

Initialize Data:

Interests Tab: Add headers Name (Col A) and Value (Col B). Fill with your services and prices.

Settings Tab: Add headers Locations (Col A) and Sources (Col B). Fill with your city names and lead sources.

2. Google Apps Script Deployment

In your Google Sheet, go to Extensions > Apps Script.

Paste the provided backend code (code.gs) into the editor.

Click Deploy > New Deployment.

Configuration:

Select type: Web App.

Description: LeadFlow API.

Execute as: Me.

Who has access: Anyone (Crucial for the app to work).

Click Deploy and copy the Web App URL (ends in /exec).

3. Application Configuration (Frontend)

Open the index.html file in your browser.

Login using the default Superuser credentials:

Username: nox1

Password: 1233

Open the Menu (top left) and go to Settings > User Config & DB.

Paste your Web App URL into the "Google Apps Script URL" field.

Click Save & Sync.

👥 User Roles & Management

Role

Capabilities

Limits

Superuser

Full access. Cannot be deleted. Restored if missing.

1 (Fixed)

Admin

Add/Edit Leads, Delete Leads, Manage Users, App Config.

Max 2

Agent

Add/Edit Leads, Log Activities. Cannot delete leads or manage users.

Max 10

To Add a User:

Login as Superuser or Admin.

Go to Menu > Settings > User Config.

Fill in the "Add New User" form.

📱 Usage Tips

WhatsApp: Clicking the WhatsApp button automatically opens a chat with the lead. It handles numbers with or without the +91 prefix intelligently.

Drag & Drop: On the Kanban board, drag a card to a new column to update its status immediately.

Auto-Sum: Selecting multiple interests (e.g., "SEO" + "Website") will automatically calculate and fill the "Value" field.

Search: Use the autocomplete in Location and Source fields to keep your data clean and consistent.

⚠️ Troubleshooting

"Invalid Credentials": Ensure you are typing the password exactly. If you cleared your browser cache, use the default nox1 / 1233.

"Sync Failed":

Check your internet connection.

Verify the Web App URL in settings is correct.

Ensure the Google Script deployment access is set to "Anyone".

Dropdowns Empty: Go to the Google Sheet, ensure data is in the Interests or Settings tabs, and click Force Sync (Refresh icon in header).