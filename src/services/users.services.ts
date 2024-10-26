import User from '~/models/schemas/user.shema'
import databaseService from '~/services/database.services'

class UserServices {
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

  async register(email: string, password: string) {
    await databaseService.users.insertOne(
      new User({
        email,
        password
      })
    )
    return {
      message: 'Register successfully'
    }
  }
}

const userServices = new UserServices()

export default userServices
