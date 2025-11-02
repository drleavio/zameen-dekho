const express = require('express');
const { userMiddleware } = require('./controller/user-middleware');
const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Sample route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/v1/api',userMiddleware, require('./protected/protected'));
app.use('/v1/api', require('./notProtected/notProtected'));

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

module.exports = app; // Exporting for testing purposes