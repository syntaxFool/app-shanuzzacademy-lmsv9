# Reliable CORS Setup: Google Apps Script (GAS) + Netlify

This guide documents the most reliable way to achieve Cross-Origin Resource Sharing (CORS) between a Netlify-hosted frontend and a Google Apps Script (GAS) backend, as implemented in this project.

---

## 1. Problem Statement

- **Frontend:** Hosted on Netlify (https://your-app.netlify.app)
- **Backend:** Google Apps Script Web App (https://script.google.com/macros/s/AKfy.../exec)
- **Issue:** By default, browsers block cross-origin requests from Netlify to GAS due to CORS policy.

---

## 2. Solution Overview

**Goal:** Allow the Netlify frontend to make secure AJAX/fetch requests to the GAS backend, with CORS headers set to permit only the Netlify domain.

---

## 3. Google Apps Script: CORS Headers

### Add CORS Headers to All Responses

In your `doGet(e)` and `doPost(e)` functions, always set the following headers:

```javascript
function createCORSResponse(jsonString) {
  return ContentService.createTextOutput(jsonString)
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader('Access-Control-Allow-Origin', 'https://your-app.netlify.app')
    .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type');
}
```

- **Access-Control-Allow-Origin:** Set to your Netlify domain (not '*') for security.
- **Access-Control-Allow-Methods:** Allow only the methods you use (GET, POST, OPTIONS).
- **Access-Control-Allow-Headers:** Allow 'Content-Type' for JSON requests.

### Handle Preflight (OPTIONS) Requests

Google Apps Script does not natively support OPTIONS, but you can handle it like this:

```javascript
function doGet(e) {
  if (e && e.parameter && e.parameter._cors) {
    return ContentService.createTextOutput('')
      .setMimeType(ContentService.MimeType.TEXT)
      .setHeader('Access-Control-Allow-Origin', 'https://your-app.netlify.app')
      .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
      .setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }
  // ...existing code...
}

function doPost(e) {
  if (e && e.parameter && e.parameter._cors) {
    return ContentService.createTextOutput('')
      .setMimeType(ContentService.MimeType.TEXT)
      .setHeader('Access-Control-Allow-Origin', 'https://your-app.netlify.app')
      .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
      .setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }
  // ...existing code...
}
```

- When the browser sends an OPTIONS preflight, append `?_cors=1` to the request URL.
- The script returns the correct CORS headers and an empty body.

---

## 4. Netlify Frontend: Fetch Example

```javascript
fetch('https://script.google.com/macros/s/AKfy.../exec', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ action: 'save_all', ... })
})
.then(res => res.json())
.then(data => { /* handle data */ })
.catch(err => { /* handle error */ });
```

- No special Netlify config is needed if the backend sends correct CORS headers.

---

## 5. Security Best Practices

- **Never use `*` for Access-Control-Allow-Origin** in production. Always specify your Netlify domain.
- **Do not expose sensitive data** in CORS responses.
- **Restrict methods and headers** to only what is needed.

---

## 6. Troubleshooting

- If you see CORS errors, check the browser's Network tab for missing headers.
- Make sure your GAS deployment is set to 'Anyone, even anonymous' (for public APIs) or uses OAuth for private APIs.
- If using custom domains, update the CORS header accordingly.

---

## 7. References

- [Google Apps Script Web Apps and CORS](https://developers.google.com/apps-script/guides/web)
- [MDN: HTTP access control (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Netlify Docs: CORS](https://docs.netlify.com/)

---

## 8. Summary

By explicitly setting CORS headers in all GAS responses and handling preflight requests, you ensure reliable, secure cross-origin communication between your Netlify frontend and Google Apps Script backend.
