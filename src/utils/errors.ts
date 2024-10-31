import { JsonWebTokenError } from 'jsonwebtoken'
import HTTP_STATUS from '~/constants/httpStatus'
import ERROR_CODES_MESSAGE from '~/constants/messages'

type ErrorsType = Record<
  string,
  {
    type: string
    msg: string
    [key: string]: any
  }
>

export class ErrorWithStatus {
  message: string
  status: number
  constructor({ message, status }: { message: string; status: number }) {
    this.message = message
    this.status = status
  }
}

export class EntityError extends ErrorWithStatus {
  errors: ErrorsType
  constructor({ message = ERROR_CODES_MESSAGE.VALIDATION_ERROR, errors }: { message?: string; errors: ErrorsType }) {
    super({ message, status: HTTP_STATUS.UNPROCESSABLE_ENTITY })
    this.errors = errors
  }
}

export class UnauthorizedError extends ErrorWithStatus {
  errors: JsonWebTokenError
  constructor({
    message = ERROR_CODES_MESSAGE.UNAUTHORIZED_ERRORS,
    errors
  }: {
    message?: string
    errors: JsonWebTokenError
  }) {
    super({ message, status: HTTP_STATUS.UNAUTHORIZED })
    this.errors = errors
  }
}
