# Testing Guide - Shanuzz Academy LMS

## Overview
This guide covers testing authentication flows, features, and deployment of the Shanuzz Academy LMS application.

## Test Environment Setup

### Prerequisites
- Node.js v18 or higher
- npm or yarn
- Google Apps Script backend deployed as a web app
- Valid API endpoint URL

### Start Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:3000/`

## Authentication Testing

### Test Case 1: Successful Login
**Objective**: Verify user can successfully log in with valid credentials

1. Navigate to login page: `http://localhost:3000/login`
2. Enter email: `demo@shanuzz.com`
3. Enter password: `demo123`
4. Click "Sign In"
5. **Expected Result**: 
   - Login success message appears
   - Redirect to dashboard
   - User name displays in header
   - Auth token saved in localStorage

### Test Case 2: Invalid Password
**Objective**: Verify error handling for invalid credentials

1. Navigate to login page
2. Enter email: `demo@shanuzz.com`
3. Enter password: `wrongpassword`
4. Click "Sign In"
5. **Expected Result**:
   - Error message: "Invalid credentials"
   - Stay on login page
   - No auth token saved

### Test Case 3: Invalid Email
**Objective**: Verify email validation

1. Navigate to login page
2. Enter email: `invalid-email`
3. Enter password: `demo123`
4. Click "Sign In"
5. **Expected Result**:
   - Form validation error or API error
   - Cannot submit invalid email

### Test Case 4: Empty Fields
**Objective**: Verify required field validation

1. Navigate to login page
2. Leave email and password empty
3. Click "Sign In"
4. **Expected Result**:
   - Client-side validation error
   - Message: "Please enter both email and password"

### Test Case 5: Logout
**Objective**: Verify logout functionality

1. Log in successfully
2. On dashboard, click "Sign Out" button
3. **Expected Result**:
   - Redirect to login page
   - localStorage cleared (auth token removed)
   - Cannot access dashboard without logging in

### Test Case 6: Session Persistence
**Objective**: Verify session persists across page refreshes

1. Log in successfully
2. Refresh the page
3. **Expected Result**:
   - Stay on dashboard
   - User info still displayed
   - Session maintained

### Test Case 7: Expired Token Handling
**Objective**: Verify handling of expired auth tokens

1. Log in successfully
2. Manually clear localStorage (`localStorage.clear()`)
3. Try to access protected route
4. **Expected Result**:
   - Redirect to login page
   - Error message displayed
   - Cannot access protected routes

## Route Protection Testing

### Test Case 8: Access Protected Routes
**Objective**: Verify only authenticated users can access protected routes

1. Logout (if logged in)
2. Try to access: `http://localhost:3000/dashboard`
3. **Expected Result**: Redirect to login page

### Test Case 9: Access Public Routes
**Objective**: Verify login page is accessible without authentication

1. Logout (if logged in)
2. Access: `http://localhost:3000/login`
3. **Expected Result**: Login page loads successfully

## Feature Navigation Testing

### Test Case 10: Dashboard Navigation
**Objective**: Verify all dashboard links work

1. Log in successfully
2. On dashboard, click each navigation item:
   - Manage Leads
   - View Activities
   - Track Tasks
   - Generate Reports
3. **Expected Result**: Each page loads without errors

### Test Case 11: Quick Access Links
**Objective**: Verify quick access buttons

1. On dashboard, click stat cards
2. Click quick access menu items
3. **Expected Result**: Navigate to respective pages

## Page Functionality Testing

### Test Case 12: Leads Page
**Objective**: Verify leads page loads and displays correctly

1. Navigate to Leads page
2. Verify page layout:
   - Header with back button
   - Add New Lead button
   - Leads table structure
3. **Expected Result**: All elements display correctly

### Test Case 13: Activities Page
**Objective**: Verify activities page loads and displays correctly

1. Navigate to Activities page
2. Verify page layout:
   - Activity feed structure
   - Activity stats displayed
3. **Expected Result**: All elements display correctly

### Test Case 14: Tasks Page
**Objective**: Verify tasks page loads and displays correctly

1. Navigate to Tasks page
2. Verify page layout:
   - Create New Task button
   - Task status tabs
   - Task stats
3. **Expected Result**: All elements display correctly

### Test Case 15: Reports Page
**Objective**: Verify reports page loads and displays correctly

1. Navigate to Reports page
2. Verify page layout:
   - Report filters
   - Key metrics displayed
   - Chart placeholders
3. **Expected Result**: All elements display correctly

## API Integration Testing

### Test Case 16: API Calls
**Objective**: Verify API calls to Google Apps Script backend

**Setup**: Open browser DevTools → Network tab

1. Log in with valid credentials
2. **Expected**: 
   - Login API call to GAS backend
   - Response with success status
   - Token returned and stored

2. Navigate to Leads page
3. **Expected**: 
   - API call to fetch leads
   - Response data displayed (if available)

## Responsive Design Testing

### Test Case 17: Mobile View
**Objective**: Verify app works on mobile devices

1. Open DevTools → Toggle device toolbar
2. Select iPhone 12 (375px width)
3. Navigate through app:
   - Login page responsive
   - Dashboard responsive
   - All buttons clickable
4. **Expected Result**: 
   - Layout adapts to mobile
   - All elements accessible
   - No horizontal scroll

### Test Case 18: Tablet View
**Objective**: Verify app works on tablets

1. Select iPad (768px width)
2. Navigate through app
3. **Expected Result**: 
   - Two-column layout where applicable
   - All elements properly sized

### Test Case 19: Desktop View
**Objective**: Verify app works on desktop

1. Full screen desktop (1920px width)
2. Navigate through app
3. **Expected Result**: 
   - Multi-column layouts display
   - All features accessible

## Browser Compatibility Testing

Test the app on these browsers:
- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Test Case 20: Cross-Browser Login
**Objective**: Verify login works on all browsers

1. Open app in each browser
2. Complete login flow
3. **Expected Result**: Successful login on all browsers

## Performance Testing

### Test Case 21: Load Time
**Objective**: Verify app loads quickly

1. Open DevTools → Lighthouse
2. Run Lighthouse audit
3. **Expected Result**:
   - Performance score > 80
   - First Contentful Paint < 2s
   - Largest Contentful Paint < 4s

### Test Case 22: Asset Loading
**Objective**: Verify all assets load correctly

1. Open DevTools → Network tab
2. Reload page
3. **Expected Result**:
   - All JavaScript files load
   - All CSS files load
   - No 404 errors
   - No console errors

## Error Handling Testing

### Test Case 23: Network Error
**Objective**: Verify error handling when API is down

1. Disable internet connection or block API URL
2. Try to log in
3. **Expected Result**: 
   - Error message displayed
   - App doesn't crash
   - User can retry

### Test Case 24: Console Errors
**Objective**: Verify no console errors

1. Open DevTools → Console tab
2. Complete full app workflow
3. **Expected Result**: 
   - No JavaScript errors
   - No warnings (except expected ones)
   - Clean console

## User Experience Testing

### Test Case 25: Form Validation
**Objective**: Verify user gets clear feedback

1. Try to submit login form with:
   - Empty fields
   - Invalid email
   - Very long password
2. **Expected Result**: Clear validation messages

### Test Case 26: Loading States
**Objective**: Verify loading indicators work

1. Start login process
2. Observe button state
3. **Expected Result**: 
   - Button shows loading spinner
   - Text changes to "Signing in..."
   - Button disabled during request

### Test Case 27: Error Messages
**Objective**: Verify error messages are helpful

1. Trigger various errors
2. Check error messages
3. **Expected Result**: 
   - Messages are clear and helpful
   - Users know what went wrong
   - Suggestions for fixing issues

## Accessibility Testing

### Test Case 28: Keyboard Navigation
**Objective**: Verify app works with keyboard only

1. Disable mouse/trackpad
2. Navigate using Tab, Enter, arrows
3. **Expected Result**: 
   - All interactive elements reachable
   - Tab order logical
   - Enter key submits forms

### Test Case 29: Screen Reader Compatibility
**Objective**: Verify app works with screen readers

1. Use screen reader (NVDA, JAWS, or Mac VoiceOver)
2. Navigate app
3. **Expected Result**: 
   - Page structure clear
   - Form labels associated
   - Button purposes clear

## Testing Checklist

- [ ] All login tests pass
- [ ] Route protection works
- [ ] Dashboard navigation functional
- [ ] All pages load without errors
- [ ] API integration successful
- [ ] Mobile responsive
- [ ] Tablet responsive
- [ ] Desktop responsive
- [ ] Works on Chrome
- [ ] Works on Firefox
- [ ] Works on Safari
- [ ] Works on Edge
- [ ] Performance acceptable
- [ ] No console errors
- [ ] Error handling works
- [ ] Keyboard navigation works
- [ ] Accessibility compliant

## Regression Testing

After each update:
1. Run complete test suite above
2. Focus on changed features
3. Verify no new bugs introduced

## Continuous Testing

- Run tests during development
- Use automated testing (future implementation)
- Test before each deployment
- Monitor production for errors

## Test Environment Variables

For testing, use:
```env
VITE_API_BASE_URL=http://localhost:3000/mock-api
VITE_APP_TITLE=Shanuzz Academy LMS (Test)
NODE_ENV=development
```

## Reporting Issues

When finding bugs:
1. Document exact steps to reproduce
2. Note expected vs actual behavior
3. Include browser and OS info
4. Attach screenshots/videos
5. Check console for errors

---

**Last Updated**: December 19, 2025
**Version**: 1.0.0
