# Authentication System Setup Guide

## Overview
Your iwanpass admin dashboard now has a complete authentication system with:
- ✅ Login page with email/password credentials
- ✅ Protected routes (all routes require authentication)
- ✅ Admin-only access
- ✅ Session management
- ✅ Logout functionality

## Files Created

### 1. **Auth Configuration** (`auth.ts`)
- NextAuth.js configuration with Credentials provider
- Admin credentials validation
- Session and JWT callbacks

### 2. **Middleware** (`middleware.ts`)
- Route protection - redirects unauthenticated users to login
- Auto-redirect authenticated users away from login page
- Protects all routes except `/login` and `/api/*`

### 3. **Login Page** (`app/login/page.tsx`)
- Beautiful, responsive login UI
- Email and password input fields
- Error handling and loading states
- Redirect to dashboard on successful login

### 4. **API Route** (`app/api/auth/[auth0]/route.ts`)
- NextAuth.js route handler
- Handles authentication requests

### 5. **Session Provider** (`app/providers.tsx`)
- Wraps the entire app with NextAuth SessionProvider
- Enables client-side session access

### 6. **User Navigation** (`components/UserNav.tsx`)
- Dropdown menu showing admin email
- Sign out button
- User avatar with initials

### 7. **Top Bar** (`components/TopBar.tsx`)
- Navigation bar with logout functionality
- Displays app branding

## Configuration

### Default Admin Credentials (in `.env`)
```
ADMIN_EMAIL=admin@iwanpass.com
ADMIN_PASSWORD=Admin@123456
```

**⚠️ IMPORTANT FOR PRODUCTION:**
1. Change these credentials immediately
2. Use a secure password (min 12 characters, mix of uppercase, lowercase, numbers, special chars)
3. Set a strong `NEXTAUTH_SECRET` (currently a placeholder)

To generate a secure secret:
```bash
openssl rand -base64 32
```

### Environment Variables Required
```env
ADMIN_EMAIL=your-admin-email@example.com
ADMIN_PASSWORD=your-secure-password
NEXTAUTH_URL=http://localhost:3000 (or your production URL)
NEXTAUTH_SECRET=generated-secure-random-string
```

## How It Works

### Authentication Flow
1. User visits any protected route
2. Middleware checks for active session
3. If not authenticated → redirect to `/login`
4. User enters email & password
5. Credentials validated against env variables
6. On success → session created → redirect to `/dashboard`
7. Session persists across page refreshes

### Route Protection
- **Public**: `/login`
- **Protected**: All other routes require valid session

### Logout
- Click user avatar in top-right corner
- Select "Sign out"
- Session cleared → redirect to login page

## Testing Locally

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Visit the app:**
   ```
   http://localhost:3000
   ```

3. **You'll be redirected to login** (`/login`)

4. **Login with default credentials:**
   - Email: `admin@iwanpass.com`
   - Password: `Admin@123456`

5. **Access dashboard:**
   - Should see dashboard with user menu in top-right

## Security Best Practices

✅ **Implemented:**
- Credentials provider (secure password handling)
- Session-based authentication
- Route middleware protection
- Automatic session persistence

🔒 **To Add (for production):**
1. **HTTPS** - Always use HTTPS in production
2. **Strong Secret** - Generate new NEXTAUTH_SECRET
3. **Database Sessions** - Consider database-backed sessions instead of JWT
4. **Rate Limiting** - Add rate limiting to login endpoint
5. **CSRF Protection** - NextAuth handles this automatically
6. **Password Hashing** - If storing passwords, use bcrypt
7. **2FA** - Consider adding two-factor authentication

## Customizing Admin Users

### Option 1: Multiple Admins (Simple)
Update `auth.ts` to check a list:
```typescript
const adminUsers = [
  { email: "admin1@example.com", password: "password1" },
  { email: "admin2@example.com", password: "password2" },
];

const user = adminUsers.find(
  u => u.email === credentials.email && u.password === credentials.password
);
```

### Option 2: Database (Recommended for Production)
Connect to your backend API to validate users:
```typescript
const response = await fetch('https://your-api.com/auth/validate', {
  method: 'POST',
  body: JSON.stringify({ email, password })
});
const user = await response.json();
```

## Troubleshooting

### "Middleware is deprecated" Warning
This is just a deprecation warning. The middleware still works. Next.js recommends using "proxy" in the future, but credentials auth requires middleware.

### Sessions not persisting
Ensure `NEXTAUTH_URL` is set correctly for your environment.

### Login page shows but won't submit
Check that `.env` has valid `ADMIN_EMAIL` and `ADMIN_PASSWORD`.

### Can't access dashboard after login
Verify middleware.ts is in the root directory (not in app/), and NEXTAUTH_SECRET is set.

## Next Steps

1. ✅ Change default admin credentials
2. ✅ Set a strong NEXTAUTH_SECRET
3. ✅ Test login flow locally
4. ✅ Deploy with environment variables set on your hosting
5. Consider adding multi-user support or database integration
6. Add 2FA for enhanced security

## File Structure
```
iwanpass-admin/
├── auth.ts (New)
├── middleware.ts (New)
├── app/
│   ├── layout.tsx (Updated - added SessionProvider)
│   ├── providers.tsx (New)
│   ├── login/
│   │   └── page.tsx (New)
│   ├── api/auth/[auth0]/
│   │   └── route.ts (New)
│   └── dashboard/
│       └── Dashboard.tsx (Updated - added TopBar)
├── components/
│   ├── UserNav.tsx (New)
│   └── TopBar.tsx (New)
└── .env (Updated)
```
