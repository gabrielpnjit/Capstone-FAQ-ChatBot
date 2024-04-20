import mongoose from 'mongoose';
const URI = process.env.ATLAS_URI;

mongoose.connect(URI, {})
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


const fileSchema = new mongoose.Schema({
  SharedID: mongoose.Schema.Types.ObjectId, // Change to ObjectId type
  filename: String,
  content: String,
})

const Logs = mongoose.model('logs', logSchema);
const File = mongoose.model('File', fileSchema);

export { File, Logs};