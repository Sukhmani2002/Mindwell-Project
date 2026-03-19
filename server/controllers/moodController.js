const Mood = require('../models/Mood');

exports.logMood = async (req, res) => {
  try {
    const { mood, intensity, note, activities } = req.body;

    if (!mood) {
      return res.status(400).json({ success: false, message: 'Mood is required' });
    }

    const newMood = await Mood.create({
      user: req.user._id,
      mood,
      intensity: intensity || 5,
      note: note || '',
      activities: activities || []
    });

    res.status(201).json({ success: true, message: 'Mood logged successfully', data: newMood });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMoodHistory = async (req, res) => {
  try {
    const { period = 'week' } = req.query;
    let dateFrom = new Date();

    if (period === 'week') dateFrom.setDate(dateFrom.getDate() - 7);
    else if (period === 'month') dateFrom.setMonth(dateFrom.getMonth() - 1);
    else if (period === 'year') dateFrom.setFullYear(dateFrom.getFullYear() - 1);
    else dateFrom = new Date(0);

    const moods = await Mood.find({
      user: req.user._id,
      createdAt: { $gte: dateFrom }
    }).sort({ createdAt: -1 });

    const moodCounts = moods.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {});

    res.json({ success: true, data: moods, stats: moodCounts, total: moods.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteMood = async (req, res) => {
  try {
    const mood = await Mood.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!mood) {
      return res.status(404).json({ success: false, message: 'Mood entry not found' });
    }
    res.json({ success: true, message: 'Mood entry deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
