import { NextFunction, Request, Response } from 'express'
import { checkSchema } from 'express-validator'
import userServices from '~/services/users.services'
import { validate } from '~/utils/validation'

export const loginValidator = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body
  if (!email || !password) {
    res.status(400).json({
      error: 'Missing email or password'
    })
    return
  }
  next()
}

export const registerValidator = validate(
  checkSchema({
    name: {
      isLength: {
        options: {
          min: 1,
          max: 255
        },
        errorMessage: 'Name must be from 1 to 255 characters'
      },
      trim: true
    },
    email: {
      notEmpty: true,
      isEmail: true,
      trim: true,
      custom: {
        options: async (email: string) => {
          const isExistEmail = await userServices.checkEmailAlreadyExist(email)
          if (isExistEmail) {
            throw new Error('Email already exist')
          }
          return true
        }
      }
    },
    password: {
      notEmpty: true,
      isLength: {
        options: {
          min: 6,
          max: 50
        },
        errorMessage: 'Password must be from 6 to 50 characters'
      },
      isStrongPassword: {
        options: {
          minLength: 6,
          minLowercase: 1,
          minNumbers: 1,
          minSymbols: 1,
          minUppercase: 1
        },
        errorMessage: 'Password must be strong'
      },
      trim: true
    },
    confirm_password: {
      notEmpty: true,
      isLength: {
        options: {
          min: 6,
          max: 50
        },
        errorMessage: 'Confirm password must be from 6 to 50 characters'
      },
      isStrongPassword: {
        options: {
          minLength: 6,
          minLowercase: 1,
          minNumbers: 1,
          minSymbols: 1,
          minUppercase: 1
        },
        errorMessage: 'Password must be strong'
      },
      trim: true,
      custom: {
        options: (value, { req }) => {
          if (value !== req.body.password) {
            throw new Error('Password confirmation does not match password')
          }
          return true
        }
      }
    },
    date_of_birth: {
      isISO8601: {
        options: {
          strict: true,
          strictSeparator: true
        }
      }
    }
  })
)
