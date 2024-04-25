import React, { useState, useEffect } from 'react';
import EventModal from './EventModal';
import './HomePage.css';

const HomePage = () => {

  const [latestNews, setLatestNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

      fetch('/api/upcoming-events')
        .then((response) => {
          if(!respsone)
        })
  }, []);

  const handleSearch = (event) => {
    // Implementation for search functionality
    console.log(event.target.value);
  };

  // Let's assume this function will be used for fetching and displaying recommended events.
  const getRecommendedEvents = () => {
    // Logic to fetch recommended events
    // This could be replaced with actual API call logic.
    return [
      { id: 1, name: 'Basketball Championship', date: '2024-06-10' },
      { id: 2, name: 'Local Baseball Derby', date: '2024-06-15' },
      // More events...
    ];
  };

  const recommendedEvents = getRecommendedEvents();


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
            className="search-input" // Added class for styling the input
            placeholder="Search for sports events, teams, venues..."
            onChange={handleSearch}
          />
        </section>
        <section className="recommended-events content-area">
          <h2>Recommended for You</h2>
          <div className="events-list">
            {recommendedEvents.map(event => (
              <div key={event.id} className="event-card">
                <h3>{event.name}</h3>
                <p>Date: {event.date}</p>
                {/* Add more event details and actions here */}
              </div>
            ))}
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