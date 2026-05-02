import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sendNotification } from '../../services/api';

export default function SendNotificationScreen() {
  const [selectedType, setSelectedType] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const notificationTypes = [
    { type: 'delayed', label: 'Delayed',  color: '#ffc107' },
    { type: 'arrived', label: 'Arrived', color: '#28a745' },
    { type: 'emergency', label: 'Emergency',  color: '#dc3545' },
    { type: 'route_change', label: 'Route Change',  color: '#17a2b8' },
  ];

  const handleSend = async () => {
    if (!selectedType || !message) {
      Alert.alert('Error', 'Please select type and enter message');
      return;
    }

    try {
      setLoading(true);
      const userData = await AsyncStorage.getItem('user');
      const user = JSON.parse(userData);

      // You'll need to get the actual driver ID from your driver registration
      await sendNotification({
        driverId: '69f31ff85eacf1f264b50eda', // Replace with actual driver ID
        type: selectedType,
        message: message,
        route: 'Colombo-Kandy', // Replace with actual route
      });

      Alert.alert('Success', 'Notification sent successfully!');
      setSelectedType('');
      setMessage('');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to send notification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Send Notification</Text>

      <Text style={styles.label}>Select Type:</Text>
      <View style={styles.typesContainer}>
        {notificationTypes.map((item) => (
          <TouchableOpacity
            key={item.type}
            style={[
              styles.typeButton,
              selectedType === item.type && { backgroundColor: item.color },
            ]}
            onPress={() => setSelectedType(item.type)}
          >
            <Text style={styles.typeIcon}>{item.icon}</Text>
            <Text
              style={[
                styles.typeLabel,
                selectedType === item.type && styles.typeLabelActive,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Message:</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Enter your message..."
        value={message}
        onChangeText={setMessage}
        multiline={true}
        numberOfLines={6}
        textAlignVertical="top"
      />

      <TouchableOpacity
        style={styles.sendButton}
        onPress={handleSend}
        disabled={loading}
      >
        <Text style={styles.sendButtonText}>
          {loading ? 'Sending...' : 'Send Notification'}
        </Text>
      </TouchableOpacity>
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
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  typesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  typeButton: {
    width: '48%',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    margin: '1%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
  },
  typeIcon: {
    fontSize: 30,
    marginBottom: 5,
  },
  typeLabel: {
    fontSize: 14,
    color: '#666',
  },
  typeLabelActive: {
    color: 'white',
    fontWeight: 'bold',
  },
  textArea: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 16,
    height: 150,
  },
  sendButton: {
    backgroundColor: '#667eea',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  sendButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
