import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import EventModal from './EventModal';
import ManageViewEvents from './ManageViewEvents';
import './HomePage.css';

const HomePage = () => {

  const [latestNews, setLatestNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recommend, setrecommend] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isManageEventsModalVisible, setManageEventsModalVisible] = useState(false);
  const [events, setEvents] = useState([]);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const openManageEventsModal = () => {
    setManageEventsModalVisible(true);
  };

  const closeManageEventsModal = () => {
    setManageEventsModalVisible(false);
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
    const searchTerm = event.target.value;

    if (searchTerm != "") {
      const email = localStorage.getItem('email');
      console.log("dasda -e: ", email)
      try {
        const response = await fetch('/api/searchevents', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({ query: searchTerm, email: email })

        });

        if (!response.ok) {
          throw new Error('Failed to search events');
        }
        const events = await response.json();
        // Handle the received events data, such as updating state or rendering them on the UI
        console.log('Events:', events);
        setEvents(events)

      } catch (error) {
        console.error('Error Failed to search events', error);
        alert('Failed to search events');
      }
    } else {
      console.log('No Search Keyword Found');
    }
  }

  // Let's assume this function will be used for fetching and displaying recommended events.
  async function getRecommendedEvents() {
    const interests = localStorage.getItem('interests');
    const email = localStorage.getItem('email');
    try {
      const response = await fetch('/recommend-per-sport-events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ interest: interests, email: email })

      });

      if (!response.ok) {
        throw new Error('Failed to recommend events');
      }
      const data = await response.json();
      console.log(data)
      setrecommend(data)

    } catch (error) {
      console.error('Error Failed to recommend events', error);
      alert('Failed to recommend events');
    }
  };

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
              <button onClick={openManageEventsModal} className="event-button">
                Manage Events
              </button>
            </div>
          )}

          {!checkRole && (
            <button onClick={openManageEventsModal} className="event-button">
              View Events
            </button>
          )}
          <EventModal
            isVisible={isModalVisible}
            onClose={closeModal}
            onSave={saveEvent}
          />
          <ManageViewEvents
            show={isManageEventsModalVisible}
            onClose={closeManageEventsModal}
          />
        </div>
      </div>
      <main>
        <section className="recommended-events content-area">
          <Link onClick={getRecommendedEvents}><h2>Recommendations for You</h2></Link>
          <div className="container">
            <div className="response-box">
              <div className="events-list">
                {/* Render the list of events */}
                {recommend.map((event, index) => (
                  <div key={index} className="event-card">
                    <img src={event.image} alt={event.eventName} className="event-image" />
                    <div className="event-info">
                      <h3>{event.eventName}</h3>
                      <p>{event.description}</p>
                      <p>Date: {event.date}</p>
                      <p>Time: {event.time}</p>
                      <p>Location: {event.location}</p>
                      <p>Organizer: {event.organizer}</p>
                      <p>Sport Type: {event.sportType}</p>
                      <p>Teams: {event.teams}</p>
                      <p>Ticket Info: {event.ticketInfo}</p>
                      <p>Capacity: {event.capacity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="events-list">
            {/* Render the list of events */}
            {events.map((event, index) => (
              <div key={index} className="event-card">
                <img src={event.image} alt={event.eventName} className="event-image" />
                <div className="event-info">
                  <h3>{event.eventName}</h3>
                  <p>{event.description}</p>
                  <p>Date: {event.date}</p>
                  <p>Time: {event.time}</p>
                  <p>Location: {event.location}</p>
                  <p>Organizer: {event.organizer}</p>
                  <p>Sport Type: {event.sportType}</p>
                  <p>Teams: {event.teams}</p>
                  <p>Ticket Info: {event.ticketInfo}</p>
                  <p>Capacity: {event.capacity}</p>
                </div>
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
