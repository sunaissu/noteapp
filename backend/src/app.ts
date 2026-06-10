import 'dotenv/config'
import express, { Request, Response, NextFunction } from 'express'
import noteRoutes from './routes/notes.route'
import morgan from 'morgan'
import createHttpError, { isHttpError } from 'http-errors'
import cors from 'cors'
import userRoutes from './routes/user.route'
import authRoutes from './routes/auth.route'
import session from 'express-session'
import env from './util/validateEnv'
import MongoStore from 'connect-mongo'
import passport from 'passport'
import './util/passport'

const app = express()

app.set('trust proxy', 1)

app.use(express.json())

app.use(morgan('dev'))

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true
  })
)

app.use(
  session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 12 * 60 * 60 * 1000,
      secure: env.ENVIRONMENT === 'production' ? true : false,
      httpOnly: true,
      sameSite: 'lax' 
    },
    rolling: true,
    store: MongoStore.create({
      mongoUrl: env.MONGO_CONN,
      dbName: env.MONGO_DB_NAME
    })
  })
)

app.use(passport.initialize())
app.use(passport.session())

app.use('/api/notes', noteRoutes)
app.use('/api/users', userRoutes)
app.use('/api/auth', authRoutes)

app.use((req, res, next) => {
  next(createHttpError(404, 'Endpoint not Found'))
})

//eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(error)
  let errorMessage = 'An unknown error occured'
  let statusCode = 500
  if (isHttpError(error)) {
    statusCode = error.status
    errorMessage = error.message
  }
  res.status(statusCode).json({ error: errorMessage })
})

export default app
