const app = require('./app');
const PORT = process.env.PORT || 3000;

// Start the Server
app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});