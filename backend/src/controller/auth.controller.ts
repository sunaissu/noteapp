import { Request, Response } from 'express'
import * as authService from '../services/auth.service'

export const signup = async (req: Request, res: Response) => {
    const user = await authService.signUpUser(req.body)

    await new Promise<void>((resolve, reject) => {
        req.login(user as Express.User, (err) => err ? reject(err) : resolve())
    })

    res.status(201).json({ message: 'User created successfully', user })
}

export const login = async (req: Request, res: Response) => {
    const user = await authService.loginUser(req.body)

    await new Promise<void>((resolve, reject) => {
        req.login(user as Express.User, (err) => err ? reject(err) : resolve())
    })

    res.status(200).json({ message: 'Login successful', user })

}
