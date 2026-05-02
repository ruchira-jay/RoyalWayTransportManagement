import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet } from 'react-native';

// Auth Screens
import TestLoginScreen from '../screens/Auth/TestLoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import LoginScreen from '../screens/Auth/LoginScreen';

// Parent Screens
import ParentDashboardScreen from '../screens/Parent/ParentDashboardScreen';
import ManageChildrenScreen from '../screens/Parent/ManageChildrenScreen';

// Driver Screens
import DriverDashboardScreen from '../screens/Driver/DriverDashboardScreen';
import MyStudentsScreen from '../screens/Driver/MyStudentsScreen';

const Stack = createStackNavigator();

// Simple Dashboard
function SimpleDashboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎉 Dashboard</Text>
      <Text style={styles.text}>Welcome to RoyalWay!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f7fa',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 10,
  },
  text: {
    fontSize: 18,
    color: '#666',
  },
});

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="ParentDashboard" 
          component={ParentDashboardScreen}
          options={{ title: 'Parent Dashboard' }}
        />
        <Stack.Screen 
          name="ManageChildren" 
          component={ManageChildrenScreen}
          options={{ title: 'Manage Children' }}
        />
        <Stack.Screen 
          name="DriverDashboard" 
          component={DriverDashboardScreen}
          options={{ title: 'Driver Dashboard' }}
        />
        <Stack.Screen 
          name="MyStudents" 
          component={MyStudentsScreen}
          options={{ title: 'My Students' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
