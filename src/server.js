const mongoose = require('mongoose');
const app = require('./app');

const PORT = 8080;
mongoose.connect('mongodb://127.0.0.1:27017/db');

mongoose.connection.on('connected', async () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1); 
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
