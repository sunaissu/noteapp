import { ClientSession } from 'mongoose'
import User from '../models/user.model'

export const findUserById = async (userId: string) => {
    return User.findById(userId)
}

export const findUserByUsername = async (username: string) => {
    return User.findOne({ username })
}

export const findUserByEmail = async (email: string) => {
    return User.findOne({ email }).select('+email')
}

export const createUser = async (
    userData: { username: string; email: string },
    session?: ClientSession
) => {
    const [user] = await User.create([userData], { session })
    return user
}

export const updateUsername = async (userId: string, username: string) => {
    return User.findByIdAndUpdate(userId, { username }, { new: true })
}
