# Dynamic Profile Params + Auth Loading — Deep Dive

## Relevant commits
- 71871cd — push link
- 51bc270 — changes leading into the profile stage
- fb9ae1e — preserve profile route param with ProtectedRoute
- 44596a5 / e9a4c1d / cb35590 — deterministic auth loading

## The route contract
The application defines:
```text
/profile/:username
```
A browser URL such as:
```text
/profile/james123
```
produces:
```js
useParams() // { username: "james123" }
```

## Why the parameter can “disappear”
`useParams()` only runs meaningfully after the Profile route has mounted. If an auth wrapper redirects before Profile mounts, there is no Profile component available to read the route parameter.

```text
URL
 ↓
Router match
 ↓
ProtectedRoute decision
 ↓
Profile mount
 ↓
useParams()
```

The bug is therefore often lifecycle-related rather than an API problem with useParams.

## Deterministic auth loading
C's 18 Sep fixes make the state explicit:
```text
loading=true  → render loading state
loading=false + user → authenticated
loading=false + no user → guest
```

### Analogy
A traffic light has three states in the logic: red, green, and “the signal is still starting”. Treating startup as red can cause an unnecessary stop.

## Debugging recipe
1. Open browser URL.
2. Confirm App.jsx route pattern.
3. Add a log immediately inside Profile.
4. Add a log in ProtectedRoute.
5. Inspect `/users/me` Network response.
6. Inspect Axios profile request URL.
7. Inspect Express `req.params`.

## Interview questions
1. Why can useParams be correct in isolation but still never execute?
2. What does a wrapper component change about mounting?
3. Why is UNKNOWN different from GUEST?
4. Where should loading state be resolved?
5. How would you prevent a stale auth request from changing state after navigation?
