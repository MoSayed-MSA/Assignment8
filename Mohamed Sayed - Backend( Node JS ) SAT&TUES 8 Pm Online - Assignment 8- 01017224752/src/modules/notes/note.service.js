import noteModel from '../../db/models/note.model.js';

export const createNote = async (req, res, next) => {
    const { title, content } = req.body;
    const userId = req.user._id;

    await noteModel.create({ title, content, userId });

    return res.status(201).json({ message: 'Note created' });
};

export const updateNote = async (req, res, next) => {
    const { noteId } = req.params;
    const { title, content } = req.body;
    const userId = req.user._id;

    const note = await noteModel.findById(noteId);
    if (!note) {
        throw new Error('Note not found', { cause: 404 });
    }

    if (note.userId.toString() !== userId.toString()) {
        throw new Error('You are not the owner', { cause: 403 });
    }

    const updatedNote = await noteModel.findByIdAndUpdate(
        noteId,
        { title, content },
        { returnDocument: 'after' }
    );

    return res.status(200).json({
        message: 'updated',
        note: updatedNote
    });
};

export const replaceNote = async (req, res, next) => {
    const { noteId } = req.params;
    const { title, content } = req.body;
    const userId = req.user._id;

    const note = await noteModel.findById(noteId);
    if (!note) {
        throw new Error('Note not found', { cause: 404 });
    }

    if (note.userId.toString() !== userId.toString()) {
        throw new Error('You are not the owner', { cause: 403 });
    }

    const replacedNote = await noteModel.findOneAndReplace(
        { _id: noteId },
        { title, content, userId },
        { returnDocument: 'after' }
    );

    return res.status(200).json(replacedNote);
};

export const updateAllNotesTitle = async (req, res, next) => {
    const { title } = req.body;
    const userId = req.user._id;

    const result = await noteModel.updateMany(
        { userId },
        { title }
    );

    if (result.matchedCount === 0) {
        throw new Error('No note found', { cause: 404 });
    }

    return res.status(200).json({ message: 'All notes updated' });
};

export const deleteSingleNote = async (req, res, next) => {
    const { noteId } = req.params;
    const userId = req.user._id;

    const note = await noteModel.findById(noteId);
    if (!note) {
        throw new Error('Note not found', { cause: 404 });
    }

    if (note.userId.toString() !== userId.toString()) {
        throw new Error('You are not the owner', { cause: 403 });
    }

    const deletedNote = await noteModel.findByIdAndDelete(noteId);

    return res.status(200).json({
        message: 'deleted',
        note: deletedNote
    });
};

export const getPaginatedNotes = async (req, res, next) => {
    let { page = 1, limit = 3 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;
    const userId = req.user._id;

    const notes = await noteModel
        .find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    return res.status(200).json(notes);
};

export const getNoteById = async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user._id;

    const note = await noteModel.findById(id);
    if (!note) {
        throw new Error('Note not found', { cause: 404 });
    }

    if (note.userId.toString() !== userId.toString()) {
        throw new Error('You are not the owner', { cause: 403 });
    }

    return res.status(200).json(note);
};

export const getNoteByContent = async (req, res, next) => {
    const { content } = req.query;
    const userId = req.user._id;

    const note = await noteModel.findOne({
        userId,
        content: { $regex: content, $options: 'i' }
    });

    if (!note) {
        throw new Error('No note found', { cause: 404 });
    }

    return res.status(200).json(note);
};

export const getNotesWithUser = async (req, res, next) => {
    const id = req.user._id;

    const notes = await noteModel
        .find({ id })
        .select('title userId createdAt')
        .populate({
            path: 'id',
            select: 'email -_id'
        });

    return res.status(200).json(notes);
};

export const aggregateNotes = async (req, res, next) => {
    const userId = req.user._id;
    const { title } = req.query;

    const matchStage = { userId };

    if (title) {
        matchStage.title = { $regex: title, $options: 'i' };
    }

    const notes = await noteModel.aggregate([
        {
            $match: matchStage
        },
        {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'user'
            }
        },
        {
            $unwind: '$user'
        },
        {
            $project: {
                title: 1,
                userId: 1,
                createdAt: 1,
                'user.name': 1,
                'user.email': 1
            }
        }
    ]);

    return res.status(200).json(notes);
};

export const deleteAllNotes = async (req, res, next) => {
    const userId = req.user._id;

    await noteModel.deleteMany({ userId });

    return res.status(200).json({ message: 'Deleted' });
};