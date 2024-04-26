import React, { useState, useEffect } from 'react';
import EventModal from './EventModal';
import './HomePage.css';

const HomePage = () => {

  const [latestNews, setLatestNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recommend, setrecommend] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const saveEvent = (eventData) => {
    console.log('Event Data to Save:', eventData);
    closeModal();
  };

  useEffect(() => {
    fetch('/api/news')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setLatestNews(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Fetching news failed:", error);
        setError('Failed to load news.');
        setLoading(false);
      });
  }, []);

  async function handleSearch(event) {
    const searchTerm = event.target.value; // Retrieve the search term from the input field
    try {
      const response = await fetch(`/api/searchevents?query=${encodeURIComponent(searchTerm)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const events = await response.json();
      // Handle the received events data, such as updating state or rendering them on the UI
      console.log('Events:', events);
    } catch (error) {
      console.error('Error searching events:', error);
      // Handle error (e.g., show error message to the user)
    }
  }

  

  // Let's assume this function will be used for fetching and displaying recommended events.
  async function getRecommendedEvents() {
    try {
      const response = await fetch('http://localhost:9000/recommend-per-sport-events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        throw new Error('Failed to update user profile');
      }
      const data = await response.json();
      console.log(data)
      setrecommend(data.response)
      
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update profile');
    }
    
  };



  return (
    <div className="homepage-container">
      <div className="welcome-banner">
        <div className="welcome-banner-content">
          <h1>Welcome to FanFave</h1>
          <p>Your personalized sports event guide</p>
          <div className="add-event-button-container">
            <button onClick={openModal} className="add-event-button">
              Add New Event
            </button>
          </div>
          <EventModal
            isVisible={isModalVisible}
            onClose={closeModal}
            onSave={saveEvent}
          />
        </div>
      </div>
      <main>
        <section className="search-bar-section">
          <input
            type="text"
            className="search-input"
            placeholder="Search for sports events, teams, venues..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch(e);
              }
            }}
          />
        </section>
        <section className="recommended-events content-area">
          <h2>Recommended for You</h2>
          {/* <button onClick={getRecommendedEvents()}>Recommend Personalized Sports Events</button> */}
          <div className="container">
            {/* Button to fetch response from ChatGPT */}
            <button onClick={getRecommendedEvents} className="fetch-button">
                Recommend Personalized Sports Events
            </button>
            {/* Rectangle area to display the response */}
            <div className="response-box">
            <p>{recommend}</p>
            </div>
        </div>
          <div className="events-list">
          </div>
        </section>
        <section className="latest-news content-area">
          <h2>Latest Sports News</h2>
          {loading && <p>Loading...</p>}
          {error && <p>Error: {error}</p>}
          {!loading && !error && (
            <ul>
              {latestNews.map((news, index) => (
                <li key={index} className="news-item">
                  <div className="news-item-container">
                    <img src={news.urlToImage} alt={news.title} className="news-image" />
                    <div className="news-text">
                      <a href={news.url} target="_blank" rel="noopener noreferrer">
                        <h3>{news.title}</h3>
                      </a>
                      <p>{news.description}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
};

export default HomePage;