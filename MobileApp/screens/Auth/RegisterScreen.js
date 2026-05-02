import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { register } from '../../services/api';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('parent');
  const [loading, setLoading] = useState(false);
  const [children, setChildren] = useState([{ name: '', grade: '', age: '' }]);

  const addChild = () => {
    setChildren([...children, { name: '', grade: '', age: '' }]);
  };

  const removeChild = (index) => {
    setChildren(children.filter((_, i) => i !== index));
  };

  const updateChild = (index, field, value) => {
    const updated = [...children];
    updated[index][field] = value;
    setChildren(updated);
  };

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    if (role === 'parent') {
      const validChildren = children.filter(c => c.name && c.grade);
      if (validChildren.length === 0) {
        Alert.alert('Error', 'Please add at least one child');
        return;
      }
    }

    try {
      setLoading(true);
      const data = { name, email, password, role };
      if (role === 'parent') {
        data.children = children.filter(c => c.name && c.grade).map(c => ({
          ...c,
          age: c.age ? parseInt(c.age) : undefined
        }));
      }
      await register(data);
      Alert.alert('Success', 'Registration successful! Please login.');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />

      <Text style={styles.label}>Select Role:</Text>
      <View style={styles.roleContainer}>
        <TouchableOpacity
          style={[styles.roleButton, role === 'parent' && styles.roleButtonActive]}
          onPress={() => setRole('parent')}
        >
          <Text style={[styles.roleText, role === 'parent' && styles.roleTextActive]}>
            Parent
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.roleButton, role === 'driver' && styles.roleButtonActive]}
          onPress={() => setRole('driver')}
        >
          <Text style={[styles.roleText, role === 'driver' && styles.roleTextActive]}>
            Driver
          </Text>
        </TouchableOpacity>
      </View>

      {role === 'parent' && (
        <View style={styles.childrenSection}>
          <Text style={styles.sectionTitle}>Children Details</Text>
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
                value={child.age}
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
        </View>
      )}

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Registering...' : 'Register'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f7fa',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#667eea',
    marginBottom: 30,
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  roleButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ddd',
    marginHorizontal: 5,
    alignItems: 'center',
  },
  roleButtonActive: {
    borderColor: '#667eea',
    backgroundColor: '#667eea',
  },
  roleText: {
    fontSize: 16,
    color: '#666',
  },
  roleTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#667eea',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    color: '#667eea',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  childrenSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  childCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  childLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#667eea',
  },
  addButton: {
    backgroundColor: '#e0e7ff',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
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
});
