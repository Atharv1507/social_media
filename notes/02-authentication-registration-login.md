# 02 — Authentication: Registration and Login

## Registration frontend

Signup uses controlled state:

```js
const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    password: ''
})
```

The generic change handler uses the input name:

```js
const handleChange = (e) => {
    setForm((prev) => ({
        ...prev,
        [e.target.name]: e.target.value
    }))
}
```

One handler can therefore update every field.

## Registration request

```js
await axiosInstance.post('/users/register', form)
```

The router maps it to:

```js
userRoutes.post('/register', resgiterUser)
```

The controller reads:

```js
const { name, email, password, username } = req.body
```

## Backend validation

Required fields:

```js
if (!username || !email || !password || !name) {
    return res.status(400).json({
        message: "All fields Required"
    })
}
```

Duplicate checks:

```js
const userNameExists = await User.findOne({ username })
const emailExists = await User.findOne({ email })
```

Conflicts return 409.

### Password rule

Current code checks:

```js
if (password.length < 6)
```

The message says the password should be greater than 6, so there is an implementation/message mismatch worth documenting.

## Registration sequence

```text
form
 ↓
POST /users/register
 ↓
validation
 ↓
duplicate lookup
 ↓
bcrypt hash
 ↓
User.create
 ↓
JWT
 ↓
cookie
 ↓
201
```

## Login frontend

Login stores:

```js
const [form, setForm] = useState({
    email: '',
    password: ''
})
```

Submit:

```js
const user = await axiosInstance.post('/users/login', form)
setUser(user.data.userData)
navigate('/home')
```

## Login backend

The controller finds the account:

```js
const user = await User.findOne({ email })
```

Then compares:

```js
const passwordCheck =
    await bcrypt.compare(password, user.password)
```

Success generates JWT and writes the cookie.

## Current response contracts

Registration:

```js
{ message: "User Resgitered", user: newUser }
```

Login:

```js
{ message: "User Logged IN", userData: user }
```

The frontend knows the difference, but a cleaner API contract would standardize the response key.

## Security boundary

The current controllers return full User documents. That includes the password hash. Even though it is hashed, the client does not need it.

A production implementation should sanitize the response object before sending it.

## Debugging

Registration:

```text
form
 ↓
request payload
 ↓
req.body
 ↓
validation
 ↓
duplicate lookup
 ↓
bcrypt
 ↓
MongoDB
```

Login:

```text
email lookup
 ↓
bcrypt.compare
 ↓
genToken
 ↓
cookie
 ↓
userData
 ↓
setUser
```

## Viva

1. Why validate on both frontend and backend?
2. Why use 409 for duplicate username/email?
3. Why use bcrypt.compare?
4. Why should password hashes not be returned?
5. Why should register/login response shapes be consistent?


## Deep-Dive Teaching Layer

### Authentication — detailed request/response contracts, validation, duplicate checks, password flow, JWT/cookie lifecycle, current implementation mismatches, debugging and viva.

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
