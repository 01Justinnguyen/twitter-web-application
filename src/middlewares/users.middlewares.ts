import { config } from 'dotenv'
import { checkSchema } from 'express-validator'
import HTTP_STATUS from '~/constants/httpStatus'
import ERROR_CODES_MESSAGE from '~/constants/messages'
import databaseService from '~/services/database.services'
import userServices from '~/services/users.services'
import { ErrorWithStatus } from '~/utils/errors'
import { verifyToken } from '~/utils/jwt'
import { validate } from '~/utils/validation'
import { Request } from 'express'

config()

export const loginValidator = validate(
  checkSchema(
    {
      email: {
        notEmpty: {
          errorMessage: ERROR_CODES_MESSAGE.MISSING_EMAIL_ERROR
        },
        isEmail: {
          errorMessage: ERROR_CODES_MESSAGE.INVALID_EMAIL_FORMAT
        },
        trim: true
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
      }
    },
    ['body']
  )
)

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

export const accessTokenValidator = validate(
  checkSchema(
    {
      Authorization: {
        custom: {
          options: async (value: string, { req }) => {
            if (!value) {
              throw new ErrorWithStatus({
                message: ERROR_CODES_MESSAGE.TOKEN_NOT_FOUND,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            if (typeof value !== 'string') {
              throw new ErrorWithStatus({
                message: ERROR_CODES_MESSAGE.INVALID_REFRESH_TOKEN,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            const access_token = value.split(' ')[1]

            const decoded_authorization = await verifyToken({
              token: access_token,
              secretOrPublicKey: process.env.ACCESS_TOKEN_SECRET_KEY as string
            })
            ;(req as Request).decoded_authorization = decoded_authorization
            return true
          }
        }
      }
    },
    ['headers']
  )
)

export const refreshTokenValidator = validate(
  checkSchema(
    {
      refresh_token: {
        custom: {
          options: async (value: string, { req }) => {
            if (!value) {
              throw new ErrorWithStatus({
                message: ERROR_CODES_MESSAGE.TOKEN_NOT_FOUND,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            if (typeof value !== 'string') {
              throw new ErrorWithStatus({
                message: ERROR_CODES_MESSAGE.INVALID_REFRESH_TOKEN,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            const [decoded_refreshToken, isTokenExists] = await Promise.all([
              verifyToken({
                token: value,
                secretOrPublicKey: process.env.REFRESH_TOKEN_SECRET_KEY as string
              }),
              databaseService.refreshTokens.findOne({ token: value })
            ])
            if (!isTokenExists) {
              throw new ErrorWithStatus({
                message: ERROR_CODES_MESSAGE.TOKEN_NOT_FOUND,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            ;(req as Request).decoded_refreshToken = decoded_refreshToken

            return true
          }
        }
      }
    },
    ['body']
  )
)

export const emailVerifyTokenValidator = validate(
  checkSchema(
    {
      email_verify_token: {
        custom: {
          options: async (value: string, { req }) => {
            if (!value) {
              throw new ErrorWithStatus({
                message: ERROR_CODES_MESSAGE.TOKEN_NOT_FOUND,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            if (typeof value !== 'string') {
              throw new ErrorWithStatus({
                message: ERROR_CODES_MESSAGE.INVALID_EMAIL_VERIFY_TOKEN,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }

            const decoded_email_verify_token = await verifyToken({
              token: value,
              secretOrPublicKey: process.env.EMAIL_VERIFY_TOKEN_SECRET_KEY as string
            })
            ;(req as Request).decoded_email_verify_token = decoded_email_verify_token
            return true
          }
        }
      }
    },
    ['body']
  )
)
