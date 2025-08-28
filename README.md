# Modern Next.js Authentication & Dashboard

A production-ready Next.js application with **FastAPI backend integration** using HTTP-only cookies, modern UI components, and a beautiful dashboard interface.

## ✨ Features

### 🔐 **FastAPI Backend Integration**
- **HTTP-Only Cookies**: Tokens managed entirely by FastAPI backend
- **Server-Only Token Management**: Frontend never handles tokens directly
- **Automatic Token Refresh**: Seamless token renewal with axios interceptors
- **Server-Side Validation**: All authentication validated by FastAPI
- **Route Protection**: Middleware-based route protection with automatic redirects
- **Zero Client-Side Token Storage**: No localStorage or sessionStorage usage

### 🎨 Modern UI/UX
- **Tailwind CSS**: Utility-first styling with custom design tokens
- **Shadcn UI Components**: Reusable, accessible UI components
- **Responsive Design**: Mobile-first approach with tablet and desktop optimization
- **Smooth Animations**: Subtle transitions and hover effects
- **Dark Mode Ready**: CSS variables for easy theme switching
- **Loading States**: Consistent loading indicators throughout the app

### 📱 Components & Pages
- **Landing Page**: Modern hero section with features and call-to-action
- **Authentication Pages**: Beautiful sign-in and sign-up forms
- **Dashboard**: Comprehensive dashboard with stats, quick actions, and activity feed
- **Protected Routes**: Secure access control for authenticated users
- **Loading Components**: Reusable loading states and spinners

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- FastAPI backend running (see backend requirements below)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd codespaces-blank
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=https://your-fastapi-backend.com
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   │   ├── sign-in/       # Sign in page
│   │   └── sign-up/       # Sign up page
│   ├── dashboard/         # Protected dashboard
│   ├── globals.css        # Global styles and design tokens
│   ├── layout.js          # Root layout with AuthProvider
│   ├── middleware.js      # Route protection middleware
│   └── page.js            # Landing page
├── components/            # Reusable components
│   ├── ui/               # Shadcn UI components
│   │   ├── button.js     # Button component
│   │   ├── input.js      # Input component
│   │   ├── label.js      # Label component
│   │   └── loading.js    # Loading components
│   └── ProtectedRoute.js # Route protection component
├── context/              # React Context
│   └── AuthContext.js    # Authentication context (FastAPI integration)
└── lib/                  # Utility libraries
    ├── api.js           # Axios configuration with interceptors
    ├── utils.js         # Utility functions
    └── validators.js    # Zod validation schemas
```

## 🔧 Key Improvements Made

### 🔒 **FastAPI Backend Integration**
1. **Complete Backend Integration**: All authentication handled by FastAPI
2. **HTTP-Only Cookies**: Tokens managed entirely by backend
3. **Automatic Token Refresh**: Seamless token renewal with axios interceptors
4. **Server-Side Validation**: All authentication validated by FastAPI
5. **Proper Error Handling**: FastAPI error responses handled correctly

### 🎨 **UI/UX Enhancements**
1. **Modern Design System**: Implemented comprehensive design tokens
2. **Component Library**: Created reusable UI components with variants
3. **Responsive Layout**: Mobile-first responsive design
4. **Loading States**: Consistent loading indicators
5. **Animations**: Smooth transitions and micro-interactions
6. **Accessibility**: Proper ARIA labels and keyboard navigation

## 🚀 Usage Examples

### Using Authentication Context
```jsx
import { useAuth } from "@/context/AuthContext"

function MyComponent() {
  const { user, signin, signout, isAuthenticated, loading } = useAuth()
  
  if (loading) return <LoadingSpinner />
  
  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user.name}!</p>
      ) : (
        <p>Please sign in</p>
      )}
    </div>
  )
}
```

### Protected Routes
```jsx
import ProtectedRoute from "@/components/ProtectedRoute"

export default function MyProtectedPage() {
  return (
    <ProtectedRoute>
      <div>This content is only visible to authenticated users</div>
    </ProtectedRoute>
  )
}
```

### Authentication Operations
```jsx
import { useAuth } from "@/context/AuthContext"

function LoginForm() {
  const { signin } = useAuth()
  
  const handleLogin = async (credentials) => {
    const success = await signin(credentials)
    if (success) {
      // User is now authenticated
      // Cookies are automatically set by FastAPI backend
    }
  }
}
```

### API Calls with Automatic Refresh
```jsx
import api from "@/lib/api"

// Cookies are automatically included
// Token refresh happens automatically on 401 errors
const response = await api.get("/api/protected-data")
```

## 🔒 Security Features

- **HTTP-Only Cookies**: Tokens managed entirely by FastAPI backend
- **Automatic Token Refresh**: Seamless token renewal with axios interceptors
- **Server-Side Validation**: All authentication validated by FastAPI
- **XSS Protection**: No client-side token storage
- **CSRF Protection**: SameSite cookie attributes
- **Route Protection**: Server-side and client-side guards

## 🔧 FastAPI Backend Requirements

Your FastAPI backend must provide these authentication endpoints:

- **POST /auth/signup** - Create new user account
- **POST /auth/signin** - Login user (sets HTTP-only cookies)
- **GET /auth/me** - Get current user data
- **POST /auth/refresh** - Refresh access token
- **POST /auth/signout** - Logout user (clears cookies)

### CORS Configuration
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Cookie Settings
```python
response.set_cookie(
    "access_token",
    token,
    httponly=True,
    secure=True,  # HTTPS only in production
    samesite="strict",
    max_age=900  # 15 minutes
)
```

## 📱 Responsive Design

The application is fully responsive with breakpoints for:
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: 1024px+

## 🎨 Design System

### Colors
- **Primary**: Blue gradient (#3B82F6 to #6366F1)
- **Secondary**: Gray scale (#F9FAFB to #111827)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Error**: Red (#EF4444)

### Typography
- **Font Family**: System fonts with fallbacks
- **Font Sizes**: 12px to 48px scale
- **Font Weights**: 400, 500, 600, 700

### Spacing
- **Base Unit**: 4px
- **Scale**: 4px, 8px, 12px, 16px, 20px, 24px, 32px, 48px, 64px

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Environment Variables
Create a `.env.local` file with your API configuration:
```env
NEXT_PUBLIC_API_URL=https://your-fastapi-backend.com
```

## 📚 Documentation

For detailed documentation, see:
- [FASTAPI_INTEGRATION.md](./FASTAPI_INTEGRATION.md) - FastAPI backend integration guide
- [SERVER_AUTHENTICATION.md](./SERVER_AUTHENTICATION.md) - Server-managed authentication system
- [AUTHENTICATION.md](./AUTHENTICATION.md) - General authentication documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the repository.
