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
let userStart = 0; // Num user input
let userEnd = 0; //  Num user input

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
    generatedNumber = Math.floor(Math.random() * (end - start + 1)) + start;
    userStart = start;
    userEnd = end;

    console.log(start, end)

    io.emit('newNumber', generatedNumber);

    res.json({ success: true, message: 'Number generated', generatedNumber });
  } else {
    res.status(400).json({ success: false, message: 'Invalid input' });
  }
});

// GET endpoint to fetch the generated number
app.get('/display', (req, res) => {
  if (generatedNumber !== null) {
    res.json({ start: userStart, end: userEnd, number: generatedNumber });
  } else {
    res.status(400).json({ message: 'No number generated yet' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

server.listen(5000, () => {
  console.log('Backend running on http://localhost:5000');
});
