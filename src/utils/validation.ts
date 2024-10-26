import { NextFunction, Request, Response } from 'express'
import { ValidationChain, validationResult } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/lib/middlewares/schema'

// can be reused by many routes
export const validate = (validations: RunnableValidationChains<ValidationChain>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // sequential processing, stops running validations chain if one fails.
    await validations.run(req)
    const errors = validationResult(req)
    // Nếu mà không có lỗi thì next
    if (errors.isEmpty()) {
      return next()
    }
    // Nếu có lỗi thì xuất ra status và mãng lỗi
    res.status(400).json({ errors: errors.mapped() })
  }
}
