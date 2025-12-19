# LeadFlow India - Vue.js LMS

A modern Learning Management System built with Vue.js 3, TypeScript, and Google Apps Script backend.

## 🚀 Tech Stack

### Frontend

- **Vue.js 3** with Composition API
- **TypeScript** for type safety
- **Vite** for fast development and build
- **Tailwind CSS** for utility-first styling
- **Pinia** for state management
- **Vue Router** for navigation
- **Axios** for HTTP requests

### Backend

- **Google Apps Script** for serverless backend
- **Google Sheets** as database
- **Google OAuth 2.0** for authentication

### Development Tools

- **ESLint** for code linting
- **Prettier** for code formatting
- **PostCSS** with Autoprefixer
- **VS Code** configuration included

## 📦 Project Structure

src/
├── components/         # Reusable Vue components
├── views/             # Page components
├── stores/            # Pinia stores for state management
├── services/          # API services and utilities
├── types/             # TypeScript type definitions
├── router/            # Vue Router configuration
├── assets/            # Static assets
├── main.ts           # Application entry point
├── App.vue           # Root component
└── style.css         # Global styles with Tailwind
 
```text
src/
├── components/         # Reusable Vue components
├── views/             # Page components
├── stores/            # Pinia stores for state management
├── services/          # API services and utilities
├── types/             # TypeScript type definitions
├── router/            # Vue Router configuration
├── assets/            # Static assets
├── main.ts           # Application entry point
├── App.vue           # Root component
└── style.css         # Global styles with Tailwind
```


## 🛠️ Development Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Google Apps Script project (for backend)

### Installation

1. **Clone and install dependencies:**

   ```bash
   npm install
   ```

2. **Configure environment:**

   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your Google Apps Script URL and OAuth credentials:

   ```env
   VITE_API_BASE_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
   VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
   ```

3. **Start development server:**

   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to `http://localhost:3000`

## 📝 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking

## 🔐 Authentication

The application supports two authentication methods:

1. **Email/Password** - Traditional login (implemented via Google Apps Script)
2. **Google OAuth 2.0** - Single sign-on with Google accounts

## 📊 Features

### Current Implementation

- ✅ Modern Vue.js 3 setup with TypeScript
- ✅ Responsive design with Tailwind CSS
- ✅ State management with Pinia
- ✅ Routing with Vue Router
- ✅ Authentication system foundation
- ✅ API service layer for Google Apps Script
- ✅ Development tools configuration

### Planned Features

- 🔄 Lead management system
- 🔄 Task tracking and assignment
- 🔄 Activity logging
- 🔄 Reports and analytics
- 🔄 Google OAuth integration
- 🔄 Offline support
- 🔄 Real-time notifications

## 🔧 Google Apps Script Integration

The frontend communicates with Google Apps Script through:

1. **API Service** ([src/services/api.ts](src/services/api.ts)) - HTTP client with interceptors
2. **GAS Helper** ([src/services/api.ts](src/services/api.ts)) - Google Apps Script specific functions
3. **Type Definitions** ([src/types/index.ts](src/types/index.ts)) - Shared data structures

### Backend Functions Expected

- `doGet()` - Sync data with optional differential sync
- `createLead(leadData)` - Create new lead
- `updateLead(id, updates)` - Update existing lead
- `deleteLead(id)` - Delete lead
- Authentication functions for login/validation

## 🎨 UI Components

The application includes several view components:

- **Login** - Authentication interface
- **Dashboard** - Main overview with stats and quick actions
- **Leads** - Lead management (placeholder)
- **Activities** - Activity tracking (placeholder)
- **Tasks** - Task management (placeholder)
- **Reports** - Analytics and reporting (placeholder)

## 🔄 State Management

Pinia stores handle application state:

- **Auth Store** ([src/stores/auth.ts](src/stores/auth.ts)) - User authentication and profile
- **Leads Store** ([src/stores/leads.ts](src/stores/leads.ts)) - Lead data and operations
- **App Store** ([src/stores/app.ts](src/stores/app.ts)) - UI state and notifications

## 🌐 Deployment

### Development

The application runs on Vite dev server at `http://localhost:3000`

### Production

1. Build the application:

   ```bash
   npm run build
   ```

2. Deploy the `dist/` folder to your hosting provider (Netlify, Vercel, etc.)

3. Configure environment variables in your hosting provider

## 📱 Progressive Web App (PWA)

The application includes PWA configuration:

- Mobile-first responsive design
- Touch-friendly interface
- Offline-ready foundation

## 🤝 Contributing

1. Follow the TypeScript and Vue 3 Composition API patterns
2. Use Pinia for state management
3. Follow the ESLint and Prettier configurations
4. Add type definitions for new features
5. Test with the development server before committing

## 📄 License

MIT License - see LICENSE file for details.

---

**Previous Version**: The original vanilla HTML/JS implementation has been backed up to `index-backup.html` for reference.