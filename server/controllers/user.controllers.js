import User from "../models/user.model.js"
import bcrypt from 'bcrypt'
import { genToken } from "../utils/generateToken.js"

// Register Controller

const cookiesOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 10 * 24 * 60 * 60 * 1000
}

export const resgiterUser = async (req, res) => {
    try {
        const { name, email, password, username } = req.body

        if (!username || !email || !password || !name) {
            return res.status(400).json({ message: "All fields Required" })
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password Length should be greater than 6" })
        }

        const userNameExists = await User.findOne({ username })

        if (userNameExists) {
            return res.status(409).json({ message: "User Already Exists" })
        }

        const emailExists = await User.findOne({ email })

        if (emailExists) {
            return res.status(409).json({ message: "User Already Exists" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = await User.create({
            name,
            username,
            email,
            password: hashedPassword
        })

        const token = genToken(newUser._id)

        res.cookie("token", token, cookiesOptions)

        return res.status(201).json({ message: "User Resgitered", user: newUser })
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Errorr', error })
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(404).json({ message: "User Not Found Please Register" })
        }

        const passwordCheck = await bcrypt.compare(password, user.password)

        if (!passwordCheck) {
            return res.status(400).json({ message: "Wrong Password" })
        }

        const token = genToken(user._id)

        res.cookie("token", token, cookiesOptions)

        return res.status(200).json({ message: "User Logged IN", userData: user })
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Errorr', error })
    }
}

export const getUser = async (req, res) => {
    return res.status(200).json({ message: "User Authenticated", userData: req.user })
}

export const getUserProfile = async (req, res) => {
    try {
        const { username } = req.params

        const user = await User.findOne({ username })

        if (!user) {
            return res.status(404).json({ message: "User Not Found" })
        }

        return res.status(200).json({ message: "User Found", profileData: user })
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Errorr', error })
    }
}

// Follow / unfollow controllers

export const followUser = async (req, res) => {
    try {
        const currentUserId = req.user._id
        const targetUserId = req.params.id

        if (currentUserId.toString() === targetUserId.toString()) {
            return res.status(409).json({ message: 'You cannot follow Yourself' })
        }

        const targetUser = await User.findById(targetUserId)

        if (!targetUser) {
            return res.status(404).json({ message: 'User Not Found' })
        }

        const alreadyFollowing = targetUser.followers.some(
            (id) => id.toString() === currentUserId.toString()
        )

        if (alreadyFollowing) {
            return res.status(409).json({ message: 'User Already Following' })
        }

        await User.findByIdAndUpdate(currentUserId, {
            $addToSet: { followings: targetUserId }
        })

        await User.findByIdAndUpdate(targetUserId, {
            $addToSet: { followers: currentUserId }
        })

        return res.status(201).json({ message: 'User Followed' })
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Errorr', error })
    }
}

export const unFollowUser = async (req, res) => {
    try {
        const currentUserId = req.user._id
        const targetUserId = req.params.id

        if (currentUserId.toString() === targetUserId.toString()) {
            return res.status(409).json({ message: 'You cannot unfollow Yourself' })
        }

        const targetUser = await User.findById(targetUserId)

        if (!targetUser) {
            return res.status(404).json({ message: 'User Not Found' })
        }

        const alreadyFollowing = targetUser.followers.some(
            (id) => id.toString() === currentUserId.toString()
        )

        if (!alreadyFollowing) {
            return res.status(409).json({ message: 'User already is Unfollowed' })
        }

        await User.findByIdAndUpdate(currentUserId, {
            $pull: { followings: targetUserId }
        })

        await User.findByIdAndUpdate(targetUserId, {
            $pull: { followers: currentUserId }
        })

        return res.status(200).json({ message: 'User unFollowed' })
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Errorr', error })
    }
}
