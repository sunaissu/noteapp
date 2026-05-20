import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
import createHttpError from 'http-errors'
import * as userRepository from '../repositories/user.repository'
import * as userAuthRepository from '../repositories/userAuth.repository'

interface SignupData {
    username?: string
    email?: string
    password?: string
}

interface LoginData {
    email?: string
    password?: string
}

export interface GoogleAuthProfile {
    googleId: string
    email: string
    displayName: string
}

export const signUpUser = async ({ username, email, password }: SignupData) => {
    if (!username || !email || !password) {
        throw createHttpError(400, 'Missing Parameters')
    }

    const existingUsername = await userRepository.findUserByUsername(username)
    if (existingUsername) {
        throw createHttpError(409, 'Username already exists.')
    }

    const existingUser = await userRepository.findUserByEmail(email)
    if (existingUser) {
        const existingAuth = await userAuthRepository.findAuthByUserId(existingUser._id)
        if (existingAuth && existingAuth.authProvider === 'google') {
            throw createHttpError(409, 'An account with this email is registered via Google. Please log in with Google.')
        }

        throw createHttpError(409, 'User with email already exists.')
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const newUser = await userRepository.createUser({ username, email }, session)

        await userAuthRepository.createUserAuth({
            userId: newUser._id,
            password: passwordHash,
            authProvider: 'local'
        }, session)

        await session.commitTransaction()
        return newUser
    } catch (error) {
        await session.abortTransaction()
        throw error
    } finally {
        session.endSession()
    }
}

export const loginUser = async ({ email, password }: LoginData) => {
    if (!email || !password) {
        throw createHttpError(400, 'Parameters Missing')
    }

    const user = await userRepository.findUserByEmail(email)
    if (!user) {
        throw createHttpError(401, 'Invalid Credentials')
    }

    const auth = await userAuthRepository.findAuthByUserId(user._id)
    if (!auth || !auth.password) {
        throw createHttpError(401, 'Invalid Credentials')
    }

    if (auth.authProvider === 'google' || !auth.password) {
        throw createHttpError(401, 'This account is linked to Google. Please log in with Google.')
    }

    const isPasswordCorrect = await bcrypt.compare(password, auth.password)
    if (!isPasswordCorrect) {
        throw createHttpError(401, 'Invalid Credentials')
    }

    return user
}

export const authenticateWithGoogle = async (profile: GoogleAuthProfile) => {
    if (!profile.googleId || !profile.email) {
        throw createHttpError(400, 'Missing Google Profile Data')
    }

    const existingAuth = await userAuthRepository.findAuthByGoogleId(profile.googleId)
    if (existingAuth) {
        const user = await userRepository.findUserById(existingAuth.userId.toString())
        if (!user) throw createHttpError(404, 'User not found')
        return user
    }

    const existingUser = await userRepository.findUserByEmail(profile.email)
    if (existingUser) {
        throw createHttpError(409, 'An account with this email already exists. Please log in using your password.')
    }

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const newUser = await userRepository.createUser({
            username: profile.displayName,
            email: profile.email
        }, session)

        await userAuthRepository.createUserAuth({
            userId: newUser._id,
            googleId: profile.googleId,
            authProvider: 'google'
        }, session)

        await session.commitTransaction()
        return newUser
    } catch (error) {
        await session.abortTransaction()
        throw error
    } finally {
        session.endSession()
    }
}
