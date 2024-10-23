import express, { Request, Response } from 'express'
import cors from 'cors'
import { config } from 'dotenv'

config()
const app = express()
const PORT = process.env.PORT || 8888

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
  cors({
    origin: process.env.API_ROOT,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  })
)

const age: object = {}

app.get('/', function (req: Request, res: Response) {
  res.send('Hello World')
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
