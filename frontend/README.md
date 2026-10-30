# Frontend — React SPA (Vite)

This is the frontend for the E-Commerce **Registration & Login Service**.

Full setup instructions, API documentation and backend details are in the [root README](../README.md).

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
```

The API base URL defaults to `http://localhost:8081/api`. Override it with a `.env` file (see `.env.example`).

## GitHub Pages preview

The `main` branch deploys the screens to
https://laxmipatil2005.github.io/Registration-and-login-app/ using GitHub Actions.
The dashboard preview is available from the login page. GitHub Pages hosts only static files;
registration and login require the Spring backend to be deployed separately.

## Pages

| Route | Description |
| --- | --- |
| `/login` | Login with email or mobile + password |
| `/register` | Create an account |
| `/forgot-password` | Request an OTP |
| `/verify-otp` | Enter the 6-digit OTP |
| `/reset-password` | Set a new password |
| `/change-password` | Change password (authenticated) |
| `/` | Protected dashboard |

## Scripts

```bash
npm run dev      # dev server
npm run build    # production build
npm run preview  # preview the production build
npm run lint     # oxlint
```

# Frontend