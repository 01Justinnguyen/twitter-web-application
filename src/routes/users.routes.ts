import { Router } from 'express'
import { loginController, logoutController, registerController } from '~/controllers/users.controllers'
import {
  accessTokenValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator
} from '~/middlewares/users.middlewares'
import { wrapRequestHandler2 } from '~/utils/handlers'

const userRouter = Router()

// Khi xảy ra lỗi trong async handler thì phải gọi `next(err)` để chuyển sang error handler

userRouter.post('/login', loginValidator, wrapRequestHandler2(loginController))

/**
 * Description: Register a new person
 * Path: /register
 * Method: POST
 * Body: {name: string, email: string, password: string, phone: string, date_of_birth: ISO8601, confirm_password: string}
 */
userRouter.post('/register', registerValidator, wrapRequestHandler2(registerController))

/**
 * Description: Logout a user
 * Path: /logout
 * Method: POST
 * Header: {Authorization: Bearer <access_token>}
 * Body: {refresh_token: string}
 */
userRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandler2(logoutController))

export default userRouter
