const express = require('express');
const Story = require('../models/Story');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all stories
router.get('/', auth, async (req, res) => {
  try {
    const stories = await Story.find().sort({ createdAt: -1 });
    res.json(stories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single story
router.get('/:id', auth, async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }
    res.json(story);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create story
router.post('/', auth, async (req, res) => {
  try {
    const { title, content } = req.body;
    
    const story = new Story({
      title,
      content,
      author: req.user._id,
      authorName: req.user.username
    });

    await story.save();
    res.status(201).json(story);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update story (mark as completed)
router.patch('/:id/complete', auth, async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    if (story.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    story.completed = true;
    story.updatedAt = Date.now();
    await story.save();

    res.json(story);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update story content (when contribution approved)
router.patch('/:id/content', auth, async (req, res) => {
  try {
    const { content } = req.body;
    const story = await Story.findById(req.params.id);
    
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    if (story.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    story.content = content;
    story.updatedAt = Date.now();
    await story.save();

    res.json(story);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
