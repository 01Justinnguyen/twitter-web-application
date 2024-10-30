import { config } from 'dotenv'
import { TokenType } from '~/constants/enums'
import { RegisterReqBody } from '~/models/requests/User.requests'
import User from '~/models/schemas/User.schema'
import databaseService from '~/services/database.services'
import hashPassword from '~/utils/crypto'
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

  async login(info: any) {
    const { email, password } = info
    if (email !== 'phuc01112002@gmail.com' || password !== '123123') {
      return {
        message: 'Email or password is incorrect'
      }
    }
    return {
      message: 'Login Success!!!'
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
      data: {
        access_token,
        refresh_token
      },
      message: 'Register successfully'
    }
  }

  async checkEmailAlreadyExists(email: string) {
    const result = await databaseService.users.findOne({ email })
    return Boolean(result)
  }
}

const userServices = new UserServices()

export default userServices
