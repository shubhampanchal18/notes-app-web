const express = require('express');
const { Op } = require('sequelize');
const auth = require('../middleware/auth');
const Note = require('../models/Note');

const router = express.Router();

// Create a note
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, tags, color, pinned } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Please provide title and content' });
    }

    const note = await Note.create({
      title,
      content,
      tags: tags ? tags.join(',') : '',
      color: color || '#4f7cff',
      pinned: !!pinned,
      userId: req.user.userId
    });

    res.status(201).json({
      message: 'Note created successfully',
      note
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all notes for a user
router.get('/', auth, async (req, res) => {
  try {
    const { search, tag } = req.query;
    const where = { userId: req.user.userId };

    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { content: { [Op.like]: `%${search}%` } },
        { tags: { [Op.like]: `%${search}%` } }
      ];
    }

    if (tag) {
      where.tags = { [Op.like]: `%${tag}%` };
    }

    const notes = await Note.findAll({
      where,
      order: [['pinned', 'DESC'], ['updatedAt', 'DESC']]
    });

    res.json({
      message: 'Notes retrieved successfully',
      notes
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get a single note
router.get('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findByPk(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (note.userId !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to access this note' });
    }

    res.json({
      message: 'Note retrieved successfully',
      note
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update a note
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, content, tags, color, pinned } = req.body;

    let note = await Note.findByPk(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (note.userId !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this note' });
    }

    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags.join(',');
    if (color) note.color = color;
    if (typeof pinned === 'boolean') note.pinned = pinned;

    await note.save();

    res.json({
      message: 'Note updated successfully',
      note
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete a note
router.delete('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findByPk(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (note.userId !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this note' });
    }

    await note.destroy();

    res.json({
      message: 'Note deleted successfully'
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
