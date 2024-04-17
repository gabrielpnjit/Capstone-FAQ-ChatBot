// Import mongoose and create a connection
import mongoose from 'mongoose';

// Define the Mongoose Schema for the File model
const fileSchema = new mongoose.Schema({
  filename: String,
  content: String
});

// Define the File model
const File = mongoose.model('File', fileSchema);

// MongoDB connection URI
const URI = process.env.ATLAS_URI;

// Connect to the MongoDB database using Mongoose
mongoose.connect(URI, {})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Export the File model
export default File;
