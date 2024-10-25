import { Request, Response } from 'express'
import userServices from '~/services/users.services'

export const loginController = async (req: Request, res: Response) => {
  const result = await userServices.login(req.body)
  res.json(result)
}
