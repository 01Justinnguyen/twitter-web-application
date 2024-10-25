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
}

const userServices = new UserServices()

export default userServices
