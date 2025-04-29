const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db'); // MongoDB connection
const userRoutes = require('./routes/userRoutes');
const app = express();

// Connect to database
connectDB();

app.use(bodyParser.json()); // Middleware to parse JSON bodies

// Routes
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
