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

## Deep-Dive Teaching Layer

### JWT/Cookies/Middleware — full token lifecycle, cookie attributes, CORS/credentials, verification, current-user lookup, failure paths, debugging and security notes.

This chapter should be read together with the actual source files in the repository. The goal is not to memorize definitions; trace the real request from browser to controller to database and back.

### Implementation-first rule

For every concept, identify four things:

```text
1. Which file implements it?
2. Which function executes?
3. What data enters the function?
4. What response/state comes out?
```

### Debugging method

Use the request lifecycle:

```text
React event
↓
Axios method + URL + payload
↓
Express route
↓
Middleware
↓
Controller
↓
Mongoose query/update
↓
Response status/body
↓
React state
↓
UI
```

Do not jump directly to the database or change random code. Find the first boundary where the observed behavior differs from the expected behavior.

### Interview habit

When explaining this feature in a viva, start with the user action, then describe the HTTP request, then the backend execution, then the database operation, and finally how the response changes frontend state. This demonstrates system understanding rather than isolated syntax knowledge.
