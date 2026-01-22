require('dotenv').config({ path: './.env' });
const connectDB = require('./db/db.js');

const startServer = async () => {
  try {
    await connectDB();
    const server = app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is runninng on port ${process.env.PORT || 8000}`);
    });

    server.on('error', (error) => {
      console.error('Server error: ', error);
    });
  } catch (error) {
    console.error('database Connection Failure: ', error);
  }
};
startServer();
