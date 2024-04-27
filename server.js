const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const cors = require('cors');
const { getJson } = require("serpapi");
const { v4: uuidv4 } = require('uuid');
const { Client } = require('@elastic/elasticsearch');
const path = require('path');
const jwt = require('jsonwebtoken');
const OpenAI = require("openai");
const { isDataView } = require('util/types');
require('dotenv').config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });  

const app = express();
app.use(bodyParser.json());
app.use(cors());



const esClient = new Client({
    node: 'http://localhost:9200'
});

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

//--- OPENAI CODE
async function getLocation() {
    const response = await fetch("https://ipapi.co/json/");
    const locationData = await response.json();
    return locationData;
  }

  async function getUserSearchHistory(email){
    const indexName = 'search_history';

  try {
    // Fetch the document for the specified userID
    const response = await esClient.get({
      index: indexName,
      id: email,
    });

    if (response.found) {
      // If the document is found, return the search history (queries)
      const searchHistory = response._source.queries;
      return searchHistory;
    } else {
      // If the document is not found, return an empty array
      console.log(`No search history found for userID: ${userID}`);
      return [];
    }
  } catch (error) {
    console.error(`Error fetching search history for userID: ${userID}`, error);
    return [];
  }
  }

  async function getSportEvents(city) {

    try {
        const body = await esClient
        .search({
          index: "events",
          body: {
            query: {
              bool: {
                must: [
                  // Match the topic
                  { query_string: { query: city } }, // Match the search query in all fields
                ],
              },
            },
          },
        })
   
       const res = body.hits.hits
       const sources = [];
        for (const item of res) {
            const sourceData = item._source;
            sources.push(sourceData);
        }
       return res;
   
     } catch (error) {
       console.error('Error retrieving posts:', error);
       return 'Internal Server Error';
     }
  }

  const tools = [
    {
      type: "function",
      function: {
        name: "getLocation",
        description: "Get the user's location based on their IP address",
        parameters: {
          type: "object",
          properties: {
            
          },
        },
      }
    },
    {
      type: "function",
      function: {
        name: "getSportEvents",
        description: "Get sports events",
        parameters: {
          type: "object",
          properties: {city: {
            type: "string",
          },
        },
        required: ["city"],
        },
      }
    },
    {
      type: "function",
      function: {
        name: "getUserSearchHistory",
        description: "Get user search history",
        parameters: {
          type: "object",
          properties: {email: {
            type: "string",
          },
        },
        required: ["email"],
        },
      }
    },
  ];
  
  const availableTools = {
    getSportEvents,
    getLocation,
    getUserSearchHistory
  };
  
  const messages = [
    {
      role: "system",
      content: `You are a helpful assistant. Only use the functions you have been provided with.`,
    },
  ];
  
  async function agent(userInput) {
    messages.push({
      role: "user",
      content: userInput,
    });
  
    for (let i = 0; i < 5; i++) {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-16k",
        messages: messages,
        tools: tools,
      });
  
      const { finish_reason, message } = response.choices[0];
  
      if (finish_reason === "tool_calls" && message.tool_calls) {
        const functionName = message.tool_calls[0].function.name;
        console.log("function name: ", functionName)
        const functionToCall = availableTools[functionName];
        const functionArgs = JSON.parse(message.tool_calls[0].function.arguments);
        const functionArgsArr = Object.values(functionArgs);
        const functionResponse = await functionToCall.apply(
          null,
          functionArgsArr
        );
  
        messages.push({
          role: "function",
          name: functionName,
          content: `
                  The result of the last function was this: ${JSON.stringify(
                    functionResponse
                  )}
                  `,
        });
      } else if (finish_reason === "stop") {
        messages.push(message);
        return message.content;
      }
    }
    return "The maximum number of iterations has been met without a suitable answer. Please try again with a more specific input.";
  }

  app.post('/recommend-per-sport-events', async (req, res) => {
    console.log("e",req.body.interest)
    const response = await agent(
      `Please suggest some sports events from the list of events given by the getSportEvents function provided to you. Suggest sports event based on my location, user interest and user search history using the functions given. user interests are ${req.body.interest}. user email to fetch getUserSearchHistory is ${req.body.email}. In your result just specify event title, date, description and location`
    );
  
    res.status(200).json({ response });
  });

  app.post('/recommend-per-sport-events2', async (req, res) => {
    const response = await getSportEvents('chicago')
  
    res.status(200).json({ response });
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
            res.json({ message: 'Login successful', interests: response.hits.hits[0]._source.interests,email: response.hits.hits[0]._source.email  });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error logging in' });
    }
});

app.post('/api/createEvent', upload.single('image'), async (req, res) => {
    
    const {
        eventName,
        description,
        date,
        time,
        location,
        organizer,
        sportType,
        teams,
        ticketInfo,
        capacity
    } = req.body;

    const imagePath = req.file ? `./src/images/${req.file.filename}` : null;

    const eventDoc = {
        eventName,
        description,
        date,
        time,
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

app.post('/api/searchevents', async (req, res) => {

    const { query, email } = req.body;
    try {
        const response = await esClient.search({
            index: 'events',
            body: {
                query: {
                    bool: {
                        must: [
                            {
                                multi_match: {
                                    query: query,
                                    fields: ["*"]
                                }
                            },
                            {
                                range: {
                                    date: {
                                        gte: "now"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        });

        const indexName = 'search_history';

      try {
        // Check if the document for the user exists in the index
        await esClient.update({
          index: indexName,
          id: email,
          body: {
            script: {
              source: 'if (ctx._source.queries == null) { ctx._source.queries = new ArrayList(); } ctx._source.queries.add(params.query)',
              lang: 'painless',
              params: {
                query: query,
              },
            },
            // Use upsert to create a new document if one does not already exist
            upsert: {
              userID: email,
              queries: [query],
            },
          },
        });
      } catch (error) {
        console.error('Error storing search history:', error);
      }

        const events = response.hits.hits.map(hit => hit._source);
        console.log(response);
        res.json(events);
    } catch (error) {
        console.error('Error searching events:', error);
        res.status(500).json({ error: 'Failed to search events' });
    }
});


app.get('/api/upcoming-events', async (req, res) => {
    try {
        const today = new Date().toISOString();
        const todayUtc = today.slice(0, 10);


        const response = await esClient.search({
            index: 'events',
            body: {
                query: {
                    range: {
                        date: {
                            gte: todayUtc
                        }
                    }
                }
            }
        });

        console.log('Elasticsearch Response:', response);

        // Send the response back to the client
        res.json(response);
    } catch (error) {
        console.error('Error fetching upcoming events:', error);
        res.status(500).json({ error: 'An error occurred while fetching upcoming events' });
    }
});


const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});