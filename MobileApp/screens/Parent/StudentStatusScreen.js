import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function StudentStatusScreen() {
  const students = [
    { id: 1, name: 'John Doe', grade: '5A', status: 'On Bus', time: '7:30 AM' },
    { id: 2, name: 'Jane Doe', grade: '3B', status: 'At School', time: '8:00 AM' },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Student Status</Text>

      {students.map((student) => (
        <View key={student.id} style={styles.card}>
          <View style={styles.studentInfo}>
            <Text style={styles.studentName}>{student.name}</Text>
            <Text style={styles.grade}>Grade: {student.grade}</Text>
          </View>
          <View style={styles.statusContainer}>
            <View style={[styles.statusBadge, 
              student.status === 'On Bus' ? styles.statusOnBus : styles.statusAtSchool
            ]}>
              <Text style={styles.statusText}>{student.status}</Text>
            </View>
            <Text style={styles.time}>{student.time}</Text>
          </View>
        </View>
      ))}

      <View style={styles.timeline}>
        <Text style={styles.timelineTitle}>Today's Journey</Text>
        <View style={styles.timelineItem}>
          <View style={styles.dot} />
          <Text style={styles.timelineText}>7:15 AM - Picked up from home</Text>
        </View>
        <View style={styles.timelineItem}>
          <View style={styles.dot} />
          <Text style={styles.timelineText}>7:45 AM - Arrived at school</Text>
        </View>
        <View style={styles.timelineItem}>
          <View style={[styles.dot, styles.dotPending]} />
          <Text style={styles.timelineText}>2:30 PM - School pickup (pending)</Text>
        </View>
      </View>
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
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  grade: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 5,
  },
  statusOnBus: {
    backgroundColor: '#ffd700',
  },
  statusAtSchool: {
    backgroundColor: '#28a745',
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  time: {
    fontSize: 12,
    color: '#999',
  },
  timeline: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginTop: 10,
  },
  timelineTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#667eea',
    marginRight: 15,
  },
  dotPending: {
    backgroundColor: '#ddd',
  },
  timelineText: {
    fontSize: 14,
    color: '#666',
  },
});
