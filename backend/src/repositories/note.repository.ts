import Notes from "../models/note.model";
import { NoteStatus } from "../types/_enums";
import mongoose from "mongoose";

export const findNotesByOwner = async (userId: string) => {
  return Notes.find({ owner: userId, status: NoteStatus.Active });
};

export const findNoteById = async (noteId: string) => {
  return Notes.findById(noteId);
}

export const findTrashedNotesByOwner = async (userId: string) => {
  return Notes.find({ owner: userId, status: NoteStatus.Trashed });
}

export const findSharedNotesByUser = async (userId: string) => {
  return Notes.find({
    "sharedWith.userId": userId,
    status: NoteStatus.Active,
  });
};

export const findFavoritedNotesByUser = async (userId: string) => {
  return Notes.find({
    favoritedBy: userId,
    status: NoteStatus.Active,
    $or: [
      { owner: userId },
      { "sharedWith.userId": userId },
    ],
  });
};

export const toggleFavorite = async (noteId: string, userId: string) => {
  const note = await Notes.findById(noteId);
  if (!note) return null;

  const userObjectId = new mongoose.Types.ObjectId(userId);
  const alreadyFavorited = note.favoritedBy.some(
    (id) => id.toString() === userId
  );

  return Notes.findByIdAndUpdate(
    noteId,
    alreadyFavorited
      ? { $pull: { favoritedBy: userObjectId } }
      : { $addToSet: { favoritedBy: userObjectId } },
    { new: true }
  );
};
