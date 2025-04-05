const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const { Configuration, OpenAIApi } = require('openai');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/api/process', async (req, res) => {
  const { prompt } = req.body;

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: `Rewrite the following text to be grammatically correct and complete:\n\n${prompt}` }]
    });

    const aiText = completion.data.choices[0].message.content.trim();
    res.json({ output: aiText });

  } catch (error) {
    console.error(error);
    res.status(500).send('Error contacting OpenAI');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
