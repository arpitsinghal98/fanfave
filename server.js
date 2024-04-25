const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const { Client } = require('@elastic/elasticsearch');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(cors());


const client = new Client({
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
        const response = await client.index({
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
        const response = await client.search({
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

app.post('/api/createEvent', (req, res) => {
    const event = new Event({
        eventName: req.body.eventName,
        description: req.body.description,
        dateTime: req.body.dateTime,
        location: req.body.location,
        organizer: req.body.organizer,
        sportType: req.body.sportType,
        teams: req.body.teams,
        ticketInfo: req.body.ticketInfo,
        capacity: req.body.capacity
    });

    event.save()
        .then(doc => {
            res.status(201).send(doc);
        })
        .catch(err => {
            console.error(err);
            res.status(500).send("Error saving the event.");
        });
});

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});