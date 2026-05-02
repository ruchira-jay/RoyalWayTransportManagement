import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateUserChildren } from '../../services/api';

export default function ManageChildrenScreen({ navigation }) {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadChildren();
  }, []);

  const loadChildren = async () => {
    const userData = await AsyncStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setChildren(user.children || [{ name: '', grade: '', age: '' }]);
    }
  };

  const addChild = () => {
    setChildren([...children, { name: '', grade: '', age: '' }]);
  };

  const removeChild = (index) => {
    if (children.length === 1) {
      Alert.alert('Error', 'You must have at least one child');
      return;
    }
    setChildren(children.filter((_, i) => i !== index));
  };

  const updateChild = (index, field, value) => {
    const updated = [...children];
    updated[index][field] = value;
    setChildren(updated);
  };

  const handleSave = async () => {
    const validChildren = children.filter(c => c.name && c.grade);
    if (validChildren.length === 0) {
      Alert.alert('Error', 'Please add at least one child with name and grade');
      return;
    }

    try {
      setLoading(true);
      const userData = await AsyncStorage.getItem('user');
      const user = JSON.parse(userData);
      
      const updatedChildren = validChildren.map(c => ({
        ...c,
        age: c.age ? parseInt(c.age) : undefined
      }));

      await updateUserChildren(user._id, updatedChildren);
      
      user.children = updatedChildren;
      await AsyncStorage.setItem('user', JSON.stringify(user));
      
      Alert.alert('Success', 'Children details updated successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to update children details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Manage Children</Text>
      </View>

      {children.map((child, index) => (
        <View key={index} style={styles.childCard}>
          <Text style={styles.childLabel}>Child {index + 1}</Text>
          <TextInput
            style={styles.input}
            placeholder="Child Name"
            value={child.name}
            onChangeText={(text) => updateChild(index, 'name', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Grade"
            value={child.grade}
            onChangeText={(text) => updateChild(index, 'grade', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Age (optional)"
            value={child.age?.toString() || ''}
            onChangeText={(text) => updateChild(index, 'age', text)}
            keyboardType="numeric"
          />
          {children.length > 1 && (
            <TouchableOpacity 
              style={styles.removeButton}
              onPress={() => removeChild(index)}
            >
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}

      <TouchableOpacity style={styles.addButton} onPress={addChild}>
        <Text style={styles.addButtonText}>+ Add Another Child</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.saveButton} 
        onPress={handleSave}
        disabled={loading}
      >
        <Text style={styles.saveButtonText}>
          {loading ? 'Saving...' : 'Save Changes'}
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
  header: {
    marginTop: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#667eea',
  },
  childCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  childLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#667eea',
  },
  input: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#e0e7ff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: '600',
  },
  removeButton: {
    backgroundColor: '#fee',
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 5,
  },
  removeText: {
    color: '#c33',
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#667eea',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 30,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
