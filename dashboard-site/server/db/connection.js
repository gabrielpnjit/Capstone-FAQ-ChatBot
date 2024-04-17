import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  filename: String,
  content: String
})
const logSchema = new mongoose.Schema({
	question: String,
	Answer: String
})

const Logs = mongoose.model('logs', logSchema);
const File = mongoose.model('File', fileSchema);

const URI = process.env.ATLAS_URI;
mongoose.connect(URI, {})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

  export { File, Logs};