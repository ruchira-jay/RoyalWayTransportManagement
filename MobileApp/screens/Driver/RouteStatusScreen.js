import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function RouteStatusScreen() {
  const [routeStatus, setRouteStatus] = useState('active');

  const stops = [
    { id: 1, name: 'Main Gate', time: '7:00 AM', status: 'completed' },
    { id: 2, name: 'Park Avenue', time: '7:15 AM', status: 'completed' },
    { id: 3, name: 'City Center', time: '7:30 AM', status: 'current' },
    { id: 4, name: 'School Road', time: '7:45 AM', status: 'pending' },
    { id: 5, name: 'School', time: '8:00 AM', status: 'pending' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Route Status</Text>
        <View style={[styles.statusBadge, 
          routeStatus === 'active' ? styles.statusActive : styles.statusInactive
        ]}>
          <Text style={styles.statusText}>
            {routeStatus === 'active' ? 'Active' : 'Inactive'}
          </Text>
        </View>
      </View>

      <View style={styles.routeInfo}>
        <Text style={styles.routeName}>Colombo - Kandy Route</Text>
        <Text style={styles.routeDetails}>Total Stops: 5 | Distance: 25 km</Text>
      </View>

      <View style={styles.stopsContainer}>
        <Text style={styles.sectionTitle}>Stops</Text>
        {stops.map((stop, index) => (
          <View key={stop.id} style={styles.stopItem}>
            <View style={styles.timeline}>
              <View style={[
                styles.dot,
                stop.status === 'completed' && styles.dotCompleted,
                stop.status === 'current' && styles.dotCurrent,
              ]} />
              {index < stops.length - 1 && (
                <View style={[
                  styles.line,
                  stop.status === 'completed' && styles.lineCompleted,
                ]} />
              )}
            </View>
            <View style={styles.stopContent}>
              <Text style={styles.stopName}>{stop.name}</Text>
              <Text style={styles.stopTime}>{stop.time}</Text>
              {stop.status === 'current' && (
                <Text style={styles.currentLabel}>Current Location</Text>
              )}
            </View>
          </View>
        ))}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Start Route</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.actionButtonSecondary]}>
          <Text style={styles.actionButtonTextSecondary}>End Route</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  statusBadge: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusActive: {
    backgroundColor: '#28a745',
  },
  statusInactive: {
    backgroundColor: '#dc3545',
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  routeInfo: {
    backgroundColor: 'white',
    padding: 20,
    margin: 15,
    borderRadius: 10,
  },
  routeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  routeDetails: {
    fontSize: 14,
    color: '#666',
  },
  stopsContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 15,
    marginTop: 0,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  stopItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  timeline: {
    alignItems: 'center',
    marginRight: 15,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#ddd',
  },
  dotCompleted: {
    backgroundColor: '#28a745',
  },
  dotCurrent: {
    backgroundColor: '#667eea',
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  line: {
    width: 2,
    height: 40,
    backgroundColor: '#ddd',
  },
  lineCompleted: {
    backgroundColor: '#28a745',
  },
  stopContent: {
    flex: 1,
  },
  stopName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  stopTime: {
    fontSize: 14,
    color: '#666',
    marginTop: 3,
  },
  currentLabel: {
    fontSize: 12,
    color: '#667eea',
    fontWeight: 'bold',
    marginTop: 5,
  },
  actions: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#667eea',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  actionButtonSecondary: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#667eea',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionButtonTextSecondary: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
