const express = require('express');
const router = express.Router();

router.get('/tab', (req, res, next) => {
  res.send("Hello from tab")
});

router.post('/todos', (req, res, next) => {
  // post placeholder
});

router.delete('/todos/:id', (req, res, next) => {
  // delete placeholder
});

module.exports = router;