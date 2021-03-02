require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', express.static(path.join(__dirname, '../public')));

// your API calls
app.get('/getRoverData', async (req, res) => {
    try {
        let rover = req.get('rover');
        console.log(`calling api for data on ${rover}`);
        let roverImages = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=100&api_key=${process.env.API_KEY}`)
            .then(res => res.json());
        res.send({ roverImages });
    } catch (err) {
        console.log('error:', err);
    }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
