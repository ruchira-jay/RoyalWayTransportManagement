import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';

export default function DriverDashboardScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [studentCount, setStudentCount] = useState(0);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const userData = await AsyncStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchStudentCount(parsedUser._id);
    }
  };

  const fetchStudentCount = async (driverId) => {
    try {
      const response = await api.get(`/students/driver/${driverId}`);
      setStudentCount(response.data.length);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcome}>Welcome, {user?.name}!</Text>
        <Text style={styles.role}>Driver Dashboard</Text>
      </View>

      <View style={styles.cardsContainer}>
        <View style={styles.card}>
          <Text style={styles.cardIcon}></Text>
          <Text style={styles.cardTitle}>Students</Text>
          <Text style={styles.cardNumber}>{studentCount}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardIcon}></Text>
          <Text style={styles.cardTitle}>Present Today</Text>
          <Text style={styles.cardNumber}>23</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardIcon}></Text>
          <Text style={styles.cardTitle}>Route</Text>
          <Text style={styles.cardNumber}>Active</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardIcon}></Text>
          <Text style={styles.cardTitle}>Stops</Text>
          <Text style={styles.cardNumber}>12</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('MyStudents')}
        >
          <Text style={styles.actionText}>👥 View My Students</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>📝 Mark Attendance</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>📢 Send Notification</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>🗺️ View Route</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>🚨 Report Emergency</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    backgroundColor: '#667eea',
    padding: 20,
    paddingTop: 40,
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  role: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
    marginTop: 5,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  card: {
    width: '48%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    margin: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  cardNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#667eea',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  actionButton: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  actionText: {
    fontSize: 16,
    color: '#333',
  },
});
