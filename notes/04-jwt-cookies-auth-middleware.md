# 04 — JWT, Cookies and Authentication Middleware

## Token generation

C generates the token in `server/utils/generateToken.js`:

```js
export const genToken = (userId) => {
    const token = jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: "10d" }
    )
    return token
}
```

The payload carries the user ID, the secret signs the token and the expiry is ten days.

## Cookie configuration

C uses environment-aware options:

```js
const cookiesOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 10 * 24 * 60 * 60 * 1000
}
```

`httpOnly` prevents normal frontend JavaScript from reading the token directly. `secure` is enabled in production. `sameSite` differs between development and production. `maxAge` is ten days.

Review these settings against the actual deployment topology before production.

## Authentication middleware

```js
const token = req.cookies?.token
const decoded = jwt.verify(token, process.env.JWT_SECRET)
const user = await User.findById(decoded.userId)
req.user = user
next()
```

The actual order is:

```text
cookie
 ↓
verify token
 ↓
read userId
 ↓
load current user
 ↓
req.user
 ↓
controller
```

## Protected routes

Current active routes include:

```js
userRoutes.get('/me', isAuthenticated, getUser)
userRoutes.get('/profile/:username', isAuthenticated, getUserProfile)
```

The follow route is currently commented out in the router.

## Failure states

Missing token → 401.

Invalid/expired token → 401.

Valid token but no matching user → 404.

## Why query MongoDB after verifying JWT?

JWT verifies identity information, while MongoDB provides current account state. The user may have been deleted or changed since the token was issued.

## C-specific configuration

C consistently uses `JWT_SECRET` for both signing and verification. A configuration mismatch causes valid-looking cookies to fail authentication.

## Debugging a 401

```text
cookie exists?
 ↓
Axios withCredentials?
 ↓
CORS credentials?
 ↓
req.cookies.token?
 ↓
JWT_SECRET?
 ↓
jwt.verify?
 ↓
decoded.userId?
 ↓
User.findById?
```

## Viva

1. Is JWT encrypted?
2. What does verification establish?
3. Why query MongoDB after verification?
4. Why attach req.user?
5. Why is ProtectedRoute not enough?