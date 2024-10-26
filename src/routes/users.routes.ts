import { Router } from 'express'
import { loginController, registerController } from '~/controllers/users.controllers'
import { loginValidator, registerValidator } from '~/middlewares/users.middlewares'

const userRouter = Router()

userRouter.post('/login', loginValidator, loginController)

/**
 * Description: Register a new person
 * Path: /register
 * Method: POST
 * Body: {name: string, email: string, password: string, phone: string, date_of_birth: ISO8601, confirm_password: string}
 */
userRouter.post('/register', registerValidator, registerController)

export default userRouter
