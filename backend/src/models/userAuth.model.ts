import { InferSchemaType, model, Schema } from 'mongoose'

const userAuthSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    password: { type: String, select: false },
    googleId: { type: String, unique: true, sparse: true, select: false },
    authProvider: { type: String, enum: ['local', 'google'], default: 'local' }
  },
  { timestamps: true }
)

type UserAuth = InferSchemaType<typeof userAuthSchema>

export default model<UserAuth>('UserAuth', userAuthSchema)
