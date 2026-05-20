import createHttpError from 'http-errors'
import * as userRepository from '../repositories/user.repository'

export const getUserProfile = async (userId: string) => {
  const user = await userRepository.findUserById(userId)
  if (!user) {
    throw createHttpError(404, 'User not found')
  }

  return user
}

export const updateUsername = async (userId: string, newUsername: string) => {
  if (!newUsername) {
    throw createHttpError(400, 'New username is required')
  }

  const existingUsername = await userRepository.findUserByUsername(newUsername)
  if (existingUsername && existingUsername._id.toString() !== userId) {
    throw createHttpError(409, 'Username is already taken')
  }

  const user = await userRepository.updateUsername(userId, newUsername)
  if (!user) {
    throw createHttpError(404, 'User not found')
  }

  return user
}
