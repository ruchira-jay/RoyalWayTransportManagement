import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { getAllNotifications, markAsRead } from '../services/api';
import '../styles/Notifications.css';

// Dummy notifications for demo - moved outside component to prevent re-creation
const dummyNotifications = [
  {
    _id: 'dummy1',
    type: 'Traffic Alert',
    message: 'Heavy traffic reported on Kandy-Kurunegala road. Expected delay: 15-20 minutes.',
    route: 'Kandy Town to Kurunegala',
    createdAt: new Date(Date.now() - 30 * 60000).toISOString(), // 30 mins ago
    isRead: false,
    priority: 'high',
    
  },
  {
    _id: 'dummy2',
    type: 'Weather Update',
    message: 'Light rain expected in Puttalam area. Drivers advised to drive carefully.',
    route: 'Puttalam Town to Kurunegala',
    createdAt: new Date(Date.now() - 60 * 60000).toISOString(), // 1 hour ago
    isRead: false,
    priority: 'medium',
    
  },
  {
    _id: 'dummy3',
    type: 'Route Update',
    message: 'Road construction on Matale-Kurunegala route. Alternative route suggested via Dambulla.',
    route: 'Matale Town to Kurunegala',
    createdAt: new Date(Date.now() - 2 * 60 * 60000).toISOString(), // 2 hours ago
    isRead: true,
    priority: 'high',
    
  },
  {
    _id: 'dummy4',
    type: 'System Notification',
    message: 'New driver "Test Driver" has registered and is pending approval.',
    route: 'All Routes',
    createdAt: new Date(Date.now() - 3 * 60 * 60000).toISOString(), // 3 hours ago
    isRead: true,
    priority: 'low',
  
  },
  {
    _id: 'dummy5',
    type: 'Safety Alert',
    message: 'Speed limit enforcement increased on all routes. Please maintain safe driving speeds.',
    route: 'All Routes',
    createdAt: new Date(Date.now() - 5 * 60 * 60000).toISOString(), // 5 hours ago
    isRead: true,
    priority: 'medium',
    
  },
  {
    _id: 'dummy6',
    type: 'Maintenance',
    message: 'System maintenance scheduled for tonight 11:00 PM - 2:00 AM. Services may be temporarily unavailable.',
    route: 'System',
    createdAt: new Date(Date.now() - 6 * 60 * 60000).toISOString(), // 6 hours ago
    isRead: true,
    priority: 'low',
    
  },
  {
    _id: 'dummy7',
    type: 'Traffic Alert',
    message: 'Accident cleared on Polgahawela-Kurunegala road. Traffic flowing normally.',
    route: 'Polgahawela to Kurunegala',
    createdAt: new Date(Date.now() - 8 * 60 * 60000).toISOString(), // 8 hours ago
    isRead: true,
    priority: 'low',
  
  },
  {
    _id: 'dummy8',
    type: 'Holiday Notice',
    message: 'School holiday on May 15th. No transportation services required.',
    route: 'All Routes',
    createdAt: new Date(Date.now() - 24 * 60 * 60000).toISOString(), // 1 day ago
    isRead: true,
    priority: 'low',
  
  }
];

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllNotifications();
      // Combine real notifications with dummy notifications
      const combined = [...dummyNotifications, ...response.data];
      setNotifications(combined);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // If API fails, just show dummy notifications
      setNotifications(dummyNotifications);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAsRead = async (id) => {
    // Handle dummy notifications
    if (id.startsWith('dummy')) {
      setNotifications(notifications.map(n => 
        n._id === id ? { ...n, isRead: true } : n
      ));
      return;
    }

    // Handle real notifications
    try {
      await markAsRead(id);
      fetchNotifications();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const formatDate = (date) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffMs = now - notifDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return notifDate.toLocaleDateString();
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="app">
      <Sidebar />
      <div className="main-content">
        <Header title="Notifications" />
        <div className="content">
          <div className="notifications-container">
            <div className="notifications-header">
              <h2>All Notifications</h2>
              {unreadCount > 0 && (
                <span className="unread-badge">{unreadCount} unread</span>
              )}
            </div>

            {loading ? (
              <p className="loading-text">Loading notifications...</p>
            ) : notifications.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">🔔</span>
                <p>No notifications yet</p>
              </div>
            ) : (
              <div className="notifications-list">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`notification-card ${
                      !notification.isRead ? 'unread' : 'read'
                    } priority-${notification.priority || 'low'}`}
                  >
                    <div className="notification-icon">
                      {notification.icon || '📢'}
                    </div>
                    <div className="notification-content">
                      <div className="notification-header-row">
                        <span className={`notification-type type-${notification.type?.toLowerCase().replace(' ', '-')}`}>
                          {notification.type}
                        </span>
                        {!notification.isRead && (
                          <span className="unread-dot"></span>
                        )}
                      </div>
                      <div className="notification-message">
                        {notification.message}
                      </div>
                      <div className="notification-footer">
                        <span className="notification-route">
                          📍 {notification.route}
                        </span>
                        <span className="notification-time">
                          {formatDate(notification.createdAt)}
                        </span>
                      </div>
                    </div>
                    {!notification.isRead && (
                      <button
                        className="mark-read-btn"
                        onClick={() => handleMarkAsRead(notification._id)}
                        title="Mark as read"
                      >
                        ✓
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notifications;
