import { InferSchemaType, model, Schema } from 'mongoose'

const noteSchema = new Schema(
  {
    title: { type: String, required: true },
    type: { type: String, enum: ['document', 'whiteboard'], default: 'document' },
    content: { type: String },
    
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sharedWith: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    isFavorite: { type: Boolean, default: false }
  },
  { timestamps: true }
)

type Note = InferSchemaType<typeof noteSchema>

export default model<Note>('Note', noteSchema)
