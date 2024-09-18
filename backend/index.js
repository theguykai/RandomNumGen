const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

let generatedNumber = null;

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true
}));

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
  if (start !== undefined && end !== undefined) {
    generatedNumber = Math.floor(Math.random() * (end - start + 1)) + start;
    io.emit('newNumber', generatedNumber);  // Emit the new number to all clients
    res.json({ success: true, message: 'Number generated' });
  } else {
    res.status(400).json({ success: false, message: 'Invalid input' });
  }
});


// GET endpoint to fetch the generated number
app.get('/display', (req, res) => {
  if (generatedNumber !== null) {
    res.json({ number: generatedNumber });
  } else {
    res.status(400).json({ message: 'No number generated yet' });
  }
});

server.listen(5000, () => {
  console.log('Backend running on http://localhost:5000');
});
