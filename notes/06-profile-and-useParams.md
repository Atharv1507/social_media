# 06 — Profile, Dynamic Params and Current UI Boundaries

## Dynamic route

App declares:

```jsx
<Route path='/profile/:username' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
```

For `/profile/james123`:

```js
const { username } = useParams()
```

produces `james123`.

## Profile request

```js
axiosInstance.get(`users/profile/${username}`)
```

Backend:

```js
const { username } = req.params
const user = await User.findOne({ username })
```

End-to-end:

```text
URL
 ↓
useParams
 ↓
Axios
 ↓
req.params
 ↓
MongoDB
 ↓
profileData
 ↓
setUserData
```

## Own profile

```js
const isOwnProfile = user.username === username
```

This separates the authenticated actor from the profile being viewed.

Example:

```text
logged in = alex
URL = /profile/john
profile subject = john
actor = alex
```

## Profile response safety

The current controller sends the complete User document in `profileData`. That can expose the password hash. A production profile endpoint should explicitly exclude sensitive fields.

## Timestamps

The model uses timestamps, so Profile can render `createdAt` as the member-since date.

## Current UI/data bug

The page fetches the viewed profile into `userData`, but the content section reads from `user[activeTab]`, where `user` is the authenticated Context user.

That means `/profile/john` can display John's header while content may come from Alex.

The data source should be consistent with the profile being rendered.

## Current feature boundaries

The UI contains Edit Profile and Follow buttons, but the current router does not expose an edit-profile endpoint, and the Follow routes are commented out.

This is an important distinction:

```text
button exists
≠
backend feature is wired
```

## Effect dependency

The effect depends on `username` so navigating between profiles triggers a fresh request.

## Debugging useParams

```text
route path
 ↓
current URL
 ↓
useParams()
 ↓
Axios URL
 ↓
req.params.username
 ↓
MongoDB query
```

## Viva

1. What does useParams return?
2. Why distinguish actor from profile subject?
3. Why depend on username?
4. What does timestamps enable here?
5. Why can UI exist while backend feature is not implemented?

## Deep-Dive Teaching Layer

### Profile/useParams — route matching, actor-vs-profile subject, API lifecycle, current content-source bug, sensitive response issue, effect behavior, debugging and viva.

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
