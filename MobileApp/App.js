import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, StatusBar, Platform, Dimensions, Linking, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar } from 'react-native-calendars';
import { login } from './services/api';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

// Keep splash screen visible while loading fonts
SplashScreen.preventAutoHideAsync();

const ROUTES = [
  'Puttalam Town to Kurunegala',
  'Kandy Town to Kurunegala',
  'Matale Town to Kurunegala',
  'Ibbagamuwa Town to Kurunegala',
  'Polgahawela to Kurunegala'
];

export default function App() {
  const [fontsLoaded, setFontsLoaded] = React.useState(false);
  const [currentScreen, setCurrentScreen] = React.useState('Login');
  const [user, setUser] = React.useState(null);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  
  // Registration fields
  const [name, setName] = React.useState('');
  const [selectedRole, setSelectedRole] = React.useState('parent');
  
  // Parent fields
  const [children, setChildren] = React.useState([]);
  const [currentChild, setCurrentChild] = React.useState({
    childName: '',
    childClass: '',
    childDOB: new Date(),
    selectedRoute: ROUTES[0]
  });
  const [showChildDOBPicker, setShowChildDOBPicker] = React.useState(false);
  
  // Driver fields
  const [driverDOB, setDriverDOB] = React.useState(new Date());
  const [showDriverDOBPicker, setShowDriverDOBPicker] = React.useState(false);
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [nicNumber, setNicNumber] = React.useState('');
  const [driverLicense, setDriverLicense] = React.useState('');
  const [assignedRoute, setAssignedRoute] = React.useState(ROUTES[0]);
  
  // Driver info for parent
  const [driverInfo, setDriverInfo] = React.useState(null);
  const [childAttendance, setChildAttendance] = React.useState(null);
  
  // Students for driver
  const [students, setStudents] = React.useState([]);
  const [attendanceData, setAttendanceData] = React.useState([]);
  const [attendanceReport, setAttendanceReport] = React.useState([]);
  const [selectedDate, setSelectedDate] = React.useState('');
  const [markedDates, setMarkedDates] = React.useState({});
  
  // Admin data
  const [adminStats, setAdminStats] = React.useState(null);
  const [adminReports, setAdminReports] = React.useState([]);
  const [selectedReportDate, setSelectedReportDate] = React.useState('');
  const [reportDetails, setReportDetails] = React.useState(null);
  
  // Payment data
  const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState(null);
  
  // Feedback data
  const [feedbackRating, setFeedbackRating] = React.useState(0);
  const [feedbackComment, setFeedbackComment] = React.useState('');

  // Load fonts
  React.useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          'ClashGrotesk-Regular': require('./assets/fonts/ClashGrotesk-Regular.otf'),
          'ClashGrotesk-Medium': require('./assets/fonts/ClashGrotesk-Medium.otf'),
          'ClashGrotesk-Semibold': require('./assets/fonts/ClashGrotesk-Semibold.otf'),
          'ClashGrotesk-Bold': require('./assets/fonts/ClashGrotesk-Bold.otf'),
        });
        setFontsLoaded(true);
        await SplashScreen.hideAsync();
      } catch (error) {
        console.error('Error loading fonts:', error);
        // Continue without custom fonts
        setFontsLoaded(true);
        await SplashScreen.hideAsync();
      }
    }
    loadFonts();
  }, []);

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
        setCurrentScreen('DriverDashboard');
      } else if (response.data.role === 'admin') {
        setCurrentScreen('AdminDashboard');
      } else {
        setCurrentScreen('ParentDashboard');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      Alert.alert('Login Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    try {
      setLoading(true);
      const { register } = require('./services/api');
      let data = { name, email, password, role: selectedRole };
      
      if (selectedRole === 'parent') {
        if (children.length === 0) {
          Alert.alert('Error', 'Please add at least one child');
          setLoading(false);
          return;
        }
        data.children = children;
      } else {
        if (!phoneNumber || !nicNumber || !assignedRoute) {
          Alert.alert('Error', 'Please provide all driver details');
          setLoading(false);
          return;
        }
        
        // Check age
        const today = new Date();
        const birthDate = new Date(driverDOB);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        
        if (age < 25) {
          Alert.alert('Error', `Driver must be at least 25 years old. Your age: ${age}`);
          setLoading(false);
          return;
        }
        
        data.dateOfBirth = driverDOB.toISOString();
        data.phoneNumber = phoneNumber;
        data.nicNumber = nicNumber;
        data.driverLicenseImage = driverLicense || 'pending_upload';
        data.assignedRoute = assignedRoute;
      }
      
      console.log('Registration data:', data);
      const response = await register(data);
      console.log('Registration response:', response.data);
      
      if (selectedRole === 'driver') {
        Alert.alert(
          'Registration Successful',
          'Your driver account has been created. Please wait for admin approval before you can login.',
          [
            {
              text: 'OK',
              onPress: () => {
                resetForm();
                setCurrentScreen('Login');
              }
            }
          ]
        );
      } else {
        Alert.alert('Success', 'Registration successful! Please login.');
        resetForm();
        setCurrentScreen('Login');
      }
    } catch (error) {
      console.error('Registration error:', error);
      console.error('Error response:', error.response?.data);
      const errorMsg = error.response?.data?.message || error.message || 'Registration failed';
      Alert.alert('Registration Error', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setChildren([]);
    setCurrentChild({
      childName: '',
      childClass: '',
      childDOB: new Date(),
      selectedRoute: ROUTES[0]
    });
    setPhoneNumber('');
    setNicNumber('');
    setDriverLicense('');
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    setUser(null);
    setCurrentScreen('Login');
    resetForm();
  };

  const loadDriverInfo = async () => {
    try {
      const { default: api } = require('./services/api');
      const response = await api.get(`/auth/driver/route/${encodeURIComponent(user.selectedRoute)}`);
      setDriverInfo(response.data);
      setCurrentScreen('DriverInfo');
    } catch (error) {
      Alert.alert('Info', 'No driver assigned to your route yet');
    }
  };

  const loadChildAttendance = async () => {
    try {
      const { default: api } = require('./services/api');
      const response = await api.get(`/attendance/parent/${user._id}/child`);
      setChildAttendance(response.data);
    } catch (error) {
      console.error('Failed to load attendance:', error);
    }
  };

  // Auto-load attendance when parent dashboard opens
  React.useEffect(() => {
    if (currentScreen === 'ParentDashboard' && user?.role === 'parent') {
      loadChildAttendance();
      // Refresh every 30 seconds
      const interval = setInterval(loadChildAttendance, 30000);
      return () => clearInterval(interval);
    }
  }, [currentScreen, user]);

  const loadStudents = async () => {
    try {
      console.log('Loading students for driver:', user._id);
      const { default: api } = require('./services/api');
      const response = await api.get(`/attendance/driver/${user._id}/today`);
      console.log('Students loaded:', response.data.length);
      console.log('First student data:', JSON.stringify(response.data[0], null, 2));
      setAttendanceData(response.data);
      setCurrentScreen('StudentsList');
    } catch (error) {
      console.error('Failed to load students:', error);
      console.error('Error details:', error.response?.data);
      Alert.alert('Error', error.response?.data?.message || 'Failed to load students. Make sure backend is running.');
    }
  };

  const loadAttendanceReport = async () => {
    try {
      console.log('Loading attendance report for driver:', user._id);
      const { default: api } = require('./services/api');
      const response = await api.get(`/attendance/driver/${user._id}/morning-report`);
      console.log('Attendance report loaded:', response.data.length);
      setAttendanceReport(response.data);
      setCurrentScreen('AttendanceReport');
    } catch (error) {
      console.error('Failed to load attendance report:', error);
      console.error('Error details:', error.response?.data);
      Alert.alert('Error', error.response?.data?.message || 'Failed to load attendance report. Make sure backend is running.');
    }
  };

  const openCalendar = () => {
    // Set today's date as selected when opening calendar
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
    setCurrentScreen('Calendar');
  };

  const openMap = () => {
    setCurrentScreen('Map');
  };

  const viewDriverProfile = () => {
    setCurrentScreen('DriverProfile');
  };

  // Admin functions
  const loadAdminStats = async () => {
    try {
      const { default: api } = require('./services/api');
      const response = await api.get('/admin/stats');
      setAdminStats(response.data);
    } catch (error) {
      console.error('Failed to load admin stats:', error);
      Alert.alert('Error', 'Failed to load statistics');
    }
  };

  const loadAdminReports = async () => {
    try {
      const { default: api } = require('./services/api');
      const response = await api.get('/admin/reports');
      setAdminReports(response.data);
      setCurrentScreen('AdminReports');
    } catch (error) {
      console.error('Failed to load reports:', error);
      Alert.alert('Error', 'Failed to load reports');
    }
  };

  const loadReportDetails = async (date) => {
    try {
      const { default: api } = require('./services/api');
      const response = await api.get(`/admin/reports/${date}`);
      setReportDetails(response.data);
      setSelectedReportDate(date);
      setCurrentScreen('AdminReportDetails');
    } catch (error) {
      console.error('Failed to load report details:', error);
      Alert.alert('Error', 'Failed to load report details');
    }
  };

  // Load admin stats when admin dashboard opens
  React.useEffect(() => {
    if (currentScreen === 'AdminDashboard' && user?.role === 'admin') {
      loadAdminStats();
    }
  }, [currentScreen, user]);

  // Show loading screen while fonts load
  if (!fontsLoaded) {
    return null;
  }

  const viewAttendanceForDate = async (dateString) => {
    try {
      console.log('Loading attendance for date:', dateString);
      console.log('Driver ID:', user._id);
      const { default: api } = require('./services/api');
      const response = await api.get(`/attendance/driver/${user._id}/date/${dateString}`);
      console.log('Attendance data received:', response.data);
      setAttendanceReport(response.data);
      setCurrentScreen('AttendanceReport');
    } catch (error) {
      console.error('Failed to load attendance for date:', error);
      console.error('Error response:', error.response?.data);
      Alert.alert('Error', error.response?.data?.message || 'Failed to load attendance for this date');
    }
  };

  const markAction = async (studentId, action) => {
    try {
      console.log(`Marking ${action} for student:`, studentId);
      console.log('Driver ID:', user._id);
      const { default: api } = require('./services/api');
      const response = await api.post(`/attendance/${action}/${studentId}`, { driverId: user._id });
      console.log('Response:', response.data);
      Alert.alert('Success', `${action.replace('-', ' ')} marked successfully`);
      loadStudents(); // Reload to get updated status
    } catch (error) {
      console.error(`Failed to mark ${action}:`, error);
      console.error('Error details:', error.response?.data);
      Alert.alert('Error', error.response?.data?.message || 'Failed to mark action');
    }
  };

  // Login Screen
  if (currentScreen === 'Login') {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.header}>
          <Image source={require('./assets/logo.png')} style={styles.logoImage} resizeMode="contain" />
          <Text style={styles.title}>RoyalWay</Text>
          <Text style={styles.subtitle}>School Transportation System</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputBox}>
            <Text style={styles.icon}></Text>
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputBox}>
            <Text style={styles.icon}></Text>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Signing In...' : 'Sign In'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setCurrentScreen('Register')}>
            <Text style={styles.link}>Don't have an account? Register</Text>
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialBtn}>
              <Image source={require('./assets/facebook.png')} style={styles.socialIconImage} resizeMode="contain" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn}>
              <Image source={require('./assets/google.png')} style={styles.socialIconImage} resizeMode="contain" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn}>
              <Image source={require('./assets/apple.png')} style={styles.socialIconImage} resizeMode="contain" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn}>
              <Image source={require('./assets/twitter.png')} style={styles.socialIconImage} resizeMode="contain" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // Register Screen
  if (currentScreen === 'Register') {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.headerSmall}>
          <Text style={styles.logoSmall}></Text>
          <Text style={styles.titleSmall}>Create Account</Text>
        </View>

        <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
          <View style={styles.inputBox}>
            <Text style={styles.icon}></Text>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputBox}>
            <Text style={styles.icon}></Text>
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputBox}>
            <Text style={styles.icon}></Text>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <Text style={styles.label}>Select Your Role:</Text>
          <View style={styles.roleRow}>
            <TouchableOpacity
              style={[styles.roleBtn, selectedRole === 'parent' && styles.roleBtnActive]}
              onPress={() => setSelectedRole('parent')}
            >
              <Text style={styles.roleEmoji}>👨‍👩‍👧</Text>
              <Text style={[styles.roleText, selectedRole === 'parent' && styles.roleTextActive]}>
                Parent
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roleBtn, selectedRole === 'driver' && styles.roleBtnActive]}
              onPress={() => setSelectedRole('driver')}
            >
              <Text style={styles.roleEmoji}></Text>
              <Text style={[styles.roleText, selectedRole === 'driver' && styles.roleTextActive]}>
                Driver
              </Text>
            </TouchableOpacity>
          </View>

          {selectedRole === 'parent' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Children Details</Text>
              
              {/* List of added children */}
              {children.length > 0 && (
                <View style={styles.childrenList}>
                  <Text style={styles.childrenListTitle}>Added Children ({children.length}):</Text>
                  {children.map((child, index) => (
                    <View key={index} style={styles.childCard}>
                      <View style={styles.childCardContent}>
                        <Text style={styles.childCardName}>{child.childName}</Text>
                        <Text style={styles.childCardDetails}>Class: {child.childClass} | Route: {child.selectedRoute}</Text>
                      </View>
                      <TouchableOpacity 
                        onPress={() => {
                          const newChildren = children.filter((_, i) => i !== index);
                          setChildren(newChildren);
                        }}
                        style={styles.removeChildBtn}
                      >
                        <Text style={styles.removeChildText}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}

              {/* Add new child form */}
              <Text style={styles.addChildTitle}>{children.length === 0 ? 'Add First Child' : 'Add Another Child'}:</Text>
              
              <View style={styles.inputBox}>
                <Text style={styles.icon}></Text>
                <TextInput
                  style={styles.input}
                  placeholder="Child Name"
                  placeholderTextColor="#999"
                  value={currentChild.childName}
                  onChangeText={(text) => setCurrentChild({...currentChild, childName: text})}
                />
              </View>

              <View style={styles.inputBox}>
                <Text style={styles.icon}></Text>
                <TextInput
                  style={styles.input}
                  placeholder="Class/Grade"
                  placeholderTextColor="#999"
                  value={currentChild.childClass}
                  onChangeText={(text) => setCurrentChild({...currentChild, childClass: text})}
                />
              </View>

              <TouchableOpacity style={styles.inputBox} onPress={() => setShowChildDOBPicker(true)}>
                <Text style={styles.icon}></Text>
                <Text style={styles.dateText}>
                  Date of Birth: {currentChild.childDOB.toLocaleDateString()}
                </Text>
              </TouchableOpacity>
              {showChildDOBPicker && (
                <DateTimePicker
                  value={currentChild.childDOB}
                  mode="date"
                  display="default"
                  onChange={(event, date) => {
                    setShowChildDOBPicker(false);
                    if (date) setCurrentChild({...currentChild, childDOB: date});
                  }}
                />
              )}

              <Text style={styles.label}>Select Route:</Text>
              {ROUTES.map((route, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.routeCard,
                    currentChild.selectedRoute === route && styles.routeCardActive
                  ]}
                  onPress={() => setCurrentChild({...currentChild, selectedRoute: route})}
                >
                  <View style={styles.routeContent}>
                    <View style={[
                      styles.radioCircle,
                      currentChild.selectedRoute === route && styles.radioCircleActive
                    ]}>
                      {currentChild.selectedRoute === route && <View style={styles.radioDot} />}
                    </View>
                    <Text style={[
                      styles.routeText,
                      currentChild.selectedRoute === route && styles.routeTextActive
                    ]}>{route}</Text>
                  </View>
                </TouchableOpacity>
              ))}

              {/* Add Child Button */}
              <TouchableOpacity 
                style={styles.addChildButton}
                onPress={() => {
                  if (!currentChild.childName || !currentChild.childClass) {
                    Alert.alert('Error', 'Please fill child name and class');
                    return;
                  }
                  setChildren([...children, {
                    childName: currentChild.childName,
                    childClass: currentChild.childClass,
                    childDateOfBirth: currentChild.childDOB.toISOString(),
                    selectedRoute: currentChild.selectedRoute
                  }]);
                  // Reset current child form
                  setCurrentChild({
                    childName: '',
                    childClass: '',
                    childDOB: new Date(),
                    selectedRoute: ROUTES[0]
                  });
                  Alert.alert('Success', 'Child added! You can add more or proceed to register.');
                }}
              >
                <Text style={styles.addChildButtonText}>+ Add This Child</Text>
              </TouchableOpacity>
            </View>
          )}

          {selectedRole === 'driver' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}> Driver Details</Text>
              
              <TouchableOpacity style={styles.inputBox} onPress={() => setShowDriverDOBPicker(true)}>
                <Text style={styles.icon}></Text>
                <Text style={styles.dateText}>
                  Date of Birth: {driverDOB.toLocaleDateString()}
                </Text>
              </TouchableOpacity>
              {showDriverDOBPicker && (
                <DateTimePicker
                  value={driverDOB}
                  mode="date"
                  display="default"
                  maximumDate={new Date()}
                  onChange={(event, date) => {
                    setShowDriverDOBPicker(false);
                    if (date) setDriverDOB(date);
                  }}
                />
              )}

              <View style={styles.inputBox}>
                <Text style={styles.icon}></Text>
                <TextInput
                  style={styles.input}
                  placeholder="Phone Number"
                  placeholderTextColor="#999"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputBox}>
                <Text style={styles.icon}></Text>
                <TextInput
                  style={styles.input}
                  placeholder="NIC Number"
                  placeholderTextColor="#999"
                  value={nicNumber}
                  onChangeText={setNicNumber}
                />
              </View>

              <View style={styles.inputBox}>
                <Text style={styles.icon}></Text>
                <TextInput
                  style={styles.input}
                  placeholder="Driver License Number"
                  placeholderTextColor="#999"
                  value={driverLicense}
                  onChangeText={setDriverLicense}
                />
              </View>

              <Text style={styles.label}>Select Route You Can Drive:</Text>
              {ROUTES.map((route, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.routeCard,
                    assignedRoute === route && styles.routeCardActive
                  ]}
                  onPress={() => setAssignedRoute(route)}
                >
                  <View style={styles.routeContent}>
                    <View style={[
                      styles.radioCircle,
                      assignedRoute === route && styles.radioCircleActive
                    ]}>
                      {assignedRoute === route && <View style={styles.radioDot} />}
                    </View>
                    <Text style={[
                      styles.routeText,
                      assignedRoute === route && styles.routeTextActive
                    ]}>{route}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Creating Account...' : 'Create Account'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setCurrentScreen('Login')}>
            <Text style={styles.link}>Already have an account? Login</Text>
          </TouchableOpacity>
          <View style={{height: 50}} />
        </ScrollView>
      </View>
    );
  }

  // Parent Dashboard
  if (currentScreen === 'ParentDashboard') {
    const viewParentProfile = () => {
      setCurrentScreen('ParentProfile');
    };

    return (
      <View style={styles.dashboard}>
        <StatusBar barStyle="light-content" />
        <View style={styles.dashHeader}>
          <View style={styles.parentHeaderContent}>
            <View>
              <Text style={styles.greeting}>Hello </Text>
              <Text style={styles.userName}>{user?.name}</Text>
              <Text style={styles.userRole}>Parent Dashboard</Text>
            </View>
            <TouchableOpacity style={styles.profileIconBtn} onPress={viewParentProfile}>
              <View style={styles.profileIconCircle}>
                <Text style={styles.profileIconText}>{user?.name?.charAt(0).toUpperCase()}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.dashContent}>
          <View style={styles.introCard}>
            <Text style={styles.introText}>
              Welcome to RoyalWay School Transportation System. Track your child's journey safely with real time updates and attendance monitoring.
            </Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Children Information</Text>
            {user?.children && user.children.length > 0 ? (
              user.children.map((child, index) => (
                <View key={index} style={styles.childInfoItem}>
                  <Text style={styles.childInfoName}>{index + 1}. {child.childName}</Text>
                  <Text style={styles.infoText}>   Class: {child.childClass}</Text>
                  <Text style={styles.infoText}>   Route: {child.selectedRoute}</Text>
                  {index < user.children.length - 1 && <View style={styles.childDivider} />}
                </View>
              ))
            ) : (
              <View>
                <Text style={styles.infoText}>Name: {user?.childName}</Text>
                <Text style={styles.infoText}>Class: {user?.childClass}</Text>
                <Text style={styles.infoText}>Route: {user?.selectedRoute}</Text>
              </View>
            )}
          </View>

          {childAttendance && (
            <View style={styles.attendanceCard}>
              <View style={styles.attendanceTitleRow}>
                <Text style={styles.attendanceTitle}>Today's Status</Text>
                <Text style={styles.attendanceDate}>{new Date().toLocaleDateString()}</Text>
              </View>
              <View style={styles.attendanceRow}>
                <Text style={styles.attendanceLabel}>Overall:</Text>
                <View style={[
                  styles.statusBadge,
                  childAttendance.status === 'Active' && styles.statusPresent,
                  childAttendance.status === 'Absent' && styles.statusAbsent,
                  childAttendance.status === 'Not Started' && styles.statusPending
                ]}>
                  <Text style={styles.statusText}>{childAttendance.status}</Text>
                </View>
              </View>

              {!childAttendance.isAbsent && (
                <View style={styles.attendanceDetails}>
                  <View style={styles.attendanceItem}>
                    <Text style={styles.attendanceItemLabel}>Morning Pickup:</Text>
                    <Text style={[
                      styles.attendanceItemValue,
                      childAttendance.morningPickup?.status === 'picked' && styles.attendanceSuccess
                    ]}>
                      {childAttendance.morningPickup?.status === 'picked' ? 
                        `✓ ${new Date(childAttendance.morningPickup.time).toLocaleTimeString()}` : 
                        'Pending'}
                    </Text>
                  </View>

                  <View style={styles.attendanceItem}>
                    <Text style={styles.attendanceItemLabel}>Evening Dropoff:</Text>
                    <Text style={[
                      styles.attendanceItemValue,
                      childAttendance.eveningDropoff?.status === 'dropped' && styles.attendanceSuccess
                    ]}>
                      {childAttendance.eveningDropoff?.status === 'dropped' ? 
                        `✓ ${new Date(childAttendance.eveningDropoff.time).toLocaleTimeString()}` : 
                        'Pending'}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          )}

          <TouchableOpacity style={styles.actionCard} onPress={loadDriverInfo}>
            <Text style={styles.actionIcon}></Text>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Driver</Text>
              <Text style={styles.actionSub}>View your assigned driver</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => Alert.alert('Coming Soon', 'Track Bus feature is coming soon. Stay tuned for real-time bus tracking!')}
          >
            <Text style={styles.actionIcon}></Text>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Track Bus</Text>
              <Text style={styles.actionSub}>Real-time location</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactCard} onPress={loadDriverInfo}>
            <View style={styles.contactContent}>
              <Text style={styles.contactTitle}>Contact Driver</Text>
              <Text style={styles.contactSub}>View driver contact details</Text>
            </View>
            <Text style={styles.contactArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.paymentCard} onPress={() => setCurrentScreen('Payment')}>
            <View style={styles.paymentContent}>
              <Text style={styles.paymentTitle}>Make Payment</Text>
              <Text style={styles.paymentSub}>Pay monthly transportation fee</Text>
            </View>
            <Text style={styles.paymentArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.feedbackCard} onPress={() => setCurrentScreen('Feedback')}>
            <View style={styles.feedbackContent}>
              <Text style={styles.feedbackTitle}>Give Feedback</Text>
              <Text style={styles.feedbackSub}>Rate your driver's service</Text>
            </View>
            <Text style={styles.feedbackArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.howToUseCard} onPress={() => setCurrentScreen('HowToUse')}>
            <View style={styles.howToUseContent}>
              <Text style={styles.howToUseTitle}>How to Use</Text>
              <Text style={styles.howToUseSub}>Learn how to use this app</Text>
            </View>
            <Text style={styles.howToUseArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutText}> Logout</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  // How to Use Screen
  if (currentScreen === 'HowToUse') {
    return (
      <View style={styles.dashboard}>
        <StatusBar barStyle="light-content" />
        <View style={styles.dashHeader}>
          <TouchableOpacity onPress={() => setCurrentScreen('ParentDashboard')}>
            <Text style={styles.backBtn}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>How to Use</Text>
        </View>

        <ScrollView style={styles.dashContent}>
          <View style={styles.guideCard}>
            <Text style={styles.guideTitle}>Welcome to RoyalWay</Text>
            <Text style={styles.guideText}>
              This app helps you track your child's school transportation safely and efficiently.
            </Text>
          </View>

          <View style={styles.guideCard}>
            <Text style={styles.guideStepNumber}>1</Text>
            <Text style={styles.guideStepTitle}>View Child Information</Text>
            <Text style={styles.guideText}>
              Check your child's details including name, class, and assigned route on the dashboard.
            </Text>
          </View>

          <View style={styles.guideCard}>
            <Text style={styles.guideStepNumber}>2</Text>
            <Text style={styles.guideStepTitle}>Today's Attendance Status</Text>
            <Text style={styles.guideText}>
              Monitor real-time attendance updates:
            </Text>
            <Text style={styles.guideBullet}>• Morning Pickup: When driver picks up your child from home</Text>
            <Text style={styles.guideBullet}>• Evening Dropoff: When driver drops your child at home</Text>
            <Text style={styles.guideBullet}>• Status shows: Active, Absent, or Not Started</Text>
          </View>

          <View style={styles.guideCard}>
            <Text style={styles.guideStepNumber}>3</Text>
            <Text style={styles.guideStepTitle}>View Driver Information</Text>
            <Text style={styles.guideText}>
              Tap the "Driver" button to see your assigned driver's details including name, phone number, and route.
            </Text>
          </View>

          <View style={styles.guideCard}>
            <Text style={styles.guideStepNumber}>4</Text>
            <Text style={styles.guideStepTitle}>Track Bus Location</Text>
            <Text style={styles.guideText}>
              Use the "Track Bus" button to view real-time location of the school bus (coming soon).
            </Text>
          </View>

          <View style={styles.guideCard}>
            <Text style={styles.guideStepNumber}>5</Text>
            <Text style={styles.guideStepTitle}>Notifications</Text>
            <Text style={styles.guideText}>
              You will receive notifications when:
            </Text>
            <Text style={styles.guideBullet}>• Driver picks up your child in the morning</Text>
            <Text style={styles.guideBullet}>• Driver drops off your child at school</Text>
            <Text style={styles.guideBullet}>• Driver picks up your child from school</Text>
            <Text style={styles.guideBullet}>• Driver drops off your child at home</Text>
          </View>

          <View style={styles.guideCard}>
            <Text style={styles.guideStepTitle}>Need Help?</Text>
            <Text style={styles.guideText}>
              If you have any questions or concerns, please contact the school administration or your assigned driver.
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Driver Info Screen
  if (currentScreen === 'DriverInfo') {
    return (
      <View style={styles.dashboard}>
        <StatusBar barStyle="light-content" />
        <View style={styles.dashHeader}>
          <TouchableOpacity onPress={() => setCurrentScreen('ParentDashboard')}>
            <Text style={styles.backBtn}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Driver Information</Text>
        </View>

        <ScrollView style={styles.dashContent}>
          {driverInfo ? (
            <>
              <View style={styles.driverCard}>
                <Text style={styles.driverIcon}></Text>
                <Text style={styles.driverName}>{driverInfo.name}</Text>
                <View style={styles.driverDetail}>
                  <Text style={styles.detailLabel}> Phone:</Text>
                  <Text style={styles.detailValue}>{driverInfo.phoneNumber}</Text>
                </View>
                <View style={styles.driverDetail}>
                  <Text style={styles.detailLabel}> Route:</Text>
                  <Text style={styles.detailValue}>{driverInfo.assignedRoute}</Text>
                </View>
                <View style={styles.driverDetail}>
                  <Text style={styles.detailLabel}> NIC:</Text>
                  <Text style={styles.detailValue}>{driverInfo.nicNumber}</Text>
                </View>
              </View>
              
              <TouchableOpacity 
                style={styles.callButton}
                onPress={() => {
                  const phoneNumber = `tel:${driverInfo.phoneNumber}`;
                  Linking.openURL(phoneNumber).catch(err => 
                    Alert.alert('Error', 'Unable to make phone call')
                  );
                }}
              >
                <Text style={styles.callButtonText}> Call Driver</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text style={styles.emptyText}>No driver assigned yet</Text>
          )}
        </ScrollView>
      </View>
    );
  }

  // Feedback Screen
  if (currentScreen === 'Feedback') {
    const handleSubmitFeedback = () => {
      if (feedbackRating === 0) {
        Alert.alert('Error', 'Please select a rating');
        return;
      }

      if (!feedbackComment.trim()) {
        Alert.alert('Error', 'Please write your feedback');
        return;
      }

      Alert.alert(
        'Feedback Submitted',
        `Thank you for your feedback! You rated ${feedbackRating} stars.\n\nYour feedback helps us improve our service.`,
        [
          {
            text: 'OK',
            onPress: () => {
              setFeedbackRating(0);
              setFeedbackComment('');
              setCurrentScreen('ParentDashboard');
            }
          }
        ]
      );
    };

    return (
      <View style={styles.dashboard}>
        <StatusBar barStyle="light-content" />
        <View style={styles.dashHeader}>
          <TouchableOpacity onPress={() => setCurrentScreen('ParentDashboard')}>
            <Text style={styles.backBtn}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Give Feedback</Text>
        </View>

        <ScrollView style={styles.dashContent}>
          <View style={styles.feedbackIntroCard}>
            <Text style={styles.feedbackIntroTitle}>We Value Your Opinion</Text>
            <Text style={styles.feedbackIntroText}>
              Your feedback helps us improve our service and ensure the best experience for your child.
            </Text>
          </View>

          <View style={styles.feedbackFormCard}>
            <Text style={styles.feedbackFormTitle}>Rate Your Driver</Text>
            <Text style={styles.feedbackFormSubtitle}>How would you rate the driver's service?</Text>
            
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setFeedbackRating(star)}
                  style={styles.starButton}
                >
                  <Text style={[
                    styles.starIcon,
                    feedbackRating >= star && styles.starIconActive
                  ]}>
                    {feedbackRating >= star ? '⭐' : '☆'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {feedbackRating > 0 && (
              <Text style={styles.ratingText}>
                {feedbackRating === 1 && 'Poor'}
                {feedbackRating === 2 && 'Fair'}
                {feedbackRating === 3 && 'Good'}
                {feedbackRating === 4 && 'Very Good'}
                {feedbackRating === 5 && 'Excellent'}
              </Text>
            )}
          </View>

          <View style={styles.feedbackFormCard}>
            <Text style={styles.feedbackFormTitle}>Your Feedback</Text>
            <Text style={styles.feedbackFormSubtitle}>Tell us about your experience</Text>
            
            <TextInput
              style={styles.feedbackTextArea}
              placeholder="Share your thoughts about the driver's punctuality, behavior, driving skills, and overall service..."
              placeholderTextColor="#999"
              value={feedbackComment}
              onChangeText={setFeedbackComment}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.feedbackCategoriesCard}>
            <Text style={styles.feedbackCategoriesTitle}>What to consider:</Text>
            <View style={styles.feedbackCategory}>
              <Text style={styles.feedbackCategoryIcon}>•</Text>
              <Text style={styles.feedbackCategoryText}>Punctuality</Text>
            </View>
            <View style={styles.feedbackCategory}>
              <Text style={styles.feedbackCategoryIcon}>•</Text>
              <Text style={styles.feedbackCategoryText}>Friendly Behavior</Text>
            </View>
            <View style={styles.feedbackCategory}>
              <Text style={styles.feedbackCategoryIcon}>•</Text>
              <Text style={styles.feedbackCategoryText}>Safe Driving</Text>
            </View>
            <View style={styles.feedbackCategory}>
              <Text style={styles.feedbackCategoryIcon}>•</Text>
              <Text style={styles.feedbackCategoryText}>Vehicle Cleanliness</Text>
            </View>
            <View style={styles.feedbackCategory}>
              <Text style={styles.feedbackCategoryIcon}>•</Text>
              <Text style={styles.feedbackCategoryText}>Communication</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.submitFeedbackButton} onPress={handleSubmitFeedback}>
            <Text style={styles.submitFeedbackButtonText}>Submit Feedback</Text>
          </TouchableOpacity>

          <View style={styles.feedbackNoteCard}>
            <Text style={styles.feedbackNoteTitle}>Privacy Note:</Text>
            <Text style={styles.feedbackNoteText}>
              Your feedback is confidential and will be used to improve our service quality. Thank you for helping us serve you better!
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Payment Screen
  if (currentScreen === 'Payment') {
    const monthlyFee = 15000; // LKR 15000 per month

    const handlePayment = () => {
      if (!selectedPaymentMethod) {
        Alert.alert('Error', 'Please select a payment method');
        return;
      }

      // Check if payment method is coming soon
      if (selectedPaymentMethod === 'Credit Card' || selectedPaymentMethod === 'Mobile Wallet') {
        Alert.alert(
          'Coming Soon',
          `${selectedPaymentMethod} payment option is coming soon. Please use Bank Transfer or Cash Payment for now.`,
          [{ text: 'OK' }]
        );
        return;
      }

      Alert.alert(
        'Payment Successful',
        `Your payment of LKR ${monthlyFee.toLocaleString()} has been processed successfully via ${selectedPaymentMethod}.`,
        [
          {
            text: 'OK',
            onPress: () => {
              setSelectedPaymentMethod(null);
              setCurrentScreen('ParentDashboard');
            }
          }
        ]
      );
    };

    return (
      <View style={styles.dashboard}>
        <StatusBar barStyle="light-content" />
        <View style={styles.dashHeader}>
          <TouchableOpacity onPress={() => setCurrentScreen('ParentDashboard')}>
            <Text style={styles.backBtn}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Make Payment</Text>
        </View>

        <ScrollView style={styles.dashContent}>
          <View style={styles.paymentSummaryCard}>
            <Text style={styles.paymentSummaryTitle}>Payment Summary</Text>
            <View style={styles.paymentSummaryRow}>
              <Text style={styles.paymentSummaryLabel}>Monthly Transportation Fee</Text>
              <Text style={styles.paymentSummaryValue}>LKR {monthlyFee.toLocaleString()}</Text>
            </View>
            <View style={styles.paymentSummaryDivider} />
            <View style={styles.paymentSummaryRow}>
              <Text style={styles.paymentSummaryTotalLabel}>Total Amount</Text>
              <Text style={styles.paymentSummaryTotalValue}>LKR {monthlyFee.toLocaleString()}</Text>
            </View>
          </View>

          <Text style={styles.paymentMethodTitle}>Select Payment Method</Text>

          <TouchableOpacity 
            style={[
              styles.paymentMethodCard,
              styles.paymentMethodCardDisabled,
              selectedPaymentMethod === 'Credit Card' && styles.paymentMethodCardActive
            ]}
            onPress={() => setSelectedPaymentMethod('Credit Card')}
          >
            <View style={styles.paymentMethodIcon}>
              <Text style={styles.paymentMethodIconText}>💳</Text>
            </View>
            <View style={styles.paymentMethodContent}>
              <Text style={styles.paymentMethodName}>Credit/Debit Card</Text>
              <Text style={styles.paymentMethodDesc}>Coming Soon</Text>
            </View>
            <View style={[
              styles.paymentMethodRadio,
              selectedPaymentMethod === 'Credit Card' && styles.paymentMethodRadioActive
            ]}>
              {selectedPaymentMethod === 'Credit Card' && <View style={styles.paymentMethodRadioDot} />}
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.paymentMethodCard,
              selectedPaymentMethod === 'Bank Transfer' && styles.paymentMethodCardActive
            ]}
            onPress={() => setSelectedPaymentMethod('Bank Transfer')}
          >
            <View style={styles.paymentMethodIcon}>
              <Text style={styles.paymentMethodIconText}>🏦</Text>
            </View>
            <View style={styles.paymentMethodContent}>
              <Text style={styles.paymentMethodName}>Bank Transfer</Text>
              <Text style={styles.paymentMethodDesc}>Direct bank transfer</Text>
            </View>
            <View style={[
              styles.paymentMethodRadio,
              selectedPaymentMethod === 'Bank Transfer' && styles.paymentMethodRadioActive
            ]}>
              {selectedPaymentMethod === 'Bank Transfer' && <View style={styles.paymentMethodRadioDot} />}
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.paymentMethodCard,
              styles.paymentMethodCardDisabled,
              selectedPaymentMethod === 'Mobile Wallet' && styles.paymentMethodCardActive
            ]}
            onPress={() => setSelectedPaymentMethod('Mobile Wallet')}
          >
            <View style={styles.paymentMethodIcon}>
              <Text style={styles.paymentMethodIconText}>📱</Text>
            </View>
            <View style={styles.paymentMethodContent}>
              <Text style={styles.paymentMethodName}>Mobile Wallet</Text>
              <Text style={styles.paymentMethodDesc}>Coming Soon</Text>
            </View>
            <View style={[
              styles.paymentMethodRadio,
              selectedPaymentMethod === 'Mobile Wallet' && styles.paymentMethodRadioActive
            ]}>
              {selectedPaymentMethod === 'Mobile Wallet' && <View style={styles.paymentMethodRadioDot} />}
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.paymentMethodCard,
              selectedPaymentMethod === 'Cash' && styles.paymentMethodCardActive
            ]}
            onPress={() => setSelectedPaymentMethod('Cash')}
          >
            <View style={styles.paymentMethodIcon}>
              <Text style={styles.paymentMethodIconText}>💵</Text>
            </View>
            <View style={styles.paymentMethodContent}>
              <Text style={styles.paymentMethodName}>Cash Payment</Text>
              <Text style={styles.paymentMethodDesc}>Pay to driver directly</Text>
            </View>
            <View style={[
              styles.paymentMethodRadio,
              selectedPaymentMethod === 'Cash' && styles.paymentMethodRadioActive
            ]}>
              {selectedPaymentMethod === 'Cash' && <View style={styles.paymentMethodRadioDot} />}
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.payNowButton} onPress={handlePayment}>
            <Text style={styles.payNowButtonText}>Pay Now</Text>
          </TouchableOpacity>

          <View style={styles.paymentNoteCard}>
            <Text style={styles.paymentNoteTitle}>Note:</Text>
            <Text style={styles.paymentNoteText}>
              This is a demo payment system. No actual payment will be processed. In production, this would integrate with real payment gateways.
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Driver Dashboard
  if (currentScreen === 'DriverDashboard') {
    return (
      <View style={styles.dashboard}>
        <StatusBar barStyle="light-content" />
        <View style={styles.dashHeaderModern}>
          <View style={styles.dashHeaderTop}>
            <View>
              <Text style={styles.greetingModern}>Welcome Back</Text>
              <Text style={styles.userNameModern}>{user?.name}</Text>
            </View>
            <TouchableOpacity style={styles.profileIconBtn} onPress={viewDriverProfile}>
              <View style={styles.profileIconCircle}>
                <Text style={styles.profileIconText}>{user?.name?.charAt(0).toUpperCase()}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.dashContentModern}>
          <View style={styles.routeCardPremium}>
            <View style={styles.routeCardPremiumHeader}>
              <View style={styles.routeIconCircle}>
                <Image source={require('./assets/icons8-bus.png')} style={styles.busIcon} resizeMode="contain" />
              </View>
              <View style={styles.routeCardPremiumContent}>
                <Text style={styles.routeCardPremiumLabel}>ASSIGNED ROUTE</Text>
                <Text style={styles.routeCardPremiumTitle}>{user?.assignedRoute}</Text>
              </View>
            </View>
          </View>

          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={styles.gridCard} onPress={loadStudents}>
              <View style={styles.gridCardIcon}>
                <Image source={require('./assets/icons8-student.png')} style={styles.gridIconImage} resizeMode="contain" />
              </View>
              <Text style={styles.gridCardTitle}>Students</Text>
              <Text style={styles.gridCardSub}>Manage attendance</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.gridCard} onPress={loadAttendanceReport}>
              <View style={styles.gridCardIcon}>
                <Image source={require('./assets/icons8-attendance.png')} style={styles.gridIconImage} resizeMode="contain" />
              </View>
              <Text style={styles.gridCardTitle}>Attendance</Text>
              <Text style={styles.gridCardSub}>View reports</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.gridCard} onPress={openCalendar}>
              <View style={styles.gridCardIcon}>
                <Image source={require('./assets/icons8-date.png')} style={styles.gridIconImage} resizeMode="contain" />
              </View>
              <Text style={styles.gridCardTitle}>Calendar</Text>
              <Text style={styles.gridCardSub}>History & dates</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.gridCard} onPress={openMap}>
              <View style={styles.gridCardIcon}>
                <Image source={require('./assets/icons8-map.png')} style={styles.gridIconImage} resizeMode="contain" />
              </View>
              <Text style={styles.gridCardTitle}>Route Map</Text>
              <Text style={styles.gridCardSub}>View navigation</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.logoutBtnModern} onPress={handleLogout}>
            <Text style={styles.logoutTextModern}>Sign Out</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  // Students List Screen
  if (currentScreen === 'StudentsList') {
    return (
      <View style={styles.dashboard}>
        <StatusBar barStyle="light-content" />
        <View style={styles.dashHeader}>
          <TouchableOpacity onPress={() => setCurrentScreen('DriverDashboard')}>
            <Text style={styles.backBtn}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Students</Text>
        </View>

        <ScrollView style={styles.dashContent}>
          <Text style={styles.studentCount}>Total Students: {attendanceData.length}</Text>
          
          <View style={styles.sessionSection}>
            <Text style={styles.sessionTitle}>Morning Session</Text>
            {attendanceData.length === 0 ? (
              <Text style={styles.emptyText}>No students on your route yet</Text>
            ) : (
              attendanceData.map((item, index) => (
                <View key={index} style={styles.studentCardExpanded}>
                  <View style={styles.studentHeader}>
                    <Text style={styles.studentName}>{item.student.childName}</Text>
                    <Text style={styles.studentClass}>{item.student.childClass}</Text>
                  </View>
                  <Text style={styles.studentInfo}>Parent: {item.student.parentName}</Text>
                  <Text style={styles.studentInfo}>ID: {item.student.studentId}</Text>
                  
                  <View style={styles.buttonRow}>
                    <TouchableOpacity 
                      style={[
                        styles.actionBtn,
                        item.attendance.morningPickup.status === 'picked' && styles.actionBtnSuccess
                      ]}
                      onPress={() => markAction(item.student._id, 'morning-pickup')}
                      disabled={item.attendance.isAbsent || item.attendance.morningPickup.status === 'picked'}
                    >
                      <Text style={styles.actionBtnText}>
                        {item.attendance.morningPickup.status === 'picked' ? 'Picked Up' : 'Pick Up'}
                      </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[
                        styles.actionBtnAbsent,
                        item.attendance.isAbsent && styles.actionBtnAbsentActive
                      ]}
                      onPress={() => markAction(item.student._id, 'absent')}
                      disabled={item.attendance.isAbsent || item.attendance.morningPickup.status === 'picked'}
                    >
                      <Text style={styles.actionBtnText}>
                        {item.attendance.isAbsent ? 'Absent' : 'Absent'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>

          <View style={styles.sessionSection}>
            <Text style={styles.sessionTitle}>Evening Session</Text>
            {attendanceData.map((item, index) => (
              <View key={index} style={styles.studentCardExpanded}>
                <View style={styles.studentHeader}>
                  <Text style={styles.studentName}>{item.student.childName}</Text>
                  <Text style={styles.studentClass}>{item.student.childClass}</Text>
                </View>
                
                <View style={styles.buttonRow}>
                  <TouchableOpacity 
                    style={[
                      styles.actionBtn,
                      item.attendance.eveningDropoff.status === 'dropped' && styles.actionBtnSuccess
                    ]}
                    onPress={() => markAction(item.student._id, 'evening-dropoff')}
                    disabled={item.attendance.isAbsent || item.attendance.eveningDropoff.status === 'dropped'}
                  >
                    <Text style={styles.actionBtnText}>
                      {item.attendance.eveningDropoff.status === 'dropped' ? 'Dropped Off' : 'Drop Off'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }

  // Attendance Report Screen
  if (currentScreen === 'AttendanceReport') {
    const displayDate = selectedDate ? new Date(selectedDate) : new Date();
    
    const markedStudents = attendanceReport.filter(item => item.status !== 'Not Marked');
    const presentStudents = markedStudents.filter(item => item.status === 'Present');
    const absentStudents = markedStudents.filter(item => item.status === 'Absent');
    
    return (
      <View style={styles.dashboard}>
        <StatusBar barStyle="light-content" />
        <View style={styles.dashHeader}>
          <TouchableOpacity onPress={() => setCurrentScreen(selectedDate ? 'Calendar' : 'DriverDashboard')}>
            <Text style={styles.backBtn}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Attendance Report</Text>
        </View>

        <ScrollView style={styles.dashContent}>
          <Text style={styles.reportDate}>Date: {displayDate.toLocaleDateString()}</Text>
          
          {markedStudents.length === 0 ? (
            <Text style={styles.emptyText}>No attendance marked for this date</Text>
          ) : (
            <>
              {presentStudents.length > 0 && (
                <View style={styles.attendanceSection}>
                  <Text style={styles.attendanceSectionTitle}>Present ({presentStudents.length})</Text>
                  {presentStudents.map((item, index) => (
                    <View key={index} style={styles.reportCard}>
                      <View style={styles.reportHeader}>
                        <Text style={styles.reportName}>{item.student.childName}</Text>
                        <View style={styles.statusPresent}>
                          <Text style={styles.statusText}>Present</Text>
                        </View>
                      </View>
                      <Text style={styles.reportInfo}>Class: {item.student.childClass}</Text>
                      <Text style={styles.reportInfo}>Parent: {item.student.parentName}</Text>
                      
                      <View style={styles.attendanceTimesSection}>
                        {item.morningPickupTime && (
                          <View style={styles.attendanceTimeRow}>
                            <Text style={styles.attendanceTimeLabel}>Morning Pickup:</Text>
                            <Text style={styles.attendanceTimeValue}>
                              {new Date(item.morningPickupTime).toLocaleTimeString()}
                            </Text>
                          </View>
                        )}
                        {item.eveningDropoffTime && (
                          <View style={styles.attendanceTimeRow}>
                            <Text style={styles.attendanceTimeLabel}>Evening Dropoff:</Text>
                            <Text style={styles.attendanceTimeValue}>
                              {new Date(item.eveningDropoffTime).toLocaleTimeString()}
                            </Text>
                          </View>
                        )}
                        {!item.eveningDropoffTime && item.eveningDropoffStatus === 'pending' && (
                          <View style={styles.attendanceTimeRow}>
                            <Text style={styles.attendanceTimeLabel}>Evening Dropoff:</Text>
                            <Text style={[styles.attendanceTimeValue, {color: '#ffa500'}]}>Pending</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {absentStudents.length > 0 && (
                <View style={styles.attendanceSection}>
                  <Text style={styles.attendanceSectionTitle}>Absent ({absentStudents.length})</Text>
                  {absentStudents.map((item, index) => (
                    <View key={index} style={styles.reportCard}>
                      <View style={styles.reportHeader}>
                        <Text style={styles.reportName}>{item.student.childName}</Text>
                        <View style={styles.statusAbsent}>
                          <Text style={styles.statusText}>Absent</Text>
                        </View>
                      </View>
                      <Text style={styles.reportInfo}>Class: {item.student.childClass}</Text>
                      <Text style={styles.reportInfo}>Parent: {item.student.parentName}</Text>
                    </View>
                  ))}
                </View>
              )}
            </>
          )}
        </ScrollView>
      </View>
    );
  }

  // Calendar Screen
  if (currentScreen === 'Calendar') {
    const today = new Date().toISOString().split('T')[0];
    
    return (
      <View style={styles.dashboard}>
        <StatusBar barStyle="light-content" />
        <View style={styles.dashHeader}>
          <TouchableOpacity onPress={() => setCurrentScreen('DriverDashboard')}>
            <Text style={styles.backBtn}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Attendance Calendar</Text>
        </View>

        <ScrollView style={styles.dashContent}>
          <View style={styles.calendarCard}>
            <Calendar
              onDayPress={(day) => {
                setSelectedDate(day.dateString);
              }}
              markedDates={{
                [today]: {
                  marked: true,
                  dotColor: '#023e8a',
                  selected: selectedDate === today,
                  selectedColor: '#023e8a'
                },
                [selectedDate]: {
                  selected: true,
                  selectedColor: '#023e8a'
                }
              }}
              theme={{
                backgroundColor: '#ffffff',
                calendarBackground: '#ffffff',
                textSectionTitleColor: '#023e8a',
                selectedDayBackgroundColor: '#023e8a',
                selectedDayTextColor: '#ffffff',
                todayTextColor: '#023e8a',
                dayTextColor: '#333',
                textDisabledColor: '#d9d9d9',
                dotColor: '#023e8a',
                selectedDotColor: '#ffffff',
                arrowColor: '#023e8a',
                monthTextColor: '#333',
                textDayFontWeight: '500',
                textMonthFontWeight: 'bold',
                textDayHeaderFontWeight: '600',
                textDayFontSize: 16,
                textMonthFontSize: 18,
                textDayHeaderFontSize: 14
              }}
            />
          </View>

          {selectedDate && (
            <View style={styles.dateInfoCard}>
              <Text style={styles.dateInfoTitle}>
                {selectedDate === today ? 'Today' : 'Selected Date'}
              </Text>
              <Text style={styles.dateInfoText}>{new Date(selectedDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</Text>
              <TouchableOpacity 
                style={styles.viewAttendanceBtn}
                onPress={() => viewAttendanceForDate(selectedDate)}
              >
                <Text style={styles.viewAttendanceBtnText}>View Attendance</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.legendCard}>
            <Text style={styles.legendTitle}>Legend</Text>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#023e8a' }]} />
              <Text style={styles.legendText}>Today / Selected Date</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#43e97b' }]} />
              <Text style={styles.legendText}>All Present</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#ffa500' }]} />
              <Text style={styles.legendText}>Partial Attendance</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#ff6b6b' }]} />
              <Text style={styles.legendText}>No Attendance</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Map Screen
  if (currentScreen === 'Map') {
    // Route information with coordinates
    const routeInfo = {
      'Puttalam Town to Kurunegala': {
        start: { name: 'Puttalam Town', lat: 8.0362, lng: 79.8283 },
        end: { name: 'Kurunegala', lat: 7.4863, lng: 80.3623 },
        distance: '~85 km',
        duration: '~2 hours'
      },
      'Kandy Town to Kurunegala': {
        start: { name: 'Kandy Town', lat: 7.2906, lng: 80.6337 },
        end: { name: 'Kurunegala', lat: 7.4863, lng: 80.3623 },
        distance: '~42 km',
        duration: '~1 hour'
      },
      'Matale Town to Kurunegala': {
        start: { name: 'Matale Town', lat: 7.4675, lng: 80.6234 },
        end: { name: 'Kurunegala', lat: 7.4863, lng: 80.3623 },
        distance: '~35 km',
        duration: '~45 minutes'
      },
      'Ibbagamuwa Town to Kurunegala': {
        start: { name: 'Ibbagamuwa Town', lat: 7.6167, lng: 80.2833 },
        end: { name: 'Kurunegala', lat: 7.4863, lng: 80.3623 },
        distance: '~18 km',
        duration: '~25 minutes'
      },
      'Polgahawela to Kurunegala': {
        start: { name: 'Polgahawela', lat: 7.3333, lng: 80.3000 },
        end: { name: 'Kurunegala', lat: 7.4863, lng: 80.3623 },
        distance: '~20 km',
        duration: '~30 minutes'
      }
    };

    const route = routeInfo[user?.assignedRoute];

    const openInGoogleMaps = () => {
      if (route) {
        const url = `https://www.google.com/maps/dir/${route.start.lat},${route.start.lng}/${route.end.lat},${route.end.lng}`;
        Linking.openURL(url);
      }
    };

    return (
      <View style={styles.dashboard}>
        <StatusBar barStyle="light-content" />
        <View style={styles.dashHeader}>
          <TouchableOpacity onPress={() => setCurrentScreen('DriverDashboard')}>
            <Text style={styles.backBtn}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Route Map</Text>
        </View>

        <ScrollView style={styles.dashContent}>
          <View style={styles.routeInfoCard}>
            <Text style={styles.routeInfoTitle}>Your Route</Text>
            <Text style={styles.routeInfoRoute}>{user?.assignedRoute}</Text>
          </View>

          {route && (
            <>
              <View style={styles.locationCard}>
                <View style={styles.locationHeader}>
                  <View style={[styles.locationDot, { backgroundColor: '#43e97b' }]} />
                  <Text style={styles.locationTitle}>Start Point</Text>
                </View>
                <Text style={styles.locationName}>{route.start.name}</Text>
                <Text style={styles.locationCoords}>
                  {route.start.lat.toFixed(4)}, {route.start.lng.toFixed(4)}
                </Text>
              </View>

              <View style={styles.routeArrow}>
                <Text style={styles.routeArrowText}>↓</Text>
                <View style={styles.routeStats}>
                  <Text style={styles.routeStatText}>{route.distance}</Text>
                  <Text style={styles.routeStatText}>{route.duration}</Text>
                </View>
              </View>

              <View style={styles.locationCard}>
                <View style={styles.locationHeader}>
                  <View style={[styles.locationDot, { backgroundColor: '#023e8a' }]} />
                  <Text style={styles.locationTitle}>End Point (School)</Text>
                </View>
                <Text style={styles.locationName}>{route.end.name}</Text>
                <Text style={styles.locationCoords}>
                  {route.end.lat.toFixed(4)}, {route.end.lng.toFixed(4)}
                </Text>
              </View>

              <TouchableOpacity style={styles.openMapBtn} onPress={openInGoogleMaps}>
                <Text style={styles.openMapBtnText}>Open in Google Maps</Text>
              </TouchableOpacity>

              <View style={styles.mapTipCard}>
                <Text style={styles.mapTipTitle}>Navigation Tip</Text>
                <Text style={styles.mapTipText}>
                  Tap "Open in Google Maps" to get turn-by-turn navigation and real-time traffic updates for your route.
                </Text>
              </View>
            </>
          )}
        </ScrollView>
      </View>
    );
  }

  // Admin Dashboard
  if (currentScreen === 'AdminDashboard') {
    return (
      <View style={styles.dashboard}>
        <StatusBar barStyle="light-content" />
        <View style={styles.dashHeaderModern}>
          <View style={styles.dashHeaderTop}>
            <View>
              <Text style={styles.greetingModern}>Admin Panel</Text>
              <Text style={styles.userNameModern}>{user?.name}</Text>
            </View>
            <TouchableOpacity style={styles.profileIconBtn} onPress={handleLogout}>
              <View style={styles.profileIconCircle}>
                <Text style={styles.profileIconText}>{user?.name?.charAt(0).toUpperCase()}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.dashContentModern}>
          {adminStats && (
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{adminStats.totalStudents}</Text>
                <Text style={styles.statLabel}>Total Students</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{adminStats.totalDrivers}</Text>
                <Text style={styles.statLabel}>Total Drivers</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{adminStats.totalParents}</Text>
                <Text style={styles.statLabel}>Total Parents</Text>
              </View>
            </View>
          )}

          {adminStats?.today && (
            <View style={styles.todayCard}>
              <Text style={styles.todayTitle}>Today's Attendance</Text>
              <Text style={styles.todayDate}>{new Date(adminStats.today.date).toLocaleDateString()}</Text>
              <View style={styles.todayStats}>
                <View style={styles.todayStatItem}>
                  <Text style={[styles.todayStatNumber, {color: '#29bf12'}]}>{adminStats.today.present}</Text>
                  <Text style={styles.todayStatLabel}>Present</Text>
                </View>
                <View style={styles.todayStatItem}>
                  <Text style={[styles.todayStatNumber, {color: '#ff6b6b'}]}>{adminStats.today.absent}</Text>
                  <Text style={styles.todayStatLabel}>Absent</Text>
                </View>
                <View style={styles.todayStatItem}>
                  <Text style={[styles.todayStatNumber, {color: '#ffa500'}]}>{adminStats.today.notMarked}</Text>
                  <Text style={styles.todayStatLabel}>Not Marked</Text>
                </View>
              </View>
            </View>
          )}

          <TouchableOpacity style={styles.adminActionCard} onPress={loadAdminReports}>
            <View style={styles.adminActionIcon}>
              <Text style={styles.adminActionIconText}>📊</Text>
            </View>
            <View style={styles.adminActionContent}>
              <Text style={styles.adminActionTitle}>Attendance Reports</Text>
              <Text style={styles.adminActionSub}>View all attendance by date</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutBtnModern} onPress={handleLogout}>
            <Text style={styles.logoutTextModern}>Sign Out</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  // Admin Reports Screen
  if (currentScreen === 'AdminReports') {
    return (
      <View style={styles.dashboard}>
        <StatusBar barStyle="light-content" />
        <View style={styles.dashHeader}>
          <TouchableOpacity onPress={() => setCurrentScreen('AdminDashboard')}>
            <Text style={styles.backBtn}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Attendance Reports</Text>
        </View>

        <ScrollView style={styles.dashContent}>
          {adminReports.length === 0 ? (
            <Text style={styles.emptyText}>No reports available</Text>
          ) : (
            adminReports.map((report, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.reportDateCard}
                onPress={() => loadReportDetails(report.date)}
              >
                <View style={styles.reportDateHeader}>
                  <Text style={styles.reportDateTitle}>{new Date(report.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</Text>
                  <Text style={styles.arrow}>›</Text>
                </View>
                <View style={styles.reportDateStats}>
                  <View style={styles.reportDateStat}>
                    <Text style={[styles.reportDateStatNumber, {color: '#29bf12'}]}>{report.present}</Text>
                    <Text style={styles.reportDateStatLabel}>Present</Text>
                  </View>
                  <View style={styles.reportDateStat}>
                    <Text style={[styles.reportDateStatNumber, {color: '#ff6b6b'}]}>{report.absent}</Text>
                    <Text style={styles.reportDateStatLabel}>Absent</Text>
                  </View>
                  <View style={styles.reportDateStat}>
                    <Text style={styles.reportDateStatNumber}>{report.totalStudents}</Text>
                    <Text style={styles.reportDateStatLabel}>Total</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>
    );
  }

  // Admin Report Details Screen
  if (currentScreen === 'AdminReportDetails') {
    return (
      <View style={styles.dashboard}>
        <StatusBar barStyle="light-content" />
        <View style={styles.dashHeader}>
          <TouchableOpacity onPress={() => setCurrentScreen('AdminReports')}>
            <Text style={styles.backBtn}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Report Details</Text>
        </View>

        <ScrollView style={styles.dashContent}>
          {reportDetails && (
            <>
              <View style={styles.reportDetailsHeader}>
                <Text style={styles.reportDetailsDate}>{new Date(reportDetails.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</Text>
                <View style={styles.reportDetailsSummary}>
                  <View style={styles.reportDetailsStat}>
                    <Text style={[styles.reportDetailsStatNumber, {color: '#29bf12'}]}>{reportDetails.present}</Text>
                    <Text style={styles.reportDetailsStatLabel}>Present</Text>
                  </View>
                  <View style={styles.reportDetailsStat}>
                    <Text style={[styles.reportDetailsStatNumber, {color: '#ff6b6b'}]}>{reportDetails.absent}</Text>
                    <Text style={styles.reportDetailsStatLabel}>Absent</Text>
                  </View>
                  <View style={styles.reportDetailsStat}>
                    <Text style={[styles.reportDetailsStatNumber, {color: '#ffa500'}]}>{reportDetails.notMarked}</Text>
                    <Text style={styles.reportDetailsStatLabel}>Not Marked</Text>
                  </View>
                </View>
              </View>

              {reportDetails.records.map((record, index) => (
                <View key={index} style={styles.adminStudentCard}>
                  <View style={styles.adminStudentHeader}>
                    <Text style={styles.adminStudentName}>{record.studentName}</Text>
                    <View style={[
                      styles.adminStatusBadge,
                      record.status === 'Present' && styles.statusPresent,
                      record.status === 'Absent' && styles.statusAbsent,
                      record.status === 'Not Marked' && styles.statusPending
                    ]}>
                      <Text style={styles.statusText}>{record.status}</Text>
                    </View>
                  </View>
                  <Text style={styles.adminStudentInfo}>Class: {record.studentClass}</Text>
                  <Text style={styles.adminStudentInfo}>Parent: {record.parentName}</Text>
                  <Text style={styles.adminStudentInfo}>Driver: {record.driverName}</Text>
                  <Text style={styles.adminStudentInfo}>Route: {record.route}</Text>
                  {record.morningPickupTime && (
                    <Text style={styles.adminStudentInfo}>Pickup: {new Date(record.morningPickupTime).toLocaleTimeString()}</Text>
                  )}
                  {record.eveningDropoffTime && (
                    <Text style={styles.adminStudentInfo}>Dropoff: {new Date(record.eveningDropoffTime).toLocaleTimeString()}</Text>
                  )}
                </View>
              ))}
            </>
          )}
        </ScrollView>
      </View>
    );
  }

  // Parent Profile Screen
  if (currentScreen === 'ParentProfile') {
    return (
      <View style={styles.dashboard}>
        <StatusBar barStyle="light-content" />
        <View style={styles.dashHeader}>
          <TouchableOpacity onPress={() => setCurrentScreen('ParentDashboard')}>
            <Text style={styles.backBtn}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Profile</Text>
        </View>

        <ScrollView style={styles.dashContent}>
          <View style={styles.profileCard}>
            <View style={styles.profileAvatarContainer}>
              <View style={styles.profileAvatar}>
                <Text style={styles.profileAvatarText}>{user?.name?.charAt(0).toUpperCase()}</Text>
              </View>
            </View>
            <Text style={styles.profileName}>{user?.name}</Text>
            <Text style={styles.profileRole}>Parent</Text>
          </View>

          <View style={styles.profileSection}>
            <Text style={styles.profileSectionTitle}>Personal Information</Text>
            
            <View style={styles.profileInfoCard}>
              <View style={styles.profileInfoRow}>
                <Text style={styles.profileInfoLabel}>Email</Text>
                <Text style={styles.profileInfoValue}>{user?.email}</Text>
              </View>
              
              <View style={styles.profileInfoRow}>
                <Text style={styles.profileInfoLabel}>Role</Text>
                <Text style={styles.profileInfoValue}>Parent</Text>
              </View>
            </View>
          </View>

          <View style={styles.profileSection}>
            <Text style={styles.profileSectionTitle}>Child Information</Text>
            
            <View style={styles.profileInfoCard}>
              <View style={styles.profileInfoRow}>
                <Text style={styles.profileInfoLabel}>Child Name</Text>
                <Text style={styles.profileInfoValue}>{user?.childName || 'Not provided'}</Text>
              </View>
              
              <View style={styles.profileInfoRow}>
                <Text style={styles.profileInfoLabel}>Class</Text>
                <Text style={styles.profileInfoValue}>{user?.childClass || 'Not provided'}</Text>
              </View>
              
              <View style={styles.profileInfoRow}>
                <Text style={styles.profileInfoLabel}>Route</Text>
                <Text style={styles.profileInfoValue}>{user?.selectedRoute || 'Not assigned'}</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Driver Profile Screen
  if (currentScreen === 'DriverProfile') {
    return (
      <View style={styles.dashboard}>
        <StatusBar barStyle="light-content" />
        <View style={styles.dashHeader}>
          <TouchableOpacity onPress={() => setCurrentScreen('DriverDashboard')}>
            <Text style={styles.backBtn}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Profile</Text>
        </View>

        <ScrollView style={styles.dashContent}>
          <View style={styles.profileCard}>
            <View style={styles.profileAvatarContainer}>
              <View style={styles.profileAvatar}>
                <Text style={styles.profileAvatarText}>{user?.name?.charAt(0).toUpperCase()}</Text>
              </View>
            </View>
            <Text style={styles.profileName}>{user?.name}</Text>
            <Text style={styles.profileRole}>Professional Driver</Text>
          </View>

          <View style={styles.profileSection}>
            <Text style={styles.profileSectionTitle}>Personal Information</Text>
            
            <View style={styles.profileInfoCard}>
              <View style={styles.profileInfoRow}>
                <Text style={styles.profileInfoLabel}>Email</Text>
                <Text style={styles.profileInfoValue}>{user?.email}</Text>
              </View>
              
              <View style={styles.profileInfoRow}>
                <Text style={styles.profileInfoLabel}>Phone Number</Text>
                <Text style={styles.profileInfoValue}>{user?.phoneNumber || 'Not provided'}</Text>
              </View>
              
              <View style={styles.profileInfoRow}>
                <Text style={styles.profileInfoLabel}>NIC Number</Text>
                <Text style={styles.profileInfoValue}>{user?.nicNumber || 'Not provided'}</Text>
              </View>
              
              <View style={styles.profileInfoRow}>
                <Text style={styles.profileInfoLabel}>Date of Birth</Text>
                <Text style={styles.profileInfoValue}>
                  {user?.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'Not provided'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.profileSection}>
            <Text style={styles.profileSectionTitle}>Route Information</Text>
            
            <View style={styles.profileInfoCard}>
              <View style={styles.profileInfoRow}>
                <Text style={styles.profileInfoLabel}>Assigned Route</Text>
                <Text style={styles.profileInfoValue}>{user?.assignedRoute}</Text>
              </View>
              
              <View style={styles.profileInfoRow}>
                <Text style={styles.profileInfoLabel}>Status</Text>
                <View style={styles.profileStatusBadge}>
                  <Text style={styles.profileStatusText}>Active</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.profileSection}>
            <Text style={styles.profileSectionTitle}>License Information</Text>
            
            <View style={styles.profileInfoCard}>
              <View style={styles.profileInfoRow}>
                <Text style={styles.profileInfoLabel}>Driver License</Text>
                <Text style={styles.profileInfoValue}>
                  {user?.driverLicenseImage !== 'pending_upload' ? 'Verified' : 'Pending Upload'}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#023e8a',
  },
  header: {
    flex: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  headerSmall: {
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: 'center',
  },
  logo: {
    fontSize: 80,
    marginBottom: 20,
    display: 'none',
  },
  logoImage: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  logoSmall: {
    fontSize: 60,
    marginBottom: 10,
    display: 'none',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    fontFamily: 'ClashGrotesk-Bold',
  },
  titleSmall: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'ClashGrotesk-Bold',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    fontFamily: 'ClashGrotesk-Regular',
  },
  form: {
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 30,
    paddingTop: 40,
    flex: 1.2,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f7fa',
    borderRadius: 15,
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  icon: {
    fontSize: 24,
    marginRight: 10,
    display: 'none',
  },
  input: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    color: '#333',
    fontFamily: 'ClashGrotesk-Regular',
  },
  dateText: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    color: '#333',
    fontFamily: 'ClashGrotesk-Regular',
  },
  button: {
    backgroundColor: '#023e8a',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'ClashGrotesk-Bold',
  },
  link: {
    color: '#023e8a',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'ClashGrotesk-Semibold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 25,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    marginHorizontal: 15,
    color: '#999',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'ClashGrotesk-Medium',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    marginBottom: 10,
  },
  socialBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f5f7fa',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  socialIcon: {
    fontSize: 24,
    color: '#666',
  },
  socialIconImage: {
    width: 28,
    height: 28,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    marginTop: 10,
    fontFamily: 'ClashGrotesk-Semibold',
  },
  roleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  roleBtn: {
    width: '48%',
    padding: 20,
    borderRadius: 15,
    backgroundColor: '#f5f7fa',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#f5f7fa',
  },
  roleBtnActive: {
    backgroundColor: '#e8f4f8',
    borderColor: '#023e8a',
  },
  roleEmoji: {
    fontSize: 36,
    marginBottom: 8,
    display: 'none',
  },
  roleText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
    fontFamily: 'ClashGrotesk-Semibold',
  },
  roleTextActive: {
    color: '#023e8a',
    fontFamily: 'ClashGrotesk-Semibold',
  },
  section: {
    marginTop: 10,
  },
  childrenList: {
    marginBottom: 20,
  },
  childrenListTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#023e8a',
    marginBottom: 10,
    fontFamily: 'ClashGrotesk-Semibold',
  },
  childCard: {
    backgroundColor: '#e8f4f8',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#023e8a',
  },
  childCardContent: {
    flex: 1,
  },
  childCardName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#023e8a',
    marginBottom: 4,
    fontFamily: 'ClashGrotesk-Semibold',
  },
  childCardDetails: {
    fontSize: 13,
    color: '#666',
    fontFamily: 'ClashGrotesk-Regular',
  },
  removeChildBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ff6b6b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeChildText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addChildTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    marginTop: 10,
    fontFamily: 'ClashGrotesk-Semibold',
  },
  addChildButton: {
    backgroundColor: '#29bf12',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 10,
  },
  addChildButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'ClashGrotesk-Bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    fontFamily: 'ClashGrotesk-Bold',
  },
  pickerBox: {
    backgroundColor: '#f5f7fa',
    borderRadius: 15,
    marginBottom: 10,
    overflow: 'hidden',
  },
  picker: {
    height: Platform.OS === 'ios' ? 180 : 50,
  },
  pickerItem: {
    height: Platform.OS === 'ios' ? 180 : 50,
    fontSize: 16,
  },
  routeCard: {
    backgroundColor: '#f5f7fa',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#f5f7fa',
  },
  routeCardActive: {
    backgroundColor: '#e8f4f8',
    borderColor: '#023e8a',
  },
  routeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ccc',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircleActive: {
    borderColor: '#023e8a',
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#023e8a',
  },
  routeText: {
    fontSize: 15,
    color: '#666',
    flex: 1,
    fontFamily: 'ClashGrotesk-Regular',
  },
  routeTextActive: {
    color: '#023e8a',
    fontWeight: '600',
    fontFamily: 'ClashGrotesk-Semibold',
  },
  dashboard: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  dashHeader: {
    backgroundColor: '#023e8a',
    padding: 25,
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  parentHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    fontFamily: 'ClashGrotesk-Regular',
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 5,
    fontFamily: 'ClashGrotesk-Bold',
  },
  userRole: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 5,
    fontFamily: 'ClashGrotesk-Regular',
  },
  backBtn: {
    color: 'white',
    fontSize: 18,
    marginBottom: 10,
    fontFamily: 'ClashGrotesk-Medium',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'ClashGrotesk-Bold',
  },
  dashContent: {
    flex: 1,
    padding: 20,
  },
  infoCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
  },
  introCard: {
    backgroundColor: '#e8f4f8',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#023e8a',
  },
  introText: {
    fontSize: 15,
    color: '#333',
    textAlign: 'center',
    lineHeight: 22,
    fontFamily: 'ClashGrotesk-Regular',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
    fontFamily: 'ClashGrotesk-Semibold',
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
    fontFamily: 'ClashGrotesk-Regular',
  },
  childInfoItem: {
    marginBottom: 10,
  },
  childInfoName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#023e8a',
    marginBottom: 5,
    fontFamily: 'ClashGrotesk-Semibold',
  },
  childDivider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 10,
  },
  actionCard: {
    backgroundColor: '#023e8a',
    padding: 18,
    borderRadius: 15,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 32,
    marginRight: 15,
    display: 'none',
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: 'white',
    fontFamily: 'ClashGrotesk-Medium',
  },
  actionSub: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
    fontFamily: 'ClashGrotesk-Regular',
  },
  arrow: {
    fontSize: 28,
    color: 'white',
  },
  howToUseCard: {
    backgroundColor: 'white',
    padding: 18,
    borderRadius: 15,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#023e8a',
  },
  howToUseContent: {
    flex: 1,
  },
  howToUseTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#023e8a',
    fontFamily: 'ClashGrotesk-Medium',
  },
  howToUseSub: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
    fontFamily: 'ClashGrotesk-Regular',
  },
  howToUseArrow: {
    fontSize: 28,
    color: '#023e8a',
  },
  contactCard: {
    backgroundColor: '#29bf12',
    padding: 18,
    borderRadius: 15,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactContent: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: 'white',
    fontFamily: 'ClashGrotesk-Medium',
  },
  contactSub: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
    fontFamily: 'ClashGrotesk-Regular',
  },
  contactArrow: {
    fontSize: 28,
    color: 'white',
  },
  callButton: {
    backgroundColor: '#29bf12',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  callButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'ClashGrotesk-Bold',
  },
  guideCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
  },
  guideTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#023e8a',
    marginBottom: 10,
    fontFamily: 'ClashGrotesk-Semibold',
  },
  guideStepNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#023e8a',
    marginBottom: 10,
    fontFamily: 'ClashGrotesk-Bold',
  },
  guideStepTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    fontFamily: 'ClashGrotesk-Semibold',
  },
  guideText: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    marginBottom: 8,
    fontFamily: 'ClashGrotesk-Regular',
  },
  guideBullet: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginLeft: 10,
    marginBottom: 5,
    fontFamily: 'ClashGrotesk-Regular',
  },
  logoutBtn: {
    backgroundColor: '#fff5f5',
    padding: 18,
    borderRadius: 15,
    marginTop: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ffe0e0',
  },
  logoutText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#dc3545',
    fontFamily: 'ClashGrotesk-Semibold',
  },
  driverCard: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
  },
  driverIcon: {
    fontSize: 60,
    marginBottom: 15,
    display: 'none',
  },
  driverName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    fontFamily: 'ClashGrotesk-Bold',
  },
  driverDetail: {
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailLabel: {
    fontSize: 16,
    color: '#666',
    width: 100,
    fontFamily: 'ClashGrotesk-Regular',
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    flex: 1,
    fontFamily: 'ClashGrotesk-Semibold',
  },
  studentCount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#023e8a',
    marginBottom: 15,
    fontFamily: 'ClashGrotesk-Semibold',
  },
  studentCard: {
    backgroundColor: 'white',
    padding: 18,
    borderRadius: 15,
    marginBottom: 12,
  },
  studentName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    fontFamily: 'ClashGrotesk-Semibold',
  },
  studentInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    fontFamily: 'ClashGrotesk-Regular',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 40,
    fontFamily: 'ClashGrotesk-Regular',
  },
  selectedRouteText: {
    fontSize: 14,
    color: '#667eea',
    marginBottom: 15,
    fontWeight: '600',
    paddingLeft: 5,
  },
  sessionSection: {
    marginBottom: 25,
  },
  sessionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#023e8a',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#023e8a',
    fontFamily: 'ClashGrotesk-Semibold',
  },
  studentCardExpanded: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
  },
  studentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  studentClass: {
    fontSize: 14,
    color: '#023e8a',
    fontWeight: '600',
    fontFamily: 'ClashGrotesk-Semibold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: '#023e8a',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  actionBtnSuccess: {
    backgroundColor: '#29bf12',
  },
  actionBtnAbsent: {
    flex: 1,
    backgroundColor: '#ff6b6b',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  actionBtnAbsentActive: {
    backgroundColor: '#999',
  },
  actionBtnText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'ClashGrotesk-Semibold',
  },
  reportDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'ClashGrotesk-Semibold',
  },
  reportCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
    marginBottom: 12,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  reportName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'ClashGrotesk-Semibold',
  },
  reportInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    fontFamily: 'ClashGrotesk-Regular',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusPresent: {
    backgroundColor: '#43e97b',
  },
  statusAbsent: {
    backgroundColor: '#ff6b6b',
  },
  statusPending: {
    backgroundColor: '#ffa500',
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'ClashGrotesk-Semibold',
  },
  attendanceCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
  },
  attendanceTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  attendanceTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'ClashGrotesk-Semibold',
  },
  attendanceDate: {
    fontSize: 14,
    color: '#023e8a',
    fontWeight: '600',
    fontFamily: 'ClashGrotesk-Semibold',
  },
  attendanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  attendanceLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
    fontFamily: 'ClashGrotesk-Semibold',
  },
  attendanceDetails: {
    marginTop: 5,
  },
  attendanceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  attendanceItemLabel: {
    fontSize: 15,
    color: '#666',
    fontFamily: 'ClashGrotesk-Regular',
  },
  attendanceItemValue: {
    fontSize: 15,
    color: '#999',
    fontFamily: 'ClashGrotesk-Regular',
  },
  attendanceSuccess: {
    color: '#43e97b',
    fontWeight: '600',
    fontFamily: 'ClashGrotesk-Semibold',
  },
  calendarCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 10,
    marginBottom: 15,
  },
  dateInfoCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
  },
  dateInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#023e8a',
    marginBottom: 10,
    fontFamily: 'ClashGrotesk-Semibold',
  },
  dateInfoText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 15,
    fontFamily: 'ClashGrotesk-Regular',
  },
  viewAttendanceBtn: {
    backgroundColor: '#023e8a',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  viewAttendanceBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'ClashGrotesk-Semibold',
  },
  legendCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
    fontFamily: 'ClashGrotesk-Semibold',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  legendDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 10,
  },
  legendText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'ClashGrotesk-Regular',
  },
  attendanceSection: {
    marginBottom: 20,
  },
  attendanceSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#023e8a',
    marginBottom: 12,
    paddingLeft: 5,
    fontFamily: 'ClashGrotesk-Semibold',
  },
  attendanceTimesSection: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  attendanceTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  attendanceTimeLabel: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'ClashGrotesk-Medium',
  },
  attendanceTimeValue: {
    fontSize: 14,
    color: '#29bf12',
    fontWeight: '600',
    fontFamily: 'ClashGrotesk-Semibold',
  },
  routeInfoCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  routeInfoTitle: {
    fontSize: 16,
    color: '#999',
    marginBottom: 5,
    fontFamily: 'ClashGrotesk-Regular',
  },
  routeInfoRoute: {
    fontSize: 20,
    fontWeight: '600',
    color: '#023e8a',
    textAlign: 'center',
    fontFamily: 'ClashGrotesk-Semibold',
  },
  locationCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  locationDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 10,
  },
  locationTitle: {
    fontSize: 14,
    color: '#999',
    fontWeight: '600',
    fontFamily: 'ClashGrotesk-Semibold',
  },
  locationName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
    fontFamily: 'ClashGrotesk-Semibold',
  },
  locationCoords: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'ClashGrotesk-Regular',
  },
  routeArrow: {
    alignItems: 'center',
    marginVertical: 10,
  },
  routeArrowText: {
    fontSize: 40,
    color: '#023e8a',
  },
  routeStats: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 5,
  },
  routeStatText: {
    fontSize: 14,
    color: '#023e8a',
    fontWeight: '600',
    fontFamily: 'ClashGrotesk-Semibold',
  },
  openMapBtn: {
    backgroundColor: '#023e8a',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  openMapBtnText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'ClashGrotesk-Bold',
  },
  mapTipCard: {
    backgroundColor: '#e8f4f8',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
  },
  mapTipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#023e8a',
    marginBottom: 8,
    fontFamily: 'ClashGrotesk-Semibold',
  },
  mapTipText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    fontFamily: 'ClashGrotesk-Regular',
  },
  routeCardModern: {
    backgroundColor: 'white',
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  routeCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(102, 126, 234, 0.5)',
  },
  routeIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(135, 206, 250, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  routeIcon: {
    fontSize: 32,
  },
  routeCardHeaderText: {
    flex: 1,
  },
  routeCardLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#667eea',
    letterSpacing: 1.5,
    marginBottom: 5,
    fontFamily: 'ClashGrotesk-Semibold',
  },
  routeCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    lineHeight: 24,
    fontFamily: 'ClashGrotesk-Semibold',
  },
  routeCardDivider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 20,
  },
  routeCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  routeCardStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeCardStatIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  routeCardStatText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
    fontFamily: 'ClashGrotesk-Semibold',
  },
  viewProfileBtn: {
    backgroundColor: '#667eea',
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  viewProfileBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'ClashGrotesk-Bold',
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileAvatarContainer: {
    marginBottom: 15,
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#023e8a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileAvatarText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'ClashGrotesk-Bold',
  },
  profileName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    fontFamily: 'ClashGrotesk-Bold',
  },
  profileRole: {
    fontSize: 16,
    color: '#023e8a',
    fontWeight: '600',
    fontFamily: 'ClashGrotesk-Semibold',
  },
  profileSection: {
    marginBottom: 20,
  },
  profileSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    paddingLeft: 5,
    fontFamily: 'ClashGrotesk-Semibold',
  },
  profileInfoCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  profileInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  profileInfoLabel: {
    fontSize: 15,
    color: '#666',
    fontWeight: '500',
    fontFamily: 'ClashGrotesk-Medium',
  },
  profileInfoValue: {
    fontSize: 15,
    color: '#333',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
    fontFamily: 'ClashGrotesk-Semibold',
  },
  profileStatusBadge: {
    backgroundColor: '#43e97b',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  profileStatusText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'ClashGrotesk-Semibold',
  },
  dashHeaderModern: {
    backgroundColor: '#023e8a',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  dashHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingModern: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 5,
    fontFamily: 'ClashGrotesk-Regular',
  },
  userNameModern: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'ClashGrotesk-Bold',
  },
  profileIconBtn: {
    padding: 5,
  },
  profileIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIconText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#023e8a',
    fontFamily: 'ClashGrotesk-Bold',
  },
  dashContentModern: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  routeCardPremium: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderLeftWidth: 5,
    borderLeftColor: '#023e8a',
  },
  routeCardPremiumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#023e8a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  busIcon: {
    width: 35,
    height: 35,
    tintColor: 'white',
  },
  routeIconModern: {
    fontSize: 28,
  },
  routeCardPremiumContent: {
    flex: 1,
  },
  routeCardPremiumLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#023e8a',
    letterSpacing: 1.2,
    marginBottom: 5,
    fontFamily: 'ClashGrotesk-Semibold',
  },
  routeCardPremiumTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    lineHeight: 22,
    fontFamily: 'ClashGrotesk-Semibold',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  gridCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  gridCardIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#023e8a',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  gridIconImage: {
    width: 28,
    height: 28,
    tintColor: 'white',
  },
  gridCardIconText: {
    fontSize: 24,
  },
  gridCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
    fontFamily: 'ClashGrotesk-Semibold',
  },
  gridCardSub: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    fontFamily: 'ClashGrotesk-Regular',
  },
  logoutBtnModern: {
    backgroundColor: '#dc3545',
    padding: 16,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 30,
  },
  logoutTextModern: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'ClashGrotesk-Bold',
  },
  // Admin styles
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#023e8a',
    fontFamily: 'ClashGrotesk-Bold',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    fontFamily: 'ClashGrotesk-Regular',
  },
  todayCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  todayTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
    fontFamily: 'ClashGrotesk-Semibold',
  },
  todayDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    fontFamily: 'ClashGrotesk-Regular',
  },
  todayStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  todayStatItem: {
    alignItems: 'center',
  },
  todayStatNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: 'ClashGrotesk-Bold',
  },
  todayStatLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    fontFamily: 'ClashGrotesk-Regular',
  },
  adminActionCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  adminActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#023e8a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  adminActionIconText: {
    fontSize: 24,
  },
  adminActionContent: {
    flex: 1,
  },
  adminActionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'ClashGrotesk-Semibold',
  },
  adminActionSub: {
    fontSize: 14,
    color: '#999',
    marginTop: 2,
    fontFamily: 'ClashGrotesk-Regular',
  },
  reportDateCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  reportDateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  reportDateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    fontFamily: 'ClashGrotesk-Semibold',
  },
  reportDateStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  reportDateStat: {
    alignItems: 'center',
  },
  reportDateStatNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'ClashGrotesk-Bold',
  },
  reportDateStatLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 3,
    fontFamily: 'ClashGrotesk-Regular',
  },
  reportDetailsHeader: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
  },
  reportDetailsDate: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
    fontFamily: 'ClashGrotesk-Semibold',
  },
  reportDetailsSummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  reportDetailsStat: {
    alignItems: 'center',
  },
  reportDetailsStatNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'ClashGrotesk-Bold',
  },
  reportDetailsStatLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    fontFamily: 'ClashGrotesk-Regular',
  },
  adminStudentCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
    marginBottom: 12,
  },
  adminStudentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  adminStudentName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'ClashGrotesk-Semibold',
  },
  adminStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  adminStudentInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    fontFamily: 'ClashGrotesk-Regular',
  },
  // Payment styles
  paymentCard: {
    backgroundColor: '#ffa500',
    padding: 18,
    borderRadius: 15,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentContent: {
    flex: 1,
  },
  paymentTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: 'white',
    fontFamily: 'ClashGrotesk-Medium',
  },
  paymentSub: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
    fontFamily: 'ClashGrotesk-Regular',
  },
  paymentArrow: {
    fontSize: 28,
    color: 'white',
  },
  paymentSummaryCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  paymentSummaryTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
    fontFamily: 'ClashGrotesk-Semibold',
  },
  paymentSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  paymentSummaryLabel: {
    fontSize: 15,
    color: '#666',
    fontFamily: 'ClashGrotesk-Regular',
  },
  paymentSummaryValue: {
    fontSize: 15,
    color: '#333',
    fontWeight: '600',
    fontFamily: 'ClashGrotesk-Semibold',
  },
  paymentSummaryDivider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 15,
  },
  paymentSummaryTotalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'ClashGrotesk-Semibold',
  },
  paymentSummaryTotalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#023e8a',
    fontFamily: 'ClashGrotesk-Bold',
  },
  paymentMethodTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
    fontFamily: 'ClashGrotesk-Semibold',
  },
  paymentMethodCard: {
    backgroundColor: 'white',
    padding: 18,
    borderRadius: 15,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  paymentMethodCardDisabled: {
    opacity: 0.6,
    backgroundColor: '#f5f5f5',
  },
  paymentMethodCardActive: {
    borderColor: '#023e8a',
    backgroundColor: '#e8f4f8',
  },
  paymentMethodIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f5f7fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  paymentMethodIconText: {
    fontSize: 24,
  },
  paymentMethodContent: {
    flex: 1,
  },
  paymentMethodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 3,
    fontFamily: 'ClashGrotesk-Semibold',
  },
  paymentMethodDesc: {
    fontSize: 13,
    color: '#999',
    fontFamily: 'ClashGrotesk-Regular',
  },
  paymentMethodRadio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentMethodRadioActive: {
    borderColor: '#023e8a',
  },
  paymentMethodRadioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#023e8a',
  },
  payNowButton: {
    backgroundColor: '#023e8a',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    shadowColor: '#023e8a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  payNowButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'ClashGrotesk-Bold',
  },
  paymentNoteCard: {
    backgroundColor: '#fff3cd',
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#ffa500',
  },
  paymentNoteTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#856404',
    marginBottom: 5,
    fontFamily: 'ClashGrotesk-Semibold',
  },
  paymentNoteText: {
    fontSize: 13,
    color: '#856404',
    lineHeight: 20,
    fontFamily: 'ClashGrotesk-Regular',
  },
  // Feedback styles
  feedbackCard: {
    backgroundColor: '#9c27b0',
    padding: 18,
    borderRadius: 15,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  feedbackContent: {
    flex: 1,
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: 'white',
    fontFamily: 'ClashGrotesk-Medium',
  },
  feedbackSub: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
    fontFamily: 'ClashGrotesk-Regular',
  },
  feedbackArrow: {
    fontSize: 28,
    color: 'white',
  },
  feedbackIntroCard: {
    backgroundColor: '#f3e5f5',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#9c27b0',
  },
  feedbackIntroTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#9c27b0',
    marginBottom: 10,
    fontFamily: 'ClashGrotesk-Semibold',
  },
  feedbackIntroText: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    fontFamily: 'ClashGrotesk-Regular',
  },
  feedbackFormCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  feedbackFormTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
    fontFamily: 'ClashGrotesk-Semibold',
  },
  feedbackFormSubtitle: {
    fontSize: 14,
    color: '#999',
    marginBottom: 20,
    fontFamily: 'ClashGrotesk-Regular',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 15,
  },
  starButton: {
    padding: 5,
  },
  starIcon: {
    fontSize: 40,
    color: '#ddd',
  },
  starIconActive: {
    color: '#ffd700',
  },
  ratingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#9c27b0',
    textAlign: 'center',
    marginTop: 5,
    fontFamily: 'ClashGrotesk-Semibold',
  },
  feedbackTextArea: {
    backgroundColor: '#f5f7fa',
    borderRadius: 12,
    padding: 15,
    fontSize: 15,
    color: '#333',
    minHeight: 120,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    fontFamily: 'ClashGrotesk-Regular',
  },
  feedbackCategoriesCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  feedbackCategoriesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
    fontFamily: 'ClashGrotesk-Semibold',
  },
  feedbackCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  feedbackCategoryIcon: {
    fontSize: 16,
    marginRight: 12,
    width: 20,
    color: '#9c27b0',
    fontWeight: 'bold',
  },
  feedbackCategoryText: {
    fontSize: 15,
    color: '#666',
    fontFamily: 'ClashGrotesk-Regular',
  },
  submitFeedbackButton: {
    backgroundColor: '#9c27b0',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#9c27b0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitFeedbackButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'ClashGrotesk-Bold',
  },
  feedbackNoteCard: {
    backgroundColor: '#e8f5e9',
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#4caf50',
  },
  feedbackNoteTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2e7d32',
    marginBottom: 5,
    fontFamily: 'ClashGrotesk-Semibold',
  },
  feedbackNoteText: {
    fontSize: 13,
    color: '#2e7d32',
    lineHeight: 20,
    fontFamily: 'ClashGrotesk-Regular',
  },
});
