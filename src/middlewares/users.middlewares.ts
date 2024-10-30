import { NextFunction, Request, Response } from 'express'
import { checkSchema } from 'express-validator'
import ERROR_CODES_MESSAGE from '~/constants/messages'
import userServices from '~/services/users.services'
import { validate } from '~/utils/validation'

export const loginValidator = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body
  if (!email || !password) {
    res.status(400).json({
      error: ERROR_CODES_MESSAGE.MISSING_EMAIL_OR_PASSWORD
    })
    return
  }
  next()
}

export const registerValidator = validate(
  checkSchema(
    {
      name: {
        notEmpty: {
          errorMessage: ERROR_CODES_MESSAGE.MISSING_NAME_ERROR
        },
        isString: {
          errorMessage: ERROR_CODES_MESSAGE.NAME_MUST_BE_STRING
        },
        isLength: {
          options: {
            min: 1,
            max: 255
          },
          errorMessage: ERROR_CODES_MESSAGE.NAME_LENGTH_ERROR
        },
        trim: true
      },
      email: {
        notEmpty: {
          errorMessage: ERROR_CODES_MESSAGE.MISSING_EMAIL_ERROR
        },
        isEmail: {
          errorMessage: ERROR_CODES_MESSAGE.INVALID_EMAIL_FORMAT
        },
        trim: true,
        custom: {
          options: async (email: string) => {
            const isExistsEmail = await userServices.checkEmailAlreadyExists(email)
            if (isExistsEmail) {
              throw new Error(ERROR_CODES_MESSAGE.EMAIL_ALREADY_EXISTS)
            }
            return true
          }
        }
      },
      password: {
        notEmpty: {
          errorMessage: ERROR_CODES_MESSAGE.MISSING_PASSWORD_ERROR
        },
        isString: {
          errorMessage: ERROR_CODES_MESSAGE.PASSWORD_MUST_BE_STRING
        },
        isLength: {
          options: {
            min: 6,
            max: 50
          },
          errorMessage: ERROR_CODES_MESSAGE.PASSWORD_LENGTH_ERROR
        },
        isStrongPassword: {
          options: {
            minLength: 6,
            minLowercase: 1,
            minNumbers: 1,
            minSymbols: 1,
            minUppercase: 1
          },
          errorMessage: ERROR_CODES_MESSAGE.PASSWORD_STRONG_ERROR
        },
        trim: true
      },
      confirm_password: {
        notEmpty: {
          errorMessage: ERROR_CODES_MESSAGE.MISSING_CONFIRM_PASSWORD_ERROR
        },
        isString: {
          errorMessage: ERROR_CODES_MESSAGE.CONFIRM_PASSWORD_MUST_BE_STRING
        },
        isLength: {
          options: {
            min: 6,
            max: 50
          },
          errorMessage: ERROR_CODES_MESSAGE.CONFIRM_PASSWORD_LENGTH_ERROR
        },
        isStrongPassword: {
          options: {
            minLength: 6,
            minLowercase: 1,
            minNumbers: 1,
            minSymbols: 1,
            minUppercase: 1
          },
          errorMessage: ERROR_CODES_MESSAGE.PASSWORD_STRONG_ERROR
        },
        trim: true,
        custom: {
          options: (value, { req }) => {
            if (value !== req.body.password) {
              throw new Error(ERROR_CODES_MESSAGE.CONFIRM_PASSWORD_ERROR)
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
          },
          errorMessage: ERROR_CODES_MESSAGE.INVALID_DATE_OF_BIRTH_FORMAT
        }
      }
    },
    ['body']
  )
)
