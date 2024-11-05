import { Router } from 'express'
import {
  verifyEmailController,
  loginController,
  logoutController,
  registerController,
  resendVerifyEmailController,
  forgotPasswordController,
  verifyForgotPasswordTokenController,
  resetPasswordController
} from '~/controllers/users.controllers'
import {
  accessTokenValidator,
  emailVerifyTokenValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetPasswordValidator,
  verifyForgotPasswordTokenValidator
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

/**
 * Description: Verify email when user click on the link in email
 * Path: /verify-email
 * Method: POST
 * Body: {email_verify_token: string}
 */
userRouter.post('/verify-email', emailVerifyTokenValidator, wrapRequestHandler2(verifyEmailController))

/**
 * Description: Resend verify email when user click on button resend
 * Path: /resend-verify-email
 * Method: POST
 * Header: {Authorization: Bearer <access_token>}
 * Body: {}
 */
userRouter.post('/resend-verify-email', accessTokenValidator, wrapRequestHandler2(resendVerifyEmailController))

/**
 * Description: Submit email to reset password, send email to user
 * Path: /forgot-password
 * Method: POST
 * Body: {email: string}
 */
userRouter.post('/forgot-password', forgotPasswordValidator, wrapRequestHandler2(forgotPasswordController))

/**
 * Description: Verify link to reset password
 * Path: /verify-forgot-password-token
 * Method: POST
 * Body: {forgot_password_token: string}
 */
userRouter.post(
  '/verify-forgot-password-token',
  verifyForgotPasswordTokenValidator,
  wrapRequestHandler2(verifyForgotPasswordTokenController)
)

/**
 * Description: Reset password
 * Path: /reset-password
 * Method: POST
 * Body: {forgot_password_token: string, password: string, confirm_password: string}
 */
userRouter.post('/reset-password', resetPasswordValidator, wrapRequestHandler2(resetPasswordController))

export default userRouter
