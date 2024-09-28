const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

let generatedNumber = null;
let userStart = 0;
let userEnd = 0;
let generatedNumbers = []; // Array to store previously generated numbers

app.use(express.static(path.join(__dirname, '../frontend/build')));

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// POST endpoint to generate the number
app.post('/generate', (req, res) => {
  const { start, end } = req.body;

  // Validate start and end
  if (start !== undefined && end !== undefined && !isNaN(start) && !isNaN(end)) {
    // If the range changes, reset the generated numbers array
    if (start !== userStart || end !== userEnd) {
      generatedNumbers = [];
      userStart = start;
      userEnd = end;
    }

    // Function to generate a unique number
    const generateUniqueNumber = () => {
      let num;
      if (generatedNumbers.length === (end - start + 1)) {
        return null; // Return null if all numbers have been generated
      }

      do {
        num = Math.floor(Math.random() * (end - start + 1)) + start;
      } while (generatedNumbers.includes(num)); // Ensure the number is unique
      return num;
    };

    generatedNumber = generateUniqueNumber();

    if (generatedNumber !== null) {
      generatedNumbers.push(generatedNumber); // Store the generated number
      io.emit('newNumber', generatedNumber);

      res.json({ success: true, message: 'Number generated', generatedNumber });
    } else {
      res.status(400).json({ success: false, message: 'All numbers have been generated' });
    }
  } else {
    res.status(400).json({ success: false, message: 'Invalid input' });
  }
});

app.get('/numbers', (req, res) => {
  res.json({ generatedNumbers, start: userStart, end: userEnd });
});

app.post('/reset', (req, res) => {
  generatedNumbers = [];
  userStart = 0;
  userEnd = 0;
  io.emit('resetNumbers');
  res.json({ success: true, message: 'Numbers array reset' });
});

// GET endpoint to fetch the generated number
app.get('/display', (req, res) => {
  if (generatedNumber !== null) {
    res.json({ start: userStart, end: userEnd, number: generatedNumber });
  } else {
    res.status(400).json({ message: 'No number generated yet' });
  }
});

// Fallback route to serve the frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

server.listen(5000, () => {
  console.log('Backend running on http://localhost:5000');
});
