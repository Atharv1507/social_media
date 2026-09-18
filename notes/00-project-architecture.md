# 00 — Project Architecture

## Project map

This repository is a React + Express + MongoDB social-media application.

```text
React
  ↓ Axios
Express
  ↓ Router
Middleware
  ↓ Controller
Mongoose
  ↓
MongoDB
```

The browser also stores the JWT in a cookie, allowing later requests to authenticate.

## Server entry point

The backend starts from `server/index.js`:

```js
const app = express()
const PORT = 8089

dotenv.config()

mongoose.connect(process.env.dbUrl)
```

Middleware order:

```js
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())
app.use('/users', userRoutes)
```

### Why order matters

Express is a pipeline. JSON parsing and cookie parsing must exist before controllers depend on `req.body` and `req.cookies`.

## Router composition

The app mounts:

```js
app.use('/users', userRoutes)
```

and the router declares:

```js
userRoutes.post('/register', resgiterUser)
userRoutes.post('/login', loginUser)
userRoutes.get('/me', isAuthenticated, getUser)
userRoutes.get('/profile/:username', isAuthenticated, getUserProfile)
```

So the public API becomes:

```text
POST /users/register
POST /users/login
GET  /users/me
GET  /users/profile/:username
```

## Layer responsibilities

### Route
Maps method + URL to an operation.

### Middleware
Handles reusable checks such as authentication.

### Controller
Contains validation, database operations, password verification, token creation and response creation.

### Model
Defines the MongoDB document structure and persistence interface.

## Frontend structure

```text
src/
 ├── pages/
 │    ├── Landing
 │    ├── Login
 │    ├── Signup
 │    ├── Home
 │    └── Profile
 ├── context/
 │    └── AuthContext
 ├── components/
 │    ├── ProtectedRoute
 │    └── PublicRoute
 ├── axiosCalls/
 │    └── axios.js
 └── App.jsx
```

## Shared Axios

```js
export const axiosInstance = axios.create({
    baseURL: 'http://localhost:8089/',
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
})
```

The shared client centralizes the API origin and cookie transport configuration.

## Login request trace

```text
Login.jsx
  ↓
axiosInstance.post('/users/login')
  ↓
Express
  ↓
users router
  ↓
loginUser
  ↓
User.findOne
  ↓
bcrypt.compare
  ↓
genToken
  ↓
res.cookie
  ↓
response.userData
  ↓
AuthContext.setUser
  ↓
/home
```

## Profile request trace

```text
/profile/mrinal
  ↓
useParams()
  ↓
GET /users/profile/mrinal
  ↓
isAuthenticated
  ↓
getUserProfile
  ↓
User.findOne({ username })
  ↓
profileData
  ↓
React state
```

## Debugging by layer

UI event does not run → React.

Wrong URL/body → Axios/form state.

404 → route or path parameter.

401 → cookie/JWT/auth middleware.

500 → controller/database/runtime.

Correct response but wrong UI → state/effect dependency.

## Viva

1. Why separate route and controller?
2. Why is authentication middleware reusable?
3. Why is AuthContext not backend security?
4. What files participate in login?
5. Why does `withCredentials` matter?
