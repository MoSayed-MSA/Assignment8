import { Router } from 'express';
import * as NS from './note.service.js';
import { Authenticate } from '../../middleware/auth.js';
const noteRouter = Router();

noteRouter.use(Authenticate);

//  GET Routes
noteRouter.get('/paginate-sort', NS.getPaginatedNotes);
noteRouter.get('/note-by-content', NS.getNoteByContent);
noteRouter.get('/note-with-user', NS.getNotesWithUser);
noteRouter.get('/aggregate', NS.aggregateNotes);

// PATCH & DELETE Routes
noteRouter.patch('/all', NS.updateAllNotesTitle);
noteRouter.delete('/', NS.deleteAllNotes);

// Create Note Route
noteRouter.post('/', NS.createNote);

// Parameterized Routes 
noteRouter.patch('/:noteId', NS.updateNote);
noteRouter.put('/replace/:noteId', NS.replaceNote);
noteRouter.delete('/:noteId', NS.deleteSingleNote);
noteRouter.get('/:id', NS.getNoteById);

export default noteRouter;