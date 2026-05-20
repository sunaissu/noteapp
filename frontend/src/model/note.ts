import { NoteboardElement, NoteboardSession } from "@sunaissu/noteboard";

export type PermissionLevel = 'viewer' | 'editor';

export enum NoteType {
  Document = 'document',
  Whiteboard = 'whiteboard'
}

export interface Collaborator {
  userId: string;
  permission: PermissionLevel;
}

export interface BaseNote {
  _id: string;
  title: string;
  ownerId: string;
  sharedWith: Collaborator[];
  createdAt: string;
  updatedAt: string;
}
export interface DocumentNote extends BaseNote {
  type: NoteType.Document;
  content: string;
}
export interface WhiteboardNote extends BaseNote {
  type: NoteType.Whiteboard;
  content: NoteboardSession;
}

export type Note = DocumentNote | WhiteboardNote;
