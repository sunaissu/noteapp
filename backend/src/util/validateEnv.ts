import { cleanEnv } from 'envalid'
import { str, port } from 'envalid/dist/validators'

export default cleanEnv(process.env, {
  MONGO_CONN: str(),
  PORT: port(),
  SESSION_SECRET: str(),
  GOOGLE_AUTH_CLIENT_ID: str(),
  GOOGLE_AUTH_CLIENT_SECRET: str(),
  GOOGLE_CALLBACK_URL: str(),
  ENVIRONMENT: str(),
  CLIENT_URL: str()
})
