import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { getAllNotifications } from '../../services/api';

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await getAllNotifications();
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'delayed': return '⏰';
      case 'arrived': return '✅';
      case 'emergency': return '🚨';
      case 'route_change': return '🔄';
      default: return '📢';
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.title}>Notifications</Text>

      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No notifications yet</Text>
        </View>
      ) : (
        notifications.map((notification) => (
          <View key={notification._id} style={styles.card}>
            <Text style={styles.icon}>{getNotificationIcon(notification.type)}</Text>
            <View style={styles.content}>
              <Text style={styles.type}>{notification.type.toUpperCase()}</Text>
              <Text style={styles.message}>{notification.message}</Text>
              <Text style={styles.route}>Route: {notification.route}</Text>
              <Text style={styles.time}>
                {new Date(notification.createdAt).toLocaleString()}
              </Text>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  card: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    flexDirection: 'row',
    borderLeftWidth: 4,
    borderLeftColor: '#667eea',
  },
  icon: {
    fontSize: 30,
    marginRight: 15,
  },
  content: {
    flex: 1,
  },
  type: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 5,
  },
  message: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  route: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  time: {
    fontSize: 12,
    color: '#999',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});
