import { NextFunction, Request, Response } from 'express'
import userServices from '~/services/users.services'
import { ParamsDictionary } from 'express-serve-static-core'
import {
  EmailVerifyTokenReqBody,
  ForgotPasswordReqBody,
  LoginRequestBody,
  LogoutReqBody,
  RegisterReqBody,
  ResetPasswordReqBody,
  TokenPayload
} from '~/models/requests/User.requests'
import databaseService from '~/services/database.services'
import { ObjectId } from 'mongodb'
import ERROR_CODES_MESSAGE from '~/constants/messages'
import HTTP_STATUS from '~/constants/httpStatus'
import { UserVerifyStatus } from '~/constants/enums'
import User from '~/models/schemas/User.schema'

export const loginController = async (req: Request<ParamsDictionary, any, LoginRequestBody>, res: Response) => {
  const result = await userServices.login(req.body)
  res.json(result)
}

export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterReqBody>,
  res: Response,
  next: NextFunction
) => {
  const result = await userServices.register(req.body)
  res.json(result)
}

export const logoutController = async (
  req: Request<ParamsDictionary, any, LogoutReqBody>,
  res: Response,
  next: NextFunction
) => {
  const result = await userServices.logout(req.body.refresh_token)
  res.json(result)
}

export const verifyEmailController = async (
  req: Request<ParamsDictionary, any, EmailVerifyTokenReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_email_verify_token as TokenPayload
  const user = await databaseService.users.findOne({
    _id: new ObjectId(user_id)
  })
  // Nếu không tìm thấy user thì báo lõi
  if (!user) {
    res.status(404).json({
      message: ERROR_CODES_MESSAGE.USER_NOT_FOUND
    })
    return
  }
  // Đã verify rồi thì không báo lỗi mà sẽ trả về status OK
  if (user.email_verify_token === '') {
    res.json({
      message: ERROR_CODES_MESSAGE.EMAIL_ALREADY_VERIFIED
    })
    return
  }

  // Nếu email chưa verify thì thực hiện verify
  const result = await userServices.verifyEmail(user_id)
  res.json(result)

  return
}

export const resendVerifyEmailController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
  if (!user) {
    res.status(HTTP_STATUS.NOT_FOUND).json({
      message: ERROR_CODES_MESSAGE.USER_NOT_FOUND
    })
    return
  }
  if (user.verify === UserVerifyStatus.Verified) {
    res.json({
      message: ERROR_CODES_MESSAGE.EMAIL_ALREADY_VERIFIED
    })
    return
  }
  const result = await userServices.resendVerifyEmail(user_id)
  res.json(result)
}

export const forgotPasswordController = async (
  req: Request<ParamsDictionary, any, ForgotPasswordReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { _id: user_id } = req.user as User
  const result = await userServices.forgotPassword((user_id as ObjectId).toString())
  res.json(result)
  return
}

export const verifyForgotPasswordTokenController = async (req: Request, res: Response, next: NextFunction) => {
  res.json({
    message: ERROR_CODES_MESSAGE.VERIFY_FORGOT_PASSWORD_TOKEN_SUCCESS
  })
}

export const resetPasswordController = async (
  req: Request<ParamsDictionary, any, ResetPasswordReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { password } = req.body
  const { user_id } = req.decoded_forgotPasswordToken as TokenPayload
  const result = await userServices.resetPassword({ user_id: user_id.toString(), password })

  res.json(result)
  return
}

export const getProfileController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const user = await userServices.getMeProfile(user_id)

  res.json({
    message: ERROR_CODES_MESSAGE.GET_ME_PROFILE_SUCCESS,
    data: user
  })
}
