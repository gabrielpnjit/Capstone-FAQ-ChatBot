const mongoose = require('mongoose');
const { ATLAS_URI } = require('../config.json');

mongoose.connect(ATLAS_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const logSchema = new mongoose.Schema({
  questionId: String,
  question: String,
  answer: String,
  feedback: String,
  timestamp: String,
  messageLink: String,
  sources: [String]
});

const Logs = mongoose.model('logs', logSchema);

module.exports = { mongoose, Logs};