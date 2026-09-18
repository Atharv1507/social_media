# Social Media C-2029 — Project Implementation Handbook

> Foundation-stage implementation notes. Feature-wise and architecture-wise, based on the repository's actual implementation.

## 1. Project Mental Model

```text
React UI
  ↓ HTTP
Express Route
  ↓ Middleware
Controller
  ↓
Mongoose Model
  ↓
MongoDB
  ↓ JSON response
React state
  ↓
UI
```

Think of the system as a restaurant: React is the customer, routes are the waiter, middleware is the security/check-in desk, controllers are the kitchen, Mongoose is the translator, and MongoDB is storage.

## 2. Backend Architecture

### Routes
Routes map HTTP method + URL to a controller. Business logic should not live here.

### Controllers
Controllers implement registration, login, profile lookup and relationship operations.

### Models
The User model defines fields and relationships.

### Middleware
Authentication middleware verifies the cookie JWT and attaches `req.user`.

### Utils
JWT creation is isolated in `generateToken.js`.

## 3. Server Bootstrap
The repository configures CORS, JSON parsing, cookie parsing, the `/users` router and the MongoDB connection.

Request order:

```text
Request
 ↓
CORS
 ↓
express.json()
 ↓
cookieParser()
 ↓
/users router
 ↓
controller
```

Middleware order matters because each layer prepares information for the next one.

## 4. User Schema
The User document contains identity fields plus the social graph:

```js
followers: [ObjectId]
followings: [ObjectId]
posts: []
stories: []
reels: []
```

`followers` means people following me. `followings` means people I follow.

Storing ObjectIds instead of full user documents avoids duplicating large user objects.

Analogy: store a contact ID rather than photocopying someone's entire profile into every contact list.

## 5. Registration
Flow:

```text
req.body
 ↓ validate
 ↓ username/email checks
 ↓ bcrypt salt + hash
 ↓ User.create()
 ↓ JWT creation
 ↓ cookie
 ↓ response
```

Passwords are hashed, never stored as plaintext.

## 6. Password Hashing
The project uses bcrypt salt + hash.

Hashing is one-way for authentication purposes:

```text
password → hash
```

Login later uses `bcrypt.compare(password, storedHash)` rather than trying to recover the password.

## 7. Login
Login finds the user by email, compares the submitted password with the stored hash, generates a JWT, and places that token in a cookie.

## 8. JWT + Cookies
`generateToken.js` signs a payload containing `userId` using `JWT_SECRET` with an expiry.

Conceptually:

```text
Cookie
 ↓
JWT
 ↓ verify
userId
 ↓
User.findById()
```

The cookie is HttpOnly in the current implementation, so browser JavaScript cannot directly read the token.

## 9. Authentication Middleware
The middleware:

```js
const token = req.cookies?.token
const decoded = jwt.verify(token, process.env.JWT_SECRET)
const user = await User.findById(decoded.userId)
req.user = user
next()
```

`req.user` is the key hand-off between authentication and business logic.

Analogy: once the security desk checks your badge, the rest of the building receives your identity without checking the badge again.

## 10. `/users/me`
This protected endpoint exposes the authenticated user to the client. It is the source used when React restores the session after reload.

## 11. AuthContext
AuthContext stores `user` and `loading`.

The `loading` state is critical because:

```text
user === null
```

does not necessarily mean logged out. It may mean the `/users/me` request is still running.

Correct state machine:

```text
UNKNOWN
 ├─ valid cookie → AUTHENTICATED
 └─ invalid/missing → GUEST
```

## 12. ProtectedRoute and PublicRoute
ProtectedRoute allows children only after auth restoration finishes and a user exists. PublicRoute does the inverse.

These are navigation guards, not the real security boundary. The backend middleware remains the security layer.

## 13. Dynamic Profile Route
The app defines `/profile/:username` and Profile reads the parameter using `useParams()`.

End-to-end chain:

```text
URL
 ↓
React Router
 ↓
useParams()
 ↓
Axios
 ↓
Express req.params.username
 ↓
MongoDB findOne({ username })
```

When debugging profile routing, inspect the whole chain instead of blaming `useParams()` immediately.

## 14. Follow / Unfollow
For A following B:

```text
A.followings = [B]
B.followers  = [A]
```

This is a directed graph. Users are nodes and follows are edges.

MongoDB uses `$addToSet` for follow and `$pull` for unfollow.

`$addToSet` behaves like set insertion: repeating the same logical follow does not create duplicate references.

## 15. Important Production Gaps to Discuss
- Sanitize every returned user object; never expose password hashes.
- Return immediately after sending error responses.
- Validate target users before using them.
- Standardize response shapes.
- Add logout.
- Use consistent production cookie settings.
- Add integration tests.
- Consider a transaction/consistency strategy for the two follow writes.

## 16. Debugging Playbook
Trace data across boundaries:

```text
URL
 → router
 → middleware
 → controller
 → database
 → response
 → React state
```

## 17. Interview Questions
1. Why hash passwords instead of encrypting them?
2. What is the difference between authentication and authorization?
3. Why use HttpOnly cookies?
4. Why is `loading` separate from `user === null`?
5. Why use ObjectIds in followers/followings?
6. `$push` vs `$addToSet`?
7. Why do we need `req.user`?
8. Why can frontend route guards not replace backend authorization?
9. What happens when JWT verification fails?
10. How would you make follow/unfollow consistent?

## 18. Practice
- Implement logout.
- Sanitize auth responses.
- Add profile search.
- Add duplicate/self-follow protection.
- Write integration tests for register/login/me/profile/follow/unfollow.

## Final Mental Model
```text
React → Router → Axios → Express → Middleware → Controller → MongoDB → Response → React
```