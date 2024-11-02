import { NextFunction, Request, Response } from 'express'
import userServices from '~/services/users.services'
import { ParamsDictionary } from 'express-serve-static-core'
import {
  EmailVerifyTokenReqBody,
  LoginRequestBody,
  LogoutReqBody,
  RegisterReqBody,
  TokenPayload
} from '~/models/requests/User.requests'
import databaseService from '~/services/database.services'
import { ObjectId } from 'mongodb'
import ERROR_CODES_MESSAGE from '~/constants/messages'
import HTTP_STATUS from '~/constants/httpStatus'
import { UserVerifyStatus } from '~/constants/enums'

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

export const resendverifyEmailController = async (req: Request, res: Response, next: NextFunction) => {
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
