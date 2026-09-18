# 05 — AuthContext, ProtectedRoute and PublicRoute

## Auth state

C stores:

```js
const [user, setUser] = useState(null)
const [loading, setLoading] = useState(true)
```

This creates three conceptual states:

```text
UNKNOWN
AUTHENTICATED
GUEST
```

Initially `user` is null but `loading` is true, so the application has not yet decided whether the user is a guest.

## Session restoration

The provider calls:

```js
axiosInstance
  .get('users/me')
  .then((response) => {
      setUser(response.data.userData)
  })
  .catch(() => {
      setUser(null)
  })
  .finally(() => {
      setLoading(false)
  })
```

The sequence is:

```text
check session
 ↓
set user or guest
 ↓
loading false
```

## Why loading matters

Without loading, a valid user can be redirected to `/login` before `/users/me` finishes. Loading prevents treating UNKNOWN as GUEST.

## ProtectedRoute

```js
if (loading) return <h1>Loading...</h1>

if (!user) {
    return <Navigate to='/login' replace />
}

return children
```

So:

```text
checking → wait
finished + guest → login
finished + user → render
```

## PublicRoute

PublicRoute performs the inverse UX rule. An authenticated user visiting `/login` or `/signup` is redirected to `/home`.

## Frontend vs backend security

```text
ProtectedRoute → UI/navigation guard
isAuthenticated → backend security boundary
```

A user can call APIs without using the React UI, so backend authentication remains mandatory.

## Login integration

Login updates shared state directly:

```js
setUser(user.data.userData)
navigate('/home')
```

This lets Home/Profile use the user immediately.

## Why Context

Authentication state is needed by Login, Home, Profile and both route guards. Context avoids passing the same values through unrelated component layers.

## Debugging

For a redirect or loading bug, trace:

```text
initial user
 ↓
loading
 ↓
/users/me request
 ↓
response
 ↓
setUser
 ↓
setLoading(false)
 ↓
route decision
```

## Viva

1. Why is `loading` a third auth state?
2. What causes premature redirects?
3. Why is ProtectedRoute not backend security?
4. Why use `replace`?
5. What happens after refresh?