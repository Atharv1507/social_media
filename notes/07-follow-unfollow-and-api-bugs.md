# 07 — Follow/Unfollow: Data Flow, Bugs and Hardening

## Intended relationship model

For A follows B:

```text
A.followings contains B
B.followers contains A
```

The controller correctly identifies the actor with:

```js
const currentUserId = req.user._id
```

and the target from:

```js
const targetUserId = req.params.id
```

## Current route status

The router currently has the follow route commented out:

```js
// userRoutes.post('/follow/:id' , isAuthenticated , followUser)
```

So the controller functions exist but are not currently exposed through the active API.

## Current controller bugs

The controller uses:

```js
User.findById({ targetUserId })
```

The normal Mongoose `findById()` form is:

```js
User.findById(targetUserId)
```

Similarly, updates are written as:

```js
User.findByIdAndUpdate({ currentUserId }, update)
```

The normal form is:

```js
User.findByIdAndUpdate(currentUserId, update)
```

These argument-shape issues must be fixed before the controller can reliably perform the intended operation.

## Missing returns

Current code sends conflict responses but continues execution:

```js
if (alreadyFollowing) {
    res.status(409).json({ message: 'User Already Following' })
}
```

Preferred pattern:

```js
if (alreadyFollowing) {
    return res.status(409).json({
        message: 'User Already Following'
    })
}
```

The same principle applies to self-follow and unfollow validation.

## ObjectId comparison

The current comparison mixes a string and an ObjectId-derived value:

```js
id.toString() === currentUserId
```

A clearer comparison is:

```js
id.toString() === currentUserId.toString()
```

## Intended follow flow

After fixing the route and controller:

```text
button
 ↓
POST /users/follow/:id
 ↓
isAuthenticated
 ↓
actor = req.user._id
 ↓
target = req.params.id
 ↓
validate
 ↓
$addToSet actor.followings
 ↓
$addToSet target.followers
```

Unfollow replaces the mutation with `$pull`.

## Why `$addToSet`

A follow relationship is set-like. `$addToSet` prevents duplicate IDs. `$push` does not provide the same uniqueness behavior.

## Consistency problem

One follow action writes two user documents. If one operation succeeds while the other fails, the graph can become inconsistent. Production designs may use a transaction or a dedicated Follow collection.

## Debugging

```text
route enabled?
 ↓
correct URL?
 ↓
authentication passes?
 ↓
target ID valid?
 ↓
findById argument correct?
 ↓
validation returned?
 ↓
first update
 ↓
second update
```

## Viva

1. Why should actor ID come from req.user?
2. Where does target ID come from?
3. Why use `$addToSet`?
4. Why return after a 4xx response?
5. What is wrong with `findById({ targetUserId })`?
6. Why can two updates become inconsistent?