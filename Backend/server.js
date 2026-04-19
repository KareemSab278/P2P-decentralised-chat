const express = require('express');
const Gun = require('gun');

const app = express();
const port = 5000;

const server = app.listen(port, () => {
  console.log(`Gun relay peer running on http://localhost:${port}`);
});

const gun = Gun({
  web: server,
  peers: [] 
});
