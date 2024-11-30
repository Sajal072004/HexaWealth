const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');
const likeRoutes = require('./routes/like');
const cors = require('cors');
const cron = require('node-cron');

dotenv.config();
connectDB();


const app = express();
app.use(express.json()); // Parse JSON requests

const corsOptions = {
  origin: '*', // Change to your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

cron.schedule('*/7 * * * *', async () => {
  const url = 'https://hexawealth-backend.onrender.com/api/auth/dummy';
  try {
      const response = await fetch(url, {
          method: 'GET',
      });

      if (response.ok) {
          console.log('URL hit successfully!');
      } else {
          console.log('Failed to hit the URL:', response.statusText);
      }
  } catch (error) {
      console.log('Error hitting the URL:', error);
  }
});


app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
