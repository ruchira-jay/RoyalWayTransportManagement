# RoyalWay School Transportation - Mobile App

React Native Expo mobile app for RoyalWay School Transportation System.

## Features

### User Roles:
1. **Parent**
2. **Driver**

### Screens:

**Authentication:**
- Login
- Register

**Parent Screens:**
- Parent Dashboard
- Student Status
- Notifications
- Feedback
- Payment Upload

**Driver Screens:**
- Driver Dashboard
- Attendance
- Send Notification
- Route Status

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the app:
```bash
npm start
```

3. Run on device:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on your phone

## Backend Connection

Make sure your backend is running on `http://localhost:3000`

For testing on physical device, update the API URL in `services/api.js`:
```javascript
const API_URL = 'http://YOUR_COMPUTER_IP:3000/api';
```

## Login Credentials

Use the credentials you created in the backend:
- Email: test@test.com
- Password: 123456
- Role: parent or driver

## Project Structure

```
MobileApp/
├── screens/
│   ├── Auth/
│   │   ├── LoginScreen.js
│   │   └── RegisterScreen.js
│   ├── Parent/
│   │   ├── ParentDashboardScreen.js
│   │   ├── StudentStatusScreen.js
│   │   ├── NotificationsScreen.js
│   │   ├── FeedbackScreen.js
│   │   └── PaymentUploadScreen.js
│   └── Driver/
│       ├── DriverDashboardScreen.js
│       ├── AttendanceScreen.js
│       ├── SendNotificationScreen.js
│       └── RouteStatusScreen.js
├── components/
├── services/
│   └── api.js
├── navigation/
│   └── AppNavigator.js
└── App.js
```

## Technologies

- React Native
- Expo
- React Navigation
- Axios
- AsyncStorage
