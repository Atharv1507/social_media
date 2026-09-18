# Follow / Unfollow + API Hardening — Deep Dive

## Relevant commits
- ad727a4 — user data consistency
- 7733349 — different buttons
- 1c23a01 — follow/unfollow controllers

## Relationship model
For A following B:
```text
A.followings = [B]
B.followers  = [A]
```
This is a bidirectional representation of one logical relationship.

## Follow flow
```text
Follow button
 ↓
POST /users/:id/follow
 ↓
isAuthenticated
 ↓
req.user identifies actor
 ↓
controller validates target
 ↓
relationship update
 ↓
response
 ↓
refresh UI state
```

## Important validations
A hardened controller should consider:
- missing authentication;
- target user missing;
- self-follow;
- already-following;
- valid ObjectId;
- repeated requests.

## Why `$addToSet`?
It naturally avoids duplicate references.

## Why `$pull`?
It removes relationship references cleanly during unfollow.

## Critical bug class: continuing after sending an error
A controller that sends a 409/404 but continues executing can perform unintended database work or attempt a second response.

Correct pattern:
```js
if (invalid) {
  return res.status(409).json({ message: "..." });
}
```

## Critical bug class: query syntax
Mongoose methods such as `findById()` expect an ID value. A common mistake is passing an object that wraps the ID unexpectedly.

Teach students to distinguish:
```js
findById(id)
```
from:
```js
findOne({ _id: id })
```

They answer similar questions but have different APIs.

## Consistency problem
Follow/unfollow can require two user-document updates. Partial failure creates inconsistent graph state.

At scale, discuss:
- transactions;
- dedicated Follow collection;
- unique indexes;
- asynchronous reconciliation.

## Interview questions
1. How do you make follow idempotent?
2. Why is `$addToSet` useful?
3. Why must every error response usually return?
4. What is the difference between findById and findOne?
5. How can two writes become inconsistent?
6. When would you move to a Follow collection?
7. How would you rate-limit this endpoint?
8. How would you test self-follow and duplicate-follow?

## Best practices
Use explicit validation, return after errors, sanitize output, use consistent route naming, add integration tests, and define a clear consistency strategy.
