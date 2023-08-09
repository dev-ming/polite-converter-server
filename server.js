const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
const PORT = process.env.PORT || 3001;  // React의 기본 포트인 3000과 다르게 설정

app.use(bodyParser.json());
app.use(cors());
require("dotenv").config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

app.post('/api/convert', async (req, res) => {
    const userInput = req.body.text;
    console.log('userInput:', userInput)

    try{
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `"${userInput}" 을 공손한 표현으로 변경해줘.`,
            temperature: 0.9,
            max_tokens: 150,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0.6,
        });
        console.log('response:', response.data);

        const politeText = response.data.choices[0].text;
        res.json({ politeText });
    } catch (error) {
        console.log(error.message);
    }

});

// app.post('/api/convert', async (req, res) => {
//     const userInput = req.body.text;
//     const prompt = req.body.prompt;
//     console.log('userInput:', userInput);
//     console.log('prompt:', prompt);
//
//     try {
//         const response = await axios.post('https://api.openai.com/v1/engines/davinci/completions', {
//             prompt: `"${userInput}" 을 공손한 표현으로 변경해줘.`,
//             max_tokens: 50
//         }, {
//             headers: {
//                 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
//             }
//         });
//         console.log('response:', response.data);
//         const politeText = response.data.choices[0].text.trim();
//         res.json({ politeText });
//     } catch (error) {
//         if(error.response && error.response.status === 429) {
//             res.status(429).json({ error: 'Too Many Requests' });
//         }
//         else {
//             console.error("Server Error:", error.message);
//             res.json({ error: 'Error processing your request.' });
//         }
//     }
// });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
