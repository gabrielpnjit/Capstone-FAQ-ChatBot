import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  SharedID: mongoose.Schema.Types.ObjectId, // Change to ObjectId type
  filename: String,
  content: String,
})
const logSchema = new mongoose.Schema({
	question: String,
	Answer: String,
  feedback: String,
  timestamp: String
})

const Logs = mongoose.model('logs', logSchema);
const File = mongoose.model('File', fileSchema);

const URI = process.env.ATLAS_URI;
mongoose.connect(URI, {})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

  export { File, Logs};