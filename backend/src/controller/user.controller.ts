import { Request, Response } from 'express'
import * as userService from '../services/user.service'

export const getProfile = async (req: Request, res: Response) => {
  const userId = req.user!.id as string

  const user = await userService.getUserProfile(userId)
  res.status(200).json({ user })
}

export const updateUsername = async (req: Request, res: Response) => {
  const userId = req.user!.id as string
  const { newUsername } = req.body

  const updatedUser = await userService.updateUsername(userId, newUsername)
  res.status(200).json({ message: 'Username updated successfully', user: updatedUser })
}
