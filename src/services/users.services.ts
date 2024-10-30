import { config } from 'dotenv'
import { NextFunction } from 'express'
import { TokenType } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import ERROR_CODES_MESSAGE from '~/constants/messages'
import { LoginRequestBody, RegisterReqBody } from '~/models/requests/User.requests'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import User from '~/models/schemas/User.schema'
import databaseService from '~/services/database.services'
import hashPassword from '~/utils/crypto'
import { ErrorWithStatus } from '~/utils/errors'
import { signToken } from '~/utils/jwt'
config()
class UserServices {
  private signAccessToken(user_id: string) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.AccessToken
      },
      privateKey: process.env.ACCESS_TOKEN_SECRET_KEY as string,
      options: {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
      }
    })
  }

  private signRefreshToken(user_id: string) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.RefreshToken
      },
      privateKey: process.env.REFRESH_TOKEN_SECRET_KEY as string,
      options: {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
      }
    })
  }

  private signAccessAndRefreshToken(user_id: string) {
    return Promise.all([this.signAccessToken(user_id), this.signRefreshToken(user_id)])
  }

  async login(payload: LoginRequestBody) {
    const { email, password } = payload
    const user = await databaseService.users.findOne({ email, password: hashPassword(password) })
    if (!user) {
      throw new ErrorWithStatus({
        message: ERROR_CODES_MESSAGE.INVALID_CREDENTIALS,
        status: HTTP_STATUS.UNAUTHORIZED
      })
    }
    const { _id } = user
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken(_id.toString())
    await databaseService.refreshToken.insertOne(
      new RefreshToken({
        user_id: _id,
        token: refresh_token
      })
    )
    return {
      message: ERROR_CODES_MESSAGE.LOGIN_SUCCESS,
      data: {
        access_token,
        refresh_token
      }
    }
  }

  async register(payload: RegisterReqBody) {
    const result = await databaseService.users.insertOne(
      new User({
        ...payload,
        date_of_birth: new Date(payload.date_of_birth),
        password: hashPassword(payload.password)
      })
    )

    const user_id = result.insertedId.toString()
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken(user_id)
    return {
      message: ERROR_CODES_MESSAGE.REGISTER_SUCCESS,
      data: {
        access_token,
        refresh_token
      }
    }
  }

  async checkEmailAlreadyExists(email: string) {
    const result = await databaseService.users.findOne({ email })
    return Boolean(result)
  }
}

const userServices = new UserServices()

export default userServices
