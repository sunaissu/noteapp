import { InferSchemaType, model, Schema } from 'mongoose'

const userSettingsSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    theme: { type: String, default: 'system' },
  },
  { timestamps: true }
)

type UserSettings = InferSchemaType<typeof userSettingsSchema>

export default model<UserSettings>('UserSettings', userSettingsSchema)
