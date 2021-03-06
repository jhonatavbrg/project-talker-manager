const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const emailValidation = require('./middleware/emailValidation');
const passwordValidation = require('./middleware/passwordValidation');
const tokenGeneration = require('./middleware/tokenGeneration');
const authToken = require('./middleware/authToken');
const nameValidation = require('./middleware/nameValidation');
const ageValidation = require('./middleware/ageValidation');
const watchedAtValidation = require('./middleware/watchedAtValidation');
const rateValidation = require('./middleware/rateValidation');
const talkValidation = require('./middleware/talkValidation');
const createTalker = require('./middleware/createTalker');
const updateTalker = require('./middleware/updateTalker');
const deleteTalker = require('./middleware/deleteTalker');
const searchTalker = require('./middleware/searchTalker');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (_req, res) => {
  const data = await fs.readFile('./talker.json', 'utf-8');
  const fetchData = await JSON.parse(data);

  res.status(HTTP_OK_STATUS).json(fetchData);
});

app.get('/talker/search',
authToken,
searchTalker);

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const data = await fs.readFile('./talker.json', 'utf-8');
  const fetchData = await JSON.parse(data);

  const idTalker = fetchData.find((r) => r.id === +id);
  if (!idTalker) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });

  res.status(HTTP_OK_STATUS).json(idTalker);
});

app.post('/login',
emailValidation,
passwordValidation,
tokenGeneration);

app.post('/talker',
authToken,
nameValidation,
ageValidation,
talkValidation,
rateValidation,
watchedAtValidation,
createTalker);

app.put('/talker/:id', 
authToken,
nameValidation,
ageValidation,
talkValidation, 
watchedAtValidation,
rateValidation,
updateTalker);

app.delete('/talker/:id',
authToken,
deleteTalker);

app.listen(PORT, () => {
  console.log('Online');
});
