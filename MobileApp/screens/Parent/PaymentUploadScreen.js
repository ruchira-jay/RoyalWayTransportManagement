import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export default function PaymentUploadScreen() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleUpload = () => {
    Alert.alert('Info', 'Payment upload feature coming soon!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Payment</Text>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Monthly Fee</Text>
        <Text style={styles.amount}>Rs. 5,000</Text>
        <Text style={styles.dueDate}>Due Date: 5th of every month</Text>
      </View>

      <View style={styles.uploadSection}>
        <Text style={styles.label}>Upload Payment Receipt</Text>
        <TouchableOpacity style={styles.uploadButton}>
          <Text style={styles.uploadIcon}>📎</Text>
          <Text style={styles.uploadText}>Choose File</Text>
        </TouchableOpacity>
        {selectedFile && (
          <Text style={styles.fileName}>{selectedFile}</Text>
        )}
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleUpload}>
        <Text style={styles.submitButtonText}>Submit Payment</Text>
      </TouchableOpacity>

      <View style={styles.historySection}>
        <Text style={styles.historyTitle}>Payment History</Text>
        <View style={styles.historyItem}>
          <View>
            <Text style={styles.historyMonth}>January 2026</Text>
            <Text style={styles.historyDate}>Paid on: 03 Jan 2026</Text>
          </View>
          <View style={styles.paidBadge}>
            <Text style={styles.paidText}>Paid</Text>
          </View>
        </View>
        <View style={styles.historyItem}>
          <View>
            <Text style={styles.historyMonth}>December 2025</Text>
            <Text style={styles.historyDate}>Paid on: 02 Dec 2025</Text>
          </View>
          <View style={styles.paidBadge}>
            <Text style={styles.paidText}>Paid</Text>
          </View>
        </View>
      </View>
    </View>
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
  infoCard: {
    backgroundColor: '#667eea',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  amount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginVertical: 10,
  },
  dueDate: {
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
  },
  uploadSection: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  uploadButton: {
    borderWidth: 2,
    borderColor: '#667eea',
    borderStyle: 'dashed',
    borderRadius: 10,
    padding: 30,
    alignItems: 'center',
  },
  uploadIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  uploadText: {
    fontSize: 16,
    color: '#667eea',
    fontWeight: '600',
  },
  fileName: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  submitButton: {
    backgroundColor: '#667eea',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  historySection: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  historyMonth: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  historyDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 3,
  },
  paidBadge: {
    backgroundColor: '#d4edda',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
  },
  paidText: {
    color: '#155724',
    fontWeight: 'bold',
    fontSize: 12,
  },
});
