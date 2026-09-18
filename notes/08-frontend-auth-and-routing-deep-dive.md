# Frontend Authentication + Routing — Deep Dive

## Relevant commits
- 6cd65fb — signup page client
- 54ff1d7 — signup auth setup
- b8f321d — auth client
- 8d17e97 / 0124aee — redirection bug investigation/fix
- 9c85682 — login/signup cleanup
- 71871cd — link/navigation

## AuthContext as the client-side session model
The backend owns the actual session. AuthContext creates a convenient React representation of that session.

```text
Browser cookie
   ↓
GET /users/me
   ↓
Express auth middleware
   ↓
req.user
   ↓
response
   ↓
AuthContext.user
```

## Why not read the cookie directly?
HttpOnly cookies are intentionally inaccessible to JavaScript. That is a security property. React therefore asks the server who the current user is.

### Analogy
The browser holds a sealed identity card. The React application cannot open the envelope; it asks the building reception to confirm the identity.

## PublicRoute and ProtectedRoute
ProtectedRoute is a rendering/navigation decision:
```text
loading → wait
no user → login
user → protected page
```

PublicRoute is the inverse:
```text
loading → wait
user → home
no user → public page
```

## Why redirects became a bug
During startup, `user` can be null before the asynchronous `/users/me` request completes. If the route guard treats that temporary state as logged out, it redirects too early.

## Correct state machine
```text
UNKNOWN
 ├── valid session → AUTHENTICATED
 └── invalid/missing session → GUEST
```

Never collapse UNKNOWN and GUEST.

## Interview questions
1. Why cannot React read an HttpOnly cookie?
2. Why is AuthContext useful if the cookie already exists?
3. Why do route guards need loading?
4. Can ProtectedRoute stop API access from Postman?
5. Where should authorization happen?
6. How would you test the loading race?
