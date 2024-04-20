const express= require('express')
const mongoose = require('mongoose')
const pdfParse=require('pdf-parse')
const dotenv=require('dotenv')
const path=require('path')
const multer=require('multer')
const fs = require('fs').promises

dotenv.config({path:'./config.env'})

mongoose.connect('mongodb://localhost:27017/Lang',{
    useNewUrlParser: true, 
    useUnifiedTopology: true
}).then(()=>console.log('Databse Connection Established'))
  .catch(err=>console.error('MongoDB Connection Error',err))

const { Schema } = mongoose;
const fileSchema = new Schema({
    filename:String,
    path:String,
    size: Number,
    content:String
})

const File=mongoose.model('File', fileSchema)
const app = express()
app.set('view engine', 'ejs')
app.set('views',path.join(__dirname,'views'))

const upload = multer({ dest: 'uploads/' }); // Set the destination folder for uploaded files

//Test Pages
let adminroute=require('./route/backend/admin')
let indexroute=require('./route/backend/index')
let page1=require('./route/backend/page1')
let page2=require('./route/backend/page2')
let page3=require('./route/backend/page3')
app.use('/admin', adminroute)
app.use('/', indexroute)//Main landing page
app.use('/page1',page1)
// Route to render page2.ejs and display all data from MongoDB collection
app.get('/page2', async (req, res) => {
    try {
        // Fetch all data from the MongoDB collection
        const files = await File.find();

        // Render the page2.ejs template and pass the data
        res.render('backend/page2', { files });
    } catch (err) {
        console.error('Error fetching data from MongoDB:', err);
        res.status(500).send('Internal Server Error');
    }
});
// Route to render page3.ejs and display all data from MongoDB collection
app.get('/page3', async (req, res) => {
    try {
        // Fetch all data from the MongoDB collection
        const files = await File.find();

        // Render the page3.ejs template and pass the data
        res.render('backend/page3', { files });
    } catch (err) {
        console.error('Error fetching data from MongoDB:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/upload', upload.single('file'), async (req, res) => {
    // Check if file was uploaded
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }

    try {
        const pdfData=await pdfParse(req.file.path)
        // Read the content of the uploaded file
        const fileContent = pdfData.text

        // Create a new file object
        const newFile = new File({
            filename: req.file.originalname,
            path: req.file.path,
            size: req.file.size,
            content: fileContent // Save the content of the file
        });

        // Save the file object to the database
        await newFile.save();
        res.render('backend/good')

    } catch (err) {
        console.error('Error saving file:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Route to handle file deletion
app.post('/delete/:id', async (req, res) => {
    try {
        const fileId = req.params.id;
        
        // Find the file by ID and delete it from the MongoDB collection
        await File.findByIdAndDelete(fileId);

    } catch (err) {
        console.error('Error deleting file:', err);
        res.status(500).send('Internal Server Error');
    }
});

const PORT = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, ()=>{
    console.log(`Server is Running on port ${PORT}`)
})
