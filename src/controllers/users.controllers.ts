import { Request, Response } from 'express'
import userServices from '~/services/users.services'

export const loginController = async (req: Request, res: Response) => {
  const result = await userServices.login(req.body)
  res.json(result)
}

export const registerController = async (req: Request, res: Response) => {
  const { email, password } = req.body

  const result = await userServices.register(email, password)

  res.json(result)
}
