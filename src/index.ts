import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import { config } from 'dotenv'
import userRouter from '~/routes/users.routes'
import databaseService from '~/services/database.services'

config()
const app = express()
const PORT = process.env.PORT || 8888

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
  cors({
    origin: process.env.API_ROOT,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'UPDATE']
  })
)

app.use('/users', userRouter)
databaseService.connect()

// Error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log('Lỗi rồi', err.message)
  res.status(404).json({ error: err.message })
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
