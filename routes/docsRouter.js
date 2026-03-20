const express = require('express');
const { seedDocs, askQuestion } = require('../controllers/docsController');

const docsRouter = express.Router();

docsRouter.post('/embed-docs', seedDocs);
docsRouter.post('/ask', askQuestion);

module.exports = docsRouter;