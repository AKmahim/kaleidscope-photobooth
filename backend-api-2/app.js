const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const cors = require("cors");
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Multer configuration for handling file uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage });



// Enable CORS for specific origins
// app.use((req, res, next) => {
//   const allowedOrigins = [
//     'http://127.0.0.1:5500',
//     'http://127.0.0.1:5501',
//     'https://xri.com.bd',
//     'https://photobooth.alponayboishakh.com',
//     'http://127.0.0.1:8000',
//     'http://localhost:5173',
//     'http://localhost:5174'
//     // Add more allowed origins as needed
//   ];

//   const origin = req.headers.origin;

//   if (allowedOrigins.includes(origin)) {
//     res.header('Access-Control-Allow-Origin', origin);
//   }

//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   next();
// });

// server status index page
app.get('/', (req, res) => {
  res.status(200).send('<h1>Server is Running</h1>');
});

// Define a route for uploading an image to the local filesystem
app.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  const fileId = uuidv4();
  const fileExtension = req.file.originalname.split('.').pop();
  const fileName = `${fileId}.${fileExtension}`;
  const filePath = path.join(__dirname, 'uploads', fileName);

  // Ensure the uploads directory exists
  if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
    fs.mkdirSync(path.join(__dirname, 'uploads'));
  }

  try {
    fs.writeFileSync(filePath, req.file.buffer);
    return res.json({ success: true, id: fileId });
  } catch (error) {
    console.error('Error saving image to filesystem:', error);
    return res.status(500).json({ message: 'Failed to upload image.' });
  }
});

// Define a route for retrieving an image from the local filesystem by ID
app.get('/image/:id', async (req, res) => {
  const fileId = req.params.id;
  const filePath = path.join(__dirname, 'uploads', `${fileId}.jpg`); // Adjust the file extension as needed

  try {
    if (fs.existsSync(filePath)) {
      const image = fs.readFileSync(filePath);
      res.writeHead(200, {
        'Content-Type': 'image/jpeg', // Adjust the content type based on your image format
        'Content-Length': image.length,
      });
      res.end(image);
    } else {
      return res.status(404).json({ message: 'Image not found.' });
    }
  } catch (error) {
    console.error('Error retrieving image from filesystem:', error);
    return res.status(500).json({ message: 'Failed to retrieve image.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});