import { NextFunction, Request, RequestHandler, Response } from 'express'

// Cách 1: ngắn nhưng khó hiểu
export const wrapRequestHandler =
  (func: RequestHandler): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(func(req, res, next)).catch(next)

// Cách 2: Dài hơn nhưng dễ hiểu
export const wrapRequestHandler2 =
  (func: RequestHandler): RequestHandler =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await func(req, res, next)
    } catch (error) {
      next(error)
    }
  }
