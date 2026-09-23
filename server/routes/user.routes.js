import express from 'express'
import {
    followUser,
    getUser,
    getUserProfile,
    loginUser,
    resgiterUser,
    unFollowUser
} from '../controllers/user.controllers.js'
import { isAuthenticated } from '../middlewares/authMiddleware.js'

const userRoutes = express.Router()

userRoutes.post('/register', resgiterUser)
userRoutes.post('/login', loginUser)
userRoutes.get('/me', isAuthenticated, getUser)
userRoutes.get('/profile/:username', isAuthenticated, getUserProfile)

userRoutes.post('/follow/:id', isAuthenticated, followUser)
userRoutes.post('/unfollow/:id', isAuthenticated, unFollowUser)

export default userRoutes
