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

  const checkRole = localStorage.getItem('role') === 'Admin';

  console.log(checkRole);

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

  const handleManageEvents = () => {
    // Logic to open event management view
    console.log('Managing events...');
    // For example, you might navigate to an event management page:
    // history.push('/manage-events');
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
          {checkRole && (
            <div className="event-buttons-container">
              <button onClick={openModal} className="event-button">
                Add New Event
              </button>
              <button onClick={handleManageEvents} className="event-button">
                Manage Event
              </button>
            </div>
          )}
          <EventModal
            isVisible={isModalVisible}
            onClose={closeModal}
            onSave={saveEvent}
          />
        </div>
      </div>
      <main>
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