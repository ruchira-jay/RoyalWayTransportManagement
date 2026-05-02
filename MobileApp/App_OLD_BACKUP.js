import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login } from './services/api';

export default function App() {
  const [currentScreen, setCurrentScreen] = React.useState('Login');
  const [user, setUser] = React.useState(null);
  const [driverStatus, setDriverStatus] = React.useState(null);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [selectedRole, setSelectedRole] = React.useState('parent');
  const [loading, setLoading] = React.useState(false);
  
  // Driver registration fields
  const [nic, setNic] = React.useState('');
  const [age, setAge] = React.useState('');
  const [licenseNumber, setLicenseNumber] = React.useState('');
  const [experience, setExperience] = React.useState('');
  const [vehicleNumber, setVehicleNumber] = React.useState('');
  const [route, setRoute] = React.useState('');
  
  // Children fields for parent registration
  const [children, setChildren] = React.useState([{ name: '', grade: '', age: '' }]);

  const addChild = () => {
    setChildren([...children, { name: '', grade: '', age: '' }]);
  };

  const removeChild = (index) => {
    if (children.length > 1) {
      setChildren(children.filter((_, i) => i !== index));
    }
  };

  const updateChild = (index, field, value) => {
    const updated = [...children];
    updated[index][field] = value;
    setChildren(updated);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      setLoading(true);
      const response = await login({ email, password });
      
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data));
      
      setUser(response.data);
      
      if (response.data.role === 'driver') {
        // Check driver approval status
        await checkDriverStatus(response.data._id);
      } else {
        setCurrentScreen('ParentDashboard');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Login failed';
      Alert.alert('Login Error', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const checkDriverStatus = async (userId) => {
    try {
      const { default: api } = require('./services/api');
      const response = await api.get(`/drivers/user/${userId}`);
      setDriverStatus(response.data.status);
      setCurrentScreen('DriverDashboard');
    } catch (error) {
      // If driver profile doesn't exist, show registration form
      if (error.response?.status === 404) {
        setCurrentScreen('DriverRegistration');
      } else {
        console.error('Error checking driver status:', error);
        Alert.alert('Error', 'Could not verify driver status');
      }
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    setUser(null);
    setCurrentScreen('Login');
    setEmail('');
    setPassword('');
    setName('');
    setSelectedRole('parent');
  };

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    if (selectedRole === 'parent') {
      const validChildren = children.filter(c => c.name && c.grade);
      if (validChildren.length === 0) {
        Alert.alert('Error', 'Please add at least one child with name and grade');
        return;
      }
    }

    try {
      setLoading(true);
      const { register } = require('./services/api');
      const data = { name, email, password, role: selectedRole };
      
      if (selectedRole === 'parent') {
        data.children = children.filter(c => c.name && c.grade).map(c => ({
          ...c,
          age: c.age ? parseInt(c.age) : undefined
        }));
      }
      
      await register(data);
      Alert.alert('Success', 'Registration successful! Please login.');
      setCurrentScreen('Login');
      setName('');
      setEmail('');
      setPassword('');
      setSelectedRole('parent');
      setChildren([{ name: '', grade: '', age: '' }]);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Registration failed';
      Alert.alert('Registration Error', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDriverRegistration = async () => {
    if (!nic || !age || !licenseNumber || !experience || !vehicleNumber || !route) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      setLoading(true);
      const { registerDriver } = require('./services/api');
      await registerDriver({
        userId: user._id,
        nic,
        age: parseInt(age),
        licenseNumber,
        experience: parseInt(experience),
        vehicleNumber,
        route
      });
      Alert.alert('Success', 'Driver registration submitted! Waiting for admin approval.');
      setDriverStatus('pending');
      setCurrentScreen('DriverDashboard');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Registration failed';
      Alert.alert('Error', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Login Screen
  if (currentScreen === 'Login') {
    return (
      <View style={styles.loginContainer}>
        <StatusBar barStyle="light-content" />
        <View style={styles.loginHeader}>
          <Text style={styles.loginLogo}>🚌</Text>
          <Text style={styles.loginTitle}>RoyalWay</Text>
          <Text style={styles.loginSubtitle}>School Transportation System</Text>
        </View>

        <View style={styles.loginForm}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputIcon}>📧</Text>
            <TextInput
              style={styles.modernInput}
              placeholder="Email Address"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputIcon}>🔒</Text>
            <TextInput
              style={styles.modernInput}
              placeholder="Password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
            />
          </View>

          <TouchableOpacity 
            style={styles.modernButton}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.modernButtonText}>
              {loading ? 'Signing In...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.registerLink}
            onPress={() => setCurrentScreen('Register')}
          >
            <Text style={styles.registerLinkText}>Don't have an account? Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Register Screen
  if (currentScreen === 'Register') {
    return (
      <View style={styles.loginContainer}>
        <StatusBar barStyle="light-content" />
        <View style={styles.loginHeader}>
          <Text style={styles.loginLogo}>📝</Text>
          <Text style={styles.loginTitle}>Create Account</Text>
          <Text style={styles.loginSubtitle}>Join RoyalWay Transportation</Text>
        </View>

        <ScrollView style={styles.loginForm} showsVerticalScrollIndicator={false}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputIcon}>👤</Text>
            <TextInput
              style={styles.modernInput}
              placeholder="Full Name"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputIcon}>📧</Text>
            <TextInput
              style={styles.modernInput}
              placeholder="Email Address"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputIcon}>🔒</Text>
            <TextInput
              style={styles.modernInput}
              placeholder="Password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
            />
          </View>

          <Text style={styles.roleLabel}>Select Your Role:</Text>
          <View style={styles.roleContainer}>
            <TouchableOpacity
              style={[
                styles.roleButton,
                selectedRole === 'parent' && styles.roleButtonActive
              ]}
              onPress={() => setSelectedRole('parent')}
            >
              <Text style={styles.roleEmoji}>👨👩👧</Text>
              <Text style={[
                styles.roleText,
                selectedRole === 'parent' && styles.roleTextActive
              ]}>Parent</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roleButton,
                selectedRole === 'driver' && styles.roleButtonActive
              ]}
              onPress={() => setSelectedRole('driver')}
            >
              <Text style={styles.roleEmoji}>🚌</Text>
              <Text style={[
                styles.roleText,
                selectedRole === 'driver' && styles.roleTextActive
              ]}>Driver</Text>
            </TouchableOpacity>
          </View>

          {selectedRole === 'parent' && (
            <View style={styles.childrenSection}>
              <Text style={styles.childrenTitle}>👶 Children Details</Text>
              {children.map((child, index) => (
                <View key={index} style={styles.childCard}>
                  <Text style={styles.childNumber}>Child {index + 1}</Text>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputIcon}>👤</Text>
                    <TextInput
                      style={styles.modernInput}
                      placeholder="Child Name"
                      placeholderTextColor="#999"
                      value={child.name}
                      onChangeText={(text) => updateChild(index, 'name', text)}
                    />
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputIcon}>📚</Text>
                    <TextInput
                      style={styles.modernInput}
                      placeholder="Grade"
                      placeholderTextColor="#999"
                      value={child.grade}
                      onChangeText={(text) => updateChild(index, 'grade', text)}
                    />
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputIcon}>🎂</Text>
                    <TextInput
                      style={styles.modernInput}
                      placeholder="Age (optional)"
                      placeholderTextColor="#999"
                      value={child.age}
                      onChangeText={(text) => updateChild(index, 'age', text)}
                      keyboardType="numeric"
                    />
                  </View>
                  {children.length > 1 && (
                    <TouchableOpacity 
                      style={styles.removeChildButton}
                      onPress={() => removeChild(index)}
                    >
                      <Text style={styles.removeChildText}>❌ Remove Child</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
              <TouchableOpacity style={styles.addChildButton} onPress={addChild}>
                <Text style={styles.addChildText}>➕ Add Another Child</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity 
            style={styles.modernButton}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.modernButtonText}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.registerLink}
            onPress={() => setCurrentScreen('Login')}
          >
            <Text style={styles.registerLinkText}>Already have an account? Login</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }


  // Driver Registration Form
  if (currentScreen === 'DriverRegistration') {
    return (
      <View style={styles.loginContainer}>
        <StatusBar barStyle="light-content" />
        <View style={styles.loginHeader}>
          <Text style={styles.loginLogo}>🚌</Text>
          <Text style={styles.loginTitle}>Driver Registration</Text>
          <Text style={styles.loginSubtitle}>Complete your driver profile</Text>
        </View>

        <ScrollView style={styles.loginForm} showsVerticalScrollIndicator={false}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputIcon}>🆔</Text>
            <TextInput
              style={styles.modernInput}
              placeholder="NIC Number"
              placeholderTextColor="#999"
              value={nic}
              onChangeText={setNic}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputIcon}>🎂</Text>
            <TextInput
              style={styles.modernInput}
              placeholder="Age"
              placeholderTextColor="#999"
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputIcon}>💳</Text>
            <TextInput
              style={styles.modernInput}
              placeholder="License Number"
              placeholderTextColor="#999"
              value={licenseNumber}
              onChangeText={setLicenseNumber}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputIcon}>⭐</Text>
            <TextInput
              style={styles.modernInput}
              placeholder="Years of Experience"
              placeholderTextColor="#999"
              value={experience}
              onChangeText={setExperience}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputIcon}>🚗</Text>
            <TextInput
              style={styles.modernInput}
              placeholder="Vehicle Number"
              placeholderTextColor="#999"
              value={vehicleNumber}
              onChangeText={setVehicleNumber}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputIcon}>🗺️</Text>
            <TextInput
              style={styles.modernInput}
              placeholder="Route (e.g., Colombo-Kandy)"
              placeholderTextColor="#999"
              value={route}
              onChangeText={setRoute}
            />
          </View>

          <TouchableOpacity 
            style={styles.modernButton}
            onPress={handleDriverRegistration}
            disabled={loading}
          >
            <Text style={styles.modernButtonText}>
              {loading ? 'Submitting...' : 'Submit Application'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.registerLink}
            onPress={handleLogout}
          >
            <Text style={styles.registerLinkText}>Logout</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
  // Parent Dashboard
  if (currentScreen === 'ParentDashboard') {
    return (
      <View style={styles.modernContainer}>
        <StatusBar barStyle="light-content" />
        
        <View style={styles.modernHeader}>
          <View>
            <Text style={styles.modernGreeting}>Hello 👋</Text>
            <Text style={styles.modernName}>{user?.name}</Text>
            <Text style={styles.modernRole}>Parent Dashboard</Text>
          </View>
          <TouchableOpacity style={styles.profileCircle}>
            <Text style={styles.profileInitial}>{user?.name?.charAt(0)}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modernContent} showsVerticalScrollIndicator={false}>
          <View style={styles.statsContainer}>
            <View style={[styles.modernCard, styles.purpleCard]}>
              <View style={styles.cardIconContainer}>
                <Text style={styles.cardEmoji}>👨👩👧</Text>
              </View>
              <Text style={styles.cardValue}>2</Text>
              <Text style={styles.cardLabel}>My Children</Text>
            </View>

            <View style={[styles.modernCard, styles.blueCard]}>
              <View style={styles.cardIconContainer}>
                <Text style={styles.cardEmoji}>🚌</Text>
              </View>
              <Text style={styles.cardValue}>1</Text>
              <Text style={styles.cardLabel}>Active Routes</Text>
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View style={[styles.modernCard, styles.orangeCard]}>
              <View style={styles.cardIconContainer}>
                <Text style={styles.cardEmoji}>🔔</Text>
              </View>
              <Text style={styles.cardValue}>3</Text>
              <Text style={styles.cardLabel}>Notifications</Text>
            </View>

            <View style={[styles.modernCard, styles.greenCard]}>
              <View style={styles.cardIconContainer}>
                <Text style={styles.cardEmoji}>💰</Text>
              </View>
              <Text style={styles.cardValue}>Paid</Text>
              <Text style={styles.cardLabel}>Payment Status</Text>
            </View>
          </View>

          <View style={styles.actionsSection}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            
            <TouchableOpacity style={styles.modernActionCard}>
              <View style={styles.actionIconCircle}>
                <Text style={styles.actionIcon}>📍</Text>
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Track Bus Location</Text>
                <Text style={styles.actionSubtitle}>Real-time tracking</Text>
              </View>
              <Text style={styles.actionArrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modernActionCard}>
              <View style={styles.actionIconCircle}>
                <Text style={styles.actionIcon}>📋</Text>
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>View Attendance</Text>
                <Text style={styles.actionSubtitle}>Check student records</Text>
              </View>
              <Text style={styles.actionArrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modernActionCard}>
              <View style={styles.actionIconCircle}>
                <Text style={styles.actionIcon}>💬</Text>
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Send Feedback</Text>
                <Text style={styles.actionSubtitle}>Share your thoughts</Text>
              </View>
              <Text style={styles.actionArrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.logoutCard}
              onPress={handleLogout}
            >
              <View style={styles.logoutIconCircle}>
                <Text style={styles.actionIcon}>🚪</Text>
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.logoutTitle}>Logout</Text>
                <Text style={styles.actionSubtitle}>Sign out from app</Text>
              </View>
              <Text style={styles.actionArrow}>›</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Driver Dashboard
  if (currentScreen === 'DriverDashboard') {
    // If driver is not approved, show waiting screen
    if (driverStatus === 'pending') {
      return (
        <View style={styles.modernContainer}>
          <StatusBar barStyle="light-content" />
          
          <View style={styles.modernHeader}>
            <View>
              <Text style={styles.modernGreeting}>Hello 👋</Text>
              <Text style={styles.modernName}>{user?.name}</Text>
              <Text style={styles.modernRole}>Driver Account</Text>
            </View>
            <TouchableOpacity style={styles.profileCircle}>
              <Text style={styles.profileInitial}>{user?.name?.charAt(0)}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.waitingContainer}>
            <Text style={styles.waitingEmoji}>⏳</Text>
            <Text style={styles.waitingTitle}>Approval Pending</Text>
            <Text style={styles.waitingMessage}>
              Your driver account is under review by the admin.
              You'll be able to access all features once approved.
            </Text>
            <View style={styles.waitingCard}>
              <Text style={styles.waitingCardTitle}>What's Next?</Text>
              <Text style={styles.waitingCardText}>• Admin will review your application</Text>
              <Text style={styles.waitingCardText}>• You'll receive notification once approved</Text>
              <Text style={styles.waitingCardText}>• Then you can access all driver features</Text>
            </View>
            <TouchableOpacity 
              style={styles.refreshButton}
              onPress={() => checkDriverStatus(user._id)}
            >
              <Text style={styles.refreshButtonText}>🔄 Check Status</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.logoutButtonWaiting}
              onPress={handleLogout}
            >
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    // If driver is rejected
    if (driverStatus === 'rejected') {
      return (
        <View style={styles.modernContainer}>
          <StatusBar barStyle="light-content" />
          
          <View style={styles.modernHeader}>
            <View>
              <Text style={styles.modernGreeting}>Hello 👋</Text>
              <Text style={styles.modernName}>{user?.name}</Text>
              <Text style={styles.modernRole}>Driver Account</Text>
            </View>
            <TouchableOpacity style={styles.profileCircle}>
              <Text style={styles.profileInitial}>{user?.name?.charAt(0)}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.waitingContainer}>
            <Text style={styles.waitingEmoji}>❌</Text>
            <Text style={styles.waitingTitle}>Application Rejected</Text>
            <Text style={styles.waitingMessage}>
              Unfortunately, your driver application was not approved.
              Please contact the admin for more information.
            </Text>
            <TouchableOpacity 
              style={styles.logoutButtonWaiting}
              onPress={handleLogout}
            >
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    // If driver is approved, show full dashboard
    return (
      <View style={styles.modernContainer}>
        <StatusBar barStyle="light-content" />
        
        <View style={styles.modernHeader}>
          <View>
            <Text style={styles.modernGreeting}>Hello 👋</Text>
            <Text style={styles.modernName}>{user?.name}</Text>
            <Text style={styles.modernRole}>Driver Dashboard</Text>
          </View>
          <TouchableOpacity style={styles.profileCircle}>
            <Text style={styles.profileInitial}>{user?.name?.charAt(0)}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modernContent} showsVerticalScrollIndicator={false}>
          <View style={styles.statsContainer}>
            <View style={[styles.modernCard, styles.purpleCard]}>
              <View style={styles.cardIconContainer}>
                <Text style={styles.cardEmoji}>👥</Text>
              </View>
              <Text style={styles.cardValue}>25</Text>
              <Text style={styles.cardLabel}>Total Students</Text>
            </View>

            <View style={[styles.modernCard, styles.greenCard]}>
              <View style={styles.cardIconContainer}>
                <Text style={styles.cardEmoji}>✅</Text>
              </View>
              <Text style={styles.cardValue}>23</Text>
              <Text style={styles.cardLabel}>Present Today</Text>
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View style={[styles.modernCard, styles.blueCard]}>
              <View style={styles.cardIconContainer}>
                <Text style={styles.cardEmoji}>🚌</Text>
              </View>
              <Text style={styles.cardValue}>Active</Text>
              <Text style={styles.cardLabel}>Route Status</Text>
            </View>

            <View style={[styles.modernCard, styles.orangeCard]}>
              <View style={styles.cardIconContainer}>
                <Text style={styles.cardEmoji}>📍</Text>
              </View>
              <Text style={styles.cardValue}>12</Text>
              <Text style={styles.cardLabel}>Total Stops</Text>
            </View>
          </View>

          <View style={styles.actionsSection}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            
            <TouchableOpacity style={styles.modernActionCard}>
              <View style={styles.actionIconCircle}>
                <Text style={styles.actionIcon}>📋</Text>
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Mark Attendance</Text>
                <Text style={styles.actionSubtitle}>Record student presence</Text>
              </View>
              <Text style={styles.actionArrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modernActionCard}>
              <View style={styles.actionIconCircle}>
                <Text style={styles.actionIcon}>📢</Text>
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Send Notification</Text>
                <Text style={styles.actionSubtitle}>Alert parents instantly</Text>
              </View>
              <Text style={styles.actionArrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modernActionCard}>
              <View style={styles.actionIconCircle}>
                <Text style={styles.actionIcon}>🗺️</Text>
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>View Route</Text>
                <Text style={styles.actionSubtitle}>Check route details</Text>
              </View>
              <Text style={styles.actionArrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modernActionCard}>
              <View style={styles.actionIconCircle}>
                <Text style={styles.actionIcon}>🚨</Text>
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Report Emergency</Text>
                <Text style={styles.actionSubtitle}>Immediate assistance</Text>
              </View>
              <Text style={styles.actionArrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.logoutCard}
              onPress={handleLogout}
            >
              <View style={styles.logoutIconCircle}>
                <Text style={styles.actionIcon}>🚪</Text>
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.logoutTitle}>Logout</Text>
                <Text style={styles.actionSubtitle}>Sign out from app</Text>
              </View>
              <Text style={styles.actionArrow}>›</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  // Login Styles
  loginContainer: {
    flex: 1,
    backgroundColor: '#667eea',
  },
  loginHeader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  loginLogo: {
    fontSize: 80,
    marginBottom: 20,
  },
  loginTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  loginSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
  },
  loginForm: {
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 30,
    paddingTop: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f7fa',
    borderRadius: 15,
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  inputIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  modernInput: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    color: '#333',
  },
  modernButton: {
    backgroundColor: '#667eea',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  modernButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },

  // Dashboard Styles
  modernContainer: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  modernHeader: {
    backgroundColor: '#667eea',
    padding: 25,
    paddingTop: 60,
    paddingBottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  modernGreeting: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
  },
  modernName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 5,
  },
  modernRole: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 5,
  },
  profileCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  modernContent: {
    flex: 1,
    marginTop: -20,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingTop: 15,
    justifyContent: 'space-between',
  },
  modernCard: {
    width: '48%',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  purpleCard: {
    backgroundColor: '#667eea',
  },
  blueCard: {
    backgroundColor: '#4facfe',
  },
  orangeCard: {
    backgroundColor: '#ff9a56',
  },
  greenCard: {
    backgroundColor: '#43e97b',
  },
  cardIconContainer: {
    marginBottom: 10,
  },
  cardEmoji: {
    fontSize: 36,
  },
  cardValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  cardLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  actionsSection: {
    padding: 20,
    paddingTop: 25,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  modernActionCard: {
    backgroundColor: 'white',
    padding: 18,
    borderRadius: 15,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  actionIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f2ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  actionIcon: {
    fontSize: 24,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 3,
  },
  actionSubtitle: {
    fontSize: 13,
    color: '#999',
  },
  actionArrow: {
    fontSize: 28,
    color: '#ddd',
    fontWeight: '300',
  },
  logoutCard: {
    backgroundColor: '#fff5f5',
    padding: 18,
    borderRadius: 15,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ffe0e0',
  },
  logoutIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ffe0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  logoutTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#dc3545',
    marginBottom: 3,
  },
  registerLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  registerLinkText: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: '600',
  },
  roleLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
    marginTop: 10,
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  roleButton: {
    width: '48%',
    padding: 20,
    borderRadius: 15,
    backgroundColor: '#f5f7fa',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#f5f7fa',
  },
  roleButtonActive: {
    backgroundColor: '#e8ebff',
    borderColor: '#667eea',
  },
  roleEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  roleText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  roleTextActive: {
    color: '#667eea',
  },
  waitingContainer: {
    flex: 1,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  waitingEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  waitingTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  waitingMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  waitingCard: {
    backgroundColor: '#f0f2ff',
    padding: 20,
    borderRadius: 15,
    width: '100%',
    marginBottom: 20,
  },
  waitingCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 15,
  },
  waitingCardText: {
    fontSize: 15,
    color: '#666',
    marginBottom: 8,
    lineHeight: 22,
  },
  refreshButton: {
    backgroundColor: '#667eea',
    padding: 15,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButtonWaiting: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#dc3545',
  },
  logoutButtonText: {
    color: '#dc3545',
    fontSize: 16,
    fontWeight: 'bold',
  },
  childrenSection: {
    marginBottom: 20,
  },
  childrenTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  childCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
  },
  childNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#667eea',
    marginBottom: 10,
  },
  addChildButton: {
    backgroundColor: '#e8ebff',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  addChildText: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: '600',
  },
  removeChildButton: {
    backgroundColor: '#ffe0e0',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  removeChildText: {
    color: '#dc3545',
    fontSize: 14,
    fontWeight: '600',
  },
});
