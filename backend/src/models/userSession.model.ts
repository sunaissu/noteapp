import { InferSchemaType, model, Schema } from 'mongoose'

const userSessionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    token: { type: String, required: true, unique: true },
    status: { type: String, enum: ['active', 'expired', 'revoked'], default: 'active' },
    expiresAt: { type: Date, required: true },
    revoked: { type: Boolean, default: false },
    replacedByToken: { type: String },
    ipAddress: { type: String },
    deviceInfo: { type: String }
  },
  { timestamps: true }
)

type UserSession = InferSchemaType<typeof userSessionSchema>

export default model<UserSession>('UserSession', userSessionSchema)
