const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const { Client } = require('@elastic/elasticsearch');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/images/');
    },
    filename: function (req, file, cb) {
        const fileName = `${req.body.sportType}_${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, fileName);
    }
});

const upload = multer({ storage: storage });

const esClient = new Client({
    node: 'http://localhost:9200'
});

app.get('/api/news', (req, res) => {
    const apiUrl = `https://newsapi.org/v2/top-headlines?country=us&category=sports&apiKey=${process.env.NEWSAPI_KEY}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.articles && data.articles.length) {
                // Shuffle array and pick the first two news items
                const shuffled = data.articles.sort(() => 0.5 - Math.random());
                let selected = shuffled.slice(0, 2);
                res.json(selected);
            } else {
                res.status(404).json({ message: "No news found" });
            }
        })
        .catch(error => {
            console.error('Error fetching news:', error);
            res.status(500).json({ error: 'Error fetching news' });
        });
});

app.post('/api/signup', async (req, res) => {
    const { firstName, lastName, email, password, interests } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const userDoc = { firstName, lastName, email, password: hashedPassword, interests };

    try {
        const response = await esClient.index({
            index: 'users',
            body: userDoc
        });
        res.status(201).json({ message: 'User Created', response });
    } catch (error) {
        console.error('Error indexing user: ', error);
        res.status(500).json({ message: 'Error Creating User' });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const response = await esClient.search({
            index: 'users',
            body: {
                query: {
                    match: { email }
                }
            }
        });
        if (response.hits.hits.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const hashedPassword = response.hits.hits[0]._source.password;

        const isValid = await bcrypt.compare(password, hashedPassword);

        if (isValid) {
            res.json({ message: 'Login successful' });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error logging in' });
    }
});

app.post('/api/createEvent', upload.single('image'), async (req, res) => {
    // Extract event data from the request body
    const {
        eventName,
        description,
        dateTime,
        location,
        organizer,
        sportType,
        teams,
        ticketInfo,
        capacity
    } = req.body;

    // The path to the saved image
    const imagePath = req.file ? `./src/images/${req.file.filename}` : null;
    console.log('Arpit: ', imagePath);
    // Create the event object
    const eventDoc = {
        eventName,
        description,
        dateTime,
        location,
        organizer,
        sportType,
        teams,
        ticketInfo,
        capacity,
        image: imagePath
    };

    try {
        // Index the event in Elasticsearch
        const response = await esClient.index({
            index: 'events',
            body: eventDoc
        });

        res.status(201).json({ message: 'Event created with image', eventDoc });
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ error: 'Error saving event to Elasticsearch' });
    }
});

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});