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
// call API to retrieve photos
app.get('/getRoverPhotos', async (req, res) => {
    try {
        let rover = req.get('rover');
        console.log(`calling api for photos on ${rover}`);
        // use a ternary operator to change the Sol date based on which rover is requested. Perseverance just landed so as of today, Sol 9 is the latest date with available photos
        // only request one page of photos to speed up response, since some of the rovers can return nearly 500 photos in a single response
        let roverImages = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=${rover == 'perseverance' ? 9 : 100}&page=1&api_key=${process.env.API_KEY}`)
            .then(res => res.json());
        res.send({ roverImages });
    } catch (err) {
        console.log('error:', err);
    }
});

// call API to retrieve mission manifest
app.get('/getRoverData', async (req, res) => {
    try {
        let rover = req.get('rover');
        console.log(`calling api for data on ${rover}`);
        let roverData = await fetch(`https://api.nasa.gov/mars-photos/api/v1/manifests/${rover}/?api_key=${process.env.API_KEY}`)
            .then(res => res.json());
        res.send({ roverData });
    } catch (err) {
        console.log('error:', err);
    }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
