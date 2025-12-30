const express = require('express');
const Contribution = require('../models/Contribution');
const Story = require('../models/Story');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all contributions
router.get('/', auth, async (req, res) => {
  try {
    const contributions = await Contribution.find().sort({ createdAt: -1 });
    res.json(contributions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get contributions for a specific story
router.get('/story/:storyId', auth, async (req, res) => {
  try {
    const contributions = await Contribution.find({ 
      story: req.params.storyId 
    }).sort({ createdAt: -1 });
    res.json(contributions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create contribution request
router.post('/', auth, async (req, res) => {
  try {
    const { storyId, content } = req.body;

    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    if (story.completed) {
      return res.status(400).json({ error: 'Story is already completed' });
    }

    const contribution = new Contribution({
      story: storyId,
      contributor: req.user._id,
      contributorName: req.user.username,
      content
    });

    await contribution.save();
    res.status(201).json(contribution);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Approve/Reject contribution
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body; // 'approved' or 'rejected'
    
    const contribution = await Contribution.findById(req.params.id);
    if (!contribution) {
      return res.status(404).json({ error: 'Contribution not found' });
    }

    const story = await Story.findById(contribution.story);
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    if (story.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    contribution.status = status;
    await contribution.save();

    // If approved, append to story
    if (status === 'approved') {
      story.content = story.content + '\n\n' + contribution.content;
      story.updatedAt = Date.now();
      await story.save();
    }

    res.json({ contribution, story });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
