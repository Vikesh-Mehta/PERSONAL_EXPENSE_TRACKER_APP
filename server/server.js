// server/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const budgetRoutes = require('./routes/budgetRoutes'); // <-- Import budget routes
const reportRoutes = require('./routes/reportRoutes'); // <-- Import report routes
const notificationRoutes = require('./routes/notificationRoutes');


// Load env vars
dotenv.config();

// Connect to database
connectDB();


const app = express();

// Enable CORS
// Configure CORS properly for production later
app.use(cors()); // Allows all origins for now

// Body parser middleware
app.use(express.json()); // To parse JSON bodies
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/budgets', budgetRoutes); // <-- Mount budget routes
app.use('/api/reports', reportRoutes); // <-- Mount report routes
app.use('/api/notifications', notificationRoutes);

// Simple route for testing
app.get('/', (req, res) => res.send('Expense Tracker API Running'));

const PORT = process.env.PORT || 5001; // Use environment variable or default

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Handle unhandled promise rejections (optional but good practice)
process.on('unhandledRejection', (err, promise) => {
  console.error(`Error: ${err.message}`);
  // Close server & exit process (optional)
  // server.close(() => process.exit(1));
});