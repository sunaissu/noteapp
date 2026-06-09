import { RequestHandler } from "express";
import NoteModel from "../models/note.model";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import * as NoteRepository from "../repositories/note.repository";

export const getNotes: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user!.id as string;
    const notes = await NoteRepository.findNotesByOwner(userId);
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
};

export const getSharedNotes: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user!.id as string;
    const notes = await NoteRepository.findSharedNotesByUser(userId);
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
};

export const getFavoriteNotes: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user!.id as string;
    const notes = await NoteRepository.findFavoritedNotesByUser(userId);
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
};

export const getNote: RequestHandler = async (req, res, next) => {
  const noteId = req.params.noteId as string;
  try {
    if (!mongoose.isValidObjectId(noteId)) {
      throw createHttpError(400, "Invalid note ID");
    }

    const note = await NoteModel.findById(noteId).exec();
    if (!note) {
      throw createHttpError(404, "Note not found");
    }

    const userId = req.user!.id as string;
    const isOwner = note.owner.toString() === userId;
    const isCollaborator = note.sharedWith.some(
      (s: any) => s.userId.toString() === userId,
    );
    if (!isOwner && !isCollaborator) {
      throw createHttpError(403, "You do not have access to this note");
    }
    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

export const createNote: RequestHandler = async (req, res, next) => {
  const title = req.body.title;
  const text = req.body.text;
  const type = req.body.type;
  try {
    if (!title) {
      throw createHttpError(400, "Note must have a title");
    }

    const userId = req.user!.id as string;

    const newNote = await NoteModel.create({
      title: title,
      content: text,
      type: type || "document",
      owner: userId,
    });

    res.status(201).json(newNote);
  } catch (error) {
    next(error);
  }
};

export const updateNote: RequestHandler = async (req, res, next) => {
  const noteId = req.params.noteId as string;
  const newTitle = req.body.title;
  const newText = req.body.text;
  try {
    if (!mongoose.isValidObjectId(noteId)) {
      throw createHttpError(400, "Invalid note ID");
    }
    // At least one field must be provided
    if (newTitle === undefined && newText === undefined) {
      throw createHttpError(400, "Nothing to update");
    }
    const note = await NoteModel.findById(noteId).exec();
    if (!note) {
      throw createHttpError(404, "Note not found");
    }

    const userId = req.user!.id as string;
    const isOwner = note.owner.toString() === userId;
    const isEditor = note.sharedWith.some(
      (s: any) => s.userId.toString() === userId && s.permission === "editor",
    );
    if (!isOwner && !isEditor) {
      throw createHttpError(
        403,
        "You do not have permission to edit this note",
      );
    }

    if (newTitle !== undefined) note.title = newTitle;
    if (newText !== undefined) note.content = newText;
    const updatedNote = await note.save();

    res.status(200).json(updatedNote);
  } catch (error) {
    next(error);
  }
};

export const deleteNote: RequestHandler = async (req, res, next) => {
  const noteId = req.params.noteId as string;
  try {
    if (!mongoose.isValidObjectId(noteId)) {
      throw createHttpError(400, "Invalid note ID");
    }

    const note = await NoteModel.findById(noteId).exec();
    if (!note) {
      throw createHttpError(404, "Note not found");
    }

    const userId = req.user!.id as string;
    const isOwner = note.owner.toString() === userId;
    if (!isOwner) {
      throw createHttpError(403, "Only the owner can delete this note");
    }
    await note.deleteOne();
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

export const toggleFavorite: RequestHandler = async (req, res, next) => {
  const noteId = req.params.noteId as string;
  try {
    if (!mongoose.isValidObjectId(noteId)) {
      throw createHttpError(400, "Invalid note ID");
    }

    const userId = req.user!.id as string;
    const note = await NoteModel.findById(noteId).exec();

    if (!note) {
      throw createHttpError(404, "Note not found");
    }

    const isOwner = note.owner.toString() === userId;
    const isCollaborator = note.sharedWith.some(
      (s) => s.userId.toString() === userId,
    );
    if (!isOwner && !isCollaborator) {
      throw createHttpError(403, "You do not have access to this note");
    }

    const updatedNote = await NoteRepository.toggleFavorite(noteId, userId);
    if (!updatedNote) throw createHttpError(404, "Note not found");
    res.status(200).json(updatedNote);
  } catch (error) {
    next(error);
  }
};
