# 08 — Production Hardening, Debugging and Viva

## Secret management

C commits `server/.env.example`, which is the safer repository pattern for documenting required environment variables without committing real secrets.

## Cookie hardening

C already uses environment-aware settings:

```js
secure: process.env.NODE_ENV === 'production',
sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
maxAge: 10 * 24 * 60 * 60 * 1000
```

Review these against the real HTTPS/domain topology before deployment.

## Response hardening

Register, login and profile currently return full User documents. That can expose the password hash. A production API should sanitize the database object before returning it.

```text
database object -> safe response -> browser
```

## Validation and rate limits

Larger systems should centralize validation for body, params and query. Login, registration and password-reset flows are strong candidates for rate limiting.

## Error handling

Controllers currently repeat try/catch and sometimes expose raw error information. A centralized Express error handler can separate detailed server logs from safe public API messages.

## CORS

Development allows:

```js
origin: 'http://localhost:5173',
credentials: true
```

Production should allow only the intended frontend origin.

## C-specific feature reality

Some UI/controller work is not fully wired:

```text
Follow route -> commented out
Edit Profile API -> not present
Logout route -> not present
```

The important distinction is:

```text
UI exists != feature is complete
```

## Current bugs worth knowing

### Password exposure
Full User documents are returned.

### Password rule mismatch
The code checks `password.length < 6`, while the message says the password should be greater than 6.

### Profile content source
Profile fetches the viewed user into `userData`, but the content section reads `user[activeTab]` from AuthContext, which can show the authenticated user's content instead of the viewed profile's content.

### Follow route disabled
The follow route is commented out.

### Follow controller argument shape
The controller uses `findById({ targetUserId })` and similar object-shaped calls where direct IDs are expected.

### Missing returns
Several 4xx responses are sent without `return`, so execution can continue.

### ObjectId comparison
The follow logic should normalize both IDs before comparing them.

## Full-stack debugging method

Trace every issue as:

```text
UI event
 -> React state
 -> Axios request
 -> HTTP method + URL
 -> Express route
 -> middleware
 -> controller
 -> MongoDB
 -> response
 -> React state
```

## Viva questions

1. Explain registration end to end.
2. Why bcrypt?
3. Hashing vs encryption?
4. Why HttpOnly cookies?
5. What does JWT verification prove?
6. Why query MongoDB after verification?
7. Why does AuthContext need loading?
8. Why is ProtectedRoute not backend security?
9. What does useParams return?
10. Why use ObjectId references?
11. Why should actor ID come from req.user?
12. `$addToSet` vs `$push`?
13. Why `$pull`?
14. Why are follow routes currently unavailable?
15. Why return after a 4xx response?
16. Why sanitize User responses?
17. Why does withCredentials matter?
18. What happens after refresh?
19. How would you implement logout?
20. How would you make follow updates atomic?

## Practical capstone

Complete one unfinished feature while preserving the same architecture:

```text
React UI
 -> Axios
 -> route
 -> authentication/authorization
 -> controller
 -> model/database
 -> response
 -> React state
```

Good choices are Follow/Unfollow, Edit Profile or Logout. Document both the happy path and failure cases.

## Final mental model

```text
React
 -> HTTP
 -> Express
 -> Route
 -> Middleware
 -> Controller
 -> MongoDB
 -> Response
 -> React state
```

Authentication adds:

```text
JWT
 -> HttpOnly cookie
 -> verification
 -> req.user
```

Social relationships add:

```text
actor + target
 -> relationship mutation
 -> database consistency
```
