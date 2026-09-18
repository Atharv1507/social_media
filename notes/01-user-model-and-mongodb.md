# 01 — User Model and MongoDB Data Design

## User schema

The core model is:

```js
const userSchema = new mongoose.Schema({
   name: { type: String, required: true },
   username: { type: String, required: true, unique: true },
   email: { type: String, required: true, unique: true },
   password: { type: String, required: true },
   profileImage: { type: String },
   followers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
   }],
   followings: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
   }],
   posts: [],
   stories: [],
   reels: []
}, { timestamps: true })
```

## Field groups

### Identity

```text
name
username
email
```

Username and email are unique.

### Authentication

```text
password
```

The intended value after registration is a bcrypt hash.

### Social graph

```text
followers
followings
```

For:

```text
A follows B
```

the desired representation is:

```text
A.followings contains B
B.followers contains A
```

### Content placeholders

Posts, stories and reels are currently plain arrays. They are extension points rather than complete media schemas.

### Timestamps

```js
{ timestamps: true }
```

adds `createdAt` and `updatedAt`. Profile uses `createdAt` for the member-since display.

## Why ObjectId references

Relationships are stored as MongoDB ObjectIds:

```js
mongoose.Schema.Types.ObjectId
```

with:

```js
ref: "User"
```

This allows Mongoose to populate related User documents.

## Query patterns in C

Registration:

```js
User.findOne({ username })
User.findOne({ email })
User.create(...)
```

Login:

```js
User.findOne({ email })
```

Authentication:

```js
User.findById(decoded.userId)
```

Profile:

```js
User.findOne({ username })
```

## Uniqueness vs validation

The controller performs duplicate checks, while the schema declares unique constraints. Application checks give friendly responses; database constraints protect integrity.

## Teaching mental model

Think of User as the central aggregate:

```text
User
 ├── identity
 ├── password hash
 ├── profile metadata
 ├── relationship graph
 └── content placeholders
```

## Viva

1. What does `ref: 'User'` mean?
2. Why store ObjectIds instead of complete users?
3. What does `timestamps: true` add?
4. Why are duplicate checks useful even with `unique: true`?


## Deep-Dive Teaching Layer

### User Model — deeper explanation of identity fields, ObjectId references, relationship consistency, query patterns, schema-vs-controller validation, production evolution and viva.

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
