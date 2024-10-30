import { Router } from 'express'
import { loginController, registerController } from '~/controllers/users.controllers'
import { loginValidator, registerValidator } from '~/middlewares/users.middlewares'
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

export default userRouter
