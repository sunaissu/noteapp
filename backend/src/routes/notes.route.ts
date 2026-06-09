import * as NoteController from '../controller/notes'
import express from 'express'
import { requireAuth } from '../util/auth'

const router = express.Router()

router.get('/', requireAuth, NoteController.getNotes)
router.get('/shared', requireAuth, NoteController.getSharedNotes)
router.get('/favorites', requireAuth, NoteController.getFavoriteNotes)
router.get('/:noteId', requireAuth, NoteController.getNote)
router.post('/', requireAuth, NoteController.createNote)
router.patch('/:noteId', requireAuth, NoteController.updateNote)
router.patch('/:noteId/favorite', requireAuth, NoteController.toggleFavorite)
router.delete('/:noteId', requireAuth, NoteController.deleteNote)

export default router
