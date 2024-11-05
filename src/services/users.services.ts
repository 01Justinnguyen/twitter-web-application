import { config } from 'dotenv'
import { ObjectId } from 'mongodb'
import { TokenType, UserVerifyStatus } from '~/constants/enums'
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

  private signEmailVerifyToken(user_id: string) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.EmailVerifyToken
      },
      privateKey: process.env.EMAIL_VERIFY_TOKEN_SECRET_KEY as string,
      options: {
        expiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRES_IN
      }
    })
  }

  private signForgotPasswordToken(user_id: string) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.ForgotPasswordToken
      },
      privateKey: process.env.FORGOT_PASSWORD_TOKEN_SECRET_KEY as string,
      options: {
        expiresIn: process.env.FORGOT_TOKEN_EXPIRES_IN
      }
    })
  }

  private signAccessAndRefreshToken(user_id: string) {
    return Promise.all([this.signAccessToken(user_id), this.signRefreshToken(user_id)])
  }

  private async storeRefreshToken({ user_id, token }: { user_id: ObjectId; token: string }) {
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({
        user_id,
        token
      })
    )
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
    await this.storeRefreshToken({ user_id: _id, token: refresh_token })
    return {
      message: ERROR_CODES_MESSAGE.LOGIN_SUCCESS,
      data: {
        access_token,
        refresh_token
      }
    }
  }

  async register(payload: RegisterReqBody) {
    const user_id = new ObjectId()
    const email_verify_token = await this.signEmailVerifyToken(user_id.toString())
    await databaseService.users.insertOne(
      new User({
        ...payload,
        _id: user_id,
        date_of_birth: new Date(payload.date_of_birth),
        email_verify_token,
        password: hashPassword(payload.password)
      })
    )

    const [access_token, refresh_token] = await this.signAccessAndRefreshToken(user_id.toString())
    await this.storeRefreshToken({ user_id: new ObjectId(user_id), token: refresh_token })

    return {
      message: ERROR_CODES_MESSAGE.REGISTER_SUCCESS,
      data: {
        access_token,
        refresh_token
      }
    }
  }

  async logout(refresh_token: string) {
    await databaseService.refreshTokens.deleteOne({ token: refresh_token })
    return {
      message: ERROR_CODES_MESSAGE.LOGOUT_SUCCESS
    }
  }

  async verifyEmail(user_id: string) {
    const [token] = await Promise.all([
      this.signAccessAndRefreshToken(user_id.toString()),
      await databaseService.users.updateOne(
        {
          _id: new ObjectId(user_id)
        },
        // Cách 1: Update time theo MongoDB cập nhật giá trị
        // {
        //   $set: {
        //     email_verify_token: '',
        //     verify: UserVerifyStatus.Verified
        //   },
        //   $currentDate: {
        //     updated_at: true
        //   }
        // },
        // Cách 2: Update time theo MongoDB cập nhật giá trị
        [
          {
            $set: {
              email_verify_token: '',
              verify: UserVerifyStatus.Verified,
              updated_at: '$$NOW'
            }
          }
        ]
      )
    ])
    const [access_token, refresh_token] = token
    return {
      message: ERROR_CODES_MESSAGE.EMAIL_VERIFY_SUCCESS,
      data: {
        access_token,
        refresh_token
      }
    }
  }

  async resendVerifyEmail(user_id: string) {
    // Giả bộ gửi email
    const email_verify_token = await this.signEmailVerifyToken(user_id)
    console.log('Gửi lại email verify')
    // Cập nhật lại giá trị email_verify_token trong document user
    await databaseService.users.updateOne(
      {
        _id: new ObjectId(user_id)
      },
      [
        {
          $set: {
            email_verify_token,
            updated_at: '$$NOW'
          }
        }
      ]
    )

    return {
      message: ERROR_CODES_MESSAGE.EMAIL_VERIFICATION_RESENT
    }
  }

  async forgotPassword(user_id: string) {
    const forgotPasswordToken = await this.signForgotPasswordToken(user_id)
    await databaseService.users.updateOne(
      {
        _id: new ObjectId(user_id)
      },
      [
        {
          $set: {
            forgot_password_token: forgotPasswordToken,
            updated_at: '$$NOW'
          }
        }
      ]
    )

    // Gửi email kèm đường link đến email người dùng: https://twitter.com/forgot-password?token=token
    console.log('forgot-password-token', forgotPasswordToken)

    return {
      message: ERROR_CODES_MESSAGE.CHECK_EMAIL_TO_RESET_PASSWORD
    }
  }

  async resetPassword({ user_id, password }: { user_id: string; password: string }) {
    await databaseService.users.updateOne(
      {
        _id: new ObjectId(user_id)
      },
      [
        {
          $set: {
            password: hashPassword(password),
            forgot_password_token: '',
            updated_at: '$$NOW'
          }
        }
      ]
    )

    return {
      message: ERROR_CODES_MESSAGE.RESET_PASSWORD_SUCCESS
    }
  }

  async getMeProfile(user_id: string) {
    const meProfile = await databaseService.users.findOne(
      {
        _id: new ObjectId(user_id)
      },
      {
        projection: {
          password: 0,
          email_verify_token: 0,
          forgot_password_token: 0,
          updated_at: 0,
          created_at: 0
        }
      }
    )

    return meProfile
  }

  async checkEmailAlreadyExists(email: string) {
    const result = await databaseService.users.findOne({ email })
    return Boolean(result)
  }

  async findUserAlreadyExists({ email }: { email: string }) {
    const user = await databaseService.users.findOne({
      email
    })
    return user
  }
}

const userServices = new UserServices()

export default userServices
