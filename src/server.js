const path = require('path');
const express = require('express');
const app = express();
const router = require('./lib/router');

const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use('/api', router);
app.use(express.static('dist/app'));

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'app/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});