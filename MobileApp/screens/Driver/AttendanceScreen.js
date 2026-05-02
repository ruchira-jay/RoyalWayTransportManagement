import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function AttendanceScreen() {
  const [students, setStudents] = useState([
    { id: 1, name: 'John Doe', grade: '5A', present: false },
    { id: 2, name: 'Jane Smith', grade: '4B', present: false },
    { id: 3, name: 'Mike Johnson', grade: '6A', present: false },
    { id: 4, name: 'Sarah Williams', grade: '5B', present: false },
    { id: 5, name: 'Tom Brown', grade: '3A', present: false },
  ]);

  const toggleAttendance = (id) => {
    setStudents(students.map(student => 
      student.id === id ? { ...student, present: !student.present } : student
    ));
  };

  const presentCount = students.filter(s => s.present).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mark Attendance</Text>
        <Text style={styles.count}>
          Present: {presentCount} / {students.length}
        </Text>
      </View>

      <ScrollView style={styles.list}>
        {students.map((student) => (
          <TouchableOpacity
            key={student.id}
            style={[styles.studentCard, student.present && styles.studentCardPresent]}
            onPress={() => toggleAttendance(student.id)}
          >
            <View style={styles.studentInfo}>
              <Text style={styles.studentName}>{student.name}</Text>
              <Text style={styles.studentGrade}>Grade: {student.grade}</Text>
            </View>
            <View style={[styles.checkbox, student.present && styles.checkboxChecked]}>
              {student.present && <Text style={styles.checkmark}>✓</Text>}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Submit Attendance</Text>
      </TouchableOpacity>
    </View>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  count: {
    fontSize: 16,
    color: 'white',
    marginTop: 5,
  },
  list: {
    flex: 1,
    padding: 15,
  },
  studentCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  studentCardPresent: {
    backgroundColor: '#d4edda',
    borderLeftWidth: 4,
    borderLeftColor: '#28a745',
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  studentGrade: {
    fontSize: 14,
    color: '#666',
    marginTop: 3,
  },
  checkbox: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#28a745',
    borderColor: '#28a745',
  },
  checkmark: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#667eea',
    padding: 15,
    margin: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
