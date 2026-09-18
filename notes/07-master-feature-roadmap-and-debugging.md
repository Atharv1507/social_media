# Social Media C-2029 — Master Feature Roadmap & Debugging Notes

## What stage is this repo?
C is the earlier/foundation stage evolving into the first social-graph implementation. It already has detailed authentication notes; this document captures the later frontend and follow/unfollow work and, importantly, the bugs that occurred while moving from auth to dynamic profiles.

## Commit progression after authentication notes
| Date | Commits | Feature |
|---|---|---|
| 9 Sep | 6cd65fb, 54ff1d7, b8f321d | signup/auth client integration |
| 16 Sep | 8d17e97, 0124aee | redirect bug investigation/fix |
| 16 Sep | 9c85682, 71871cd | UI cleanup + link/navigation |
| 18 Sep | fb9ae1e | preserve profile route parameter through ProtectedRoute |
| 18 Sep | 7b160ca, 781c6e5 | invalid/missing JWT handling + localhost cookie settings |
| 18 Sep | 44596a5, e9a4c1d, cb35590 | deterministic auth loading state |
| 18 Sep | ad727a4, 7733349 | user-response consistency + different buttons |
| 18 Sep | 1c23a01 | follow/unfollow controllers |

## Why `useParams()` seemed broken
The important concept is route ownership. A nested wrapper or redirect can accidentally replace the route before the profile component reads the parameter. The fix in this history explicitly preserves `/profile/:username` through the protected-route flow.

Debugging chain:
```text
Browser URL
 ↓
App route definition
 ↓
ProtectedRoute / redirect decision
 ↓
Profile component
 ↓
useParams()
```
If a redirect occurs before Profile mounts, `useParams()` cannot magically recover the missing parameter.

## Auth loading is a state machine
Treat auth restoration as:
```text
UNKNOWN (loading)
   ├─ valid cookie → AUTHENTICATED
   └─ invalid/missing cookie → GUEST
```
Do not model “not loaded yet” as the same thing as “logged out”. That distinction explains the loading-state commits on 18 Sep.

## JWT failure handling
The middleware now explicitly handles missing/invalid tokens and returns 401. This matters because clients should distinguish “not authenticated” from “server crashed”.

Analogy: a building security guard should say “badge missing/invalid”, not “building exploded”.

## Cookie environment behaviour
Localhost and production do not have identical cookie constraints. The repo history explicitly adjusts cookie auth for localhost while retaining production-aware options.

Teaching rule: never copy `secure`, `sameSite`, or credential settings without understanding the browser/security model around them.

## Follow/unfollow stage
The current controller direction mirrors the social graph used by the other stages:
```text
currentUser.followings += targetUser
 targetUser.followers += currentUser
```
for follow, and the inverse removal for unfollow.

Before production-hardening, review the query syntax, early returns after error responses, duplicate protection, and consistency of both writes.

## What is different from A?
C is not the mature/reference endpoint. It is useful as a debugging classroom because you can watch authentication, route lifecycle, profile params, cookie configuration, and follow logic become stable through successive small fixes.

## Best practices to add next
- Use a consistent controller naming convention (`registerUser`, not `resgiterUser`).
- Sanitize user payloads before returning them.
- Populate only required fields.
- Return after sending 4xx responses.
- Prefer `$addToSet` for follow insertion.
- Add explicit duplicate/self-follow validation.
- Add logout.
- Add integration tests.
- Separate controller/service responsibilities as the project grows.

## Interview questions
1. Why can `useParams()` be correct while the profile still receives no username?
2. Why do protected routes need an `UNKNOWN` auth state?
3. What should an API return for a missing JWT?
4. How do HttpOnly cookies interact with Axios `withCredentials`?
5. Why are development and production cookie flags different?
6. `$addToSet` vs `$push`?
7. How do you guarantee follower/following consistency?
8. Why should every `res.status(...).json(...)` error path usually `return`?
9. How would you reproduce a redirect race condition in a test?
10. How would you verify a follow API without relying on the browser UI?

## Resources
Recommended next study areas: React Router dynamic segments, Express middleware, JWT verification, browser cookie attributes, MongoDB update operators, Mongoose populate, multipart uploads, and MongoDB transactions.

## Final mental model
```text
C teaches you to debug the chain:
URL → Router → Auth state → Params → API → Middleware → Controller → MongoDB → UI state
```
The most important skill here is not memorising a fix. It is locating which contract in the chain became inconsistent.
