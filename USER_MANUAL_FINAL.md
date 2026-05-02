# RoyalWay School Transportation Management System
## User Manual

---

## 1. Introduction

RoyalWay is a comprehensive school transportation management system designed to streamline bus operations, enhance communication between parents and drivers, and provide administrators with powerful management tools. The system consists of an admin web portal and a mobile application for parents and drivers.

---

## 2. System Components

- **Admin Web Portal**: Accessible at http://localhost:3001 for administrative tasks
- **Mobile Application**: Available for both parents and drivers with role-specific interfaces
- **Backend Server**: Runs on http://localhost:3000 with MongoDB database

---

## 3. Environment Setup

### 3.1 Running the Backend Server

1. Open terminal and navigate to backend folder:
   ```
   cd /Users/admin/RoyalWay/backend
   ```

2. Install dependencies (first time only):
   ```
   npm install
   ```

3. Start the backend server:
   ```
   npm start
   ```

4. Server will run on http://localhost:3000

### 3.2 Running the Admin Web Portal

1. Open new terminal and navigate to frontend folder:
   ```
   cd /Users/admin/RoyalWay/frontend
   ```

2. Install dependencies (first time only):
   ```
   npm install
   ```

3. Start the web portal:
   ```
   npm start
   ```

4. Portal will open automatically at http://localhost:3001

### 3.3 Running the Mobile Application

1. Install Expo Go app on your smartphone:
   - iOS: Download from App Store
   - Android: Download from Google Play Store

2. Open new terminal and navigate to mobile app folder:
   ```
   cd /Users/admin/RoyalWay/MobileApp
   ```

3. Install dependencies (first time only):
   ```
   npm install
   ```

4. Start the mobile app:
   ```
   npx expo start
   ```

5. Scan the QR code:
   - iOS: Use Camera app to scan QR code
   - Android: Use Expo Go app to scan QR code

6. App will open on your smartphone

---

## 4. Admin Web Portal

### 4.1 Admin Login

**Steps to Login:**

1. Navigate to http://localhost:3001
2. Enter admin credentials:
   - Email: admin@royalway.com
   - Password: admin123
3. Click Login button
4. You will be redirected to the dashboard

### 4.2 Dashboard Overview

**Dashboard Features:**

- View total drivers count
- View total parents count
- View total students count
- View pending driver approvals
- Color-coded statistics cards
- Sidebar navigation for quick access

### 4.3 Driver Management

**Viewing Driver Applications:**

1. Click on "Drivers" in the sidebar
2. View all driver applications with details:
   - Name
   - Email
   - Phone number
   - NIC number
   - Age
   - Assigned route
   - Current status
   - Registration date

**Approving Drivers:**

1. Find the pending driver in the list
2. Review driver information
3. Click the "Approve" button
4. Driver can now login to mobile app
5. Driver can start managing their route

**Rejecting Drivers:**

1. Find the pending driver in the list
2. Click the "Reject" button
3. Driver will be notified and cannot access system

### 4.4 Notifications

**Notification Types:**

- Blue: Information messages
- Green: Success messages
- Yellow: Warning messages
- Red: Critical alerts

**Managing Notifications:**

1. Click "Notifications" in sidebar
2. View all system alerts
3. Click on notification to mark as read

---

## 5. Mobile Application for Parents

### 5.1 Parent Registration

**Steps to Register:**

1. Open RoyalWay mobile app
2. Tap "Register" button
3. Select "Parent" as your role
4. Enter your details:
   - Full name
   - Email address
   - Password

**Adding Children:**

1. Enter first child's information:
   - Child's full name
   - Class or grade
   - Date of birth
   - Select bus route
2. Tap "Add This Child" button
3. To add more children:
   - Fill out the form again
   - Tap "Add Another Child"
4. Repeat for all children
5. Tap "Create Account" to complete registration

**Note:** System automatically assigns children to approved drivers based on selected routes.

### 5.2 Parent Dashboard

**Dashboard Overview:**

- View all registered children with:
  - Child's name
  - Class
  - Assigned route
- Profile button in top right corner
- Access to all features

**Today's Attendance Status:**

1. Tap "Attendance" button
2. View attendance for each child:
   - Morning pickup status
   - Evening dropoff status
   - Status types: Active, Absent, Not Started
   - Timestamps for each action

**View Driver Information:**

1. Tap "Driver" button
2. View driver details:
   - Driver name
   - Phone number
   - Route
   - NIC number
3. Tap "Call Driver" to contact directly

**Track Bus:**

- Feature coming soon
- Real-time bus tracking under development

**Make Payment:**

1. Tap "Payment" button
2. View monthly fee: LKR 15,000
3. Select payment method:
   - Bank Transfer
   - Cash Payment
   - Credit Card (coming soon)
   - Mobile Wallet (coming soon)
4. Tap "Pay Now" to complete

**Give Feedback:**

1. Tap "Feedback" button
2. Select star rating (1-5 stars):
   - 1 star: Poor
   - 2 stars: Fair
   - 3 stars: Good
   - 4 stars: Very Good
   - 5 stars: Excellent
3. Write feedback about:
   - Punctuality
   - Behavior
   - Driving skills
   - Vehicle cleanliness
   - Communication
4. Tap "Submit Feedback"

**How to Use:**

- Tap "How to Use" for step-by-step guidance
- Access help for all features

---

## 6. Mobile Application for Drivers

### 6.1 Driver Registration

**Steps to Register:**

1. Open RoyalWay mobile app
2. Tap "Register" button
3. Select "Driver" as your role
4. Enter your details:
   - Full name
   - Email address
   - Password
   - Date of birth (must be 25+ years)
   - Phone number
   - NIC number
   - Driver license number
   - Select assigned route
5. Tap "Create Account"

**After Registration:**

- Account status: Pending
- Cannot login until admin approves
- Wait for admin approval via web portal
- Check email for approval notification

### 6.2 Driver Dashboard

**Dashboard Overview:**

- View assigned route prominently
- Quick access to:
  - Students list
  - Attendance reports
  - Calendar
  - Route map

**Mark Attendance:**

1. Tap "Students" button
2. View all students on your route
3. Two sessions available:
   - Morning Session
   - Evening Session

**Morning Session:**

1. When picking up student:
   - Tap "Pick Up" button
2. If student is absent:
   - Tap "Absent" button
3. Buttons disable after marking

**Evening Session:**

1. When dropping off student:
   - Tap "Drop Off" button
2. Buttons disable after marking

**Note:** Attendance resets automatically at 6:00 AM daily.

**Attendance Reports:**

1. Tap "Reports" button
2. View historical data:
   - Student names
   - Present/Absent status
   - Pickup timestamps
   - Dropoff timestamps
   - Date of attendance

**Calendar:**

1. Tap "Calendar" button
2. Select any date
3. View attendance for that day
4. Color indicators show marked dates

**Route Map:**

1. Tap "Route Map" button
2. View route details:
   - Start point
   - End point
   - Distance
   - Estimated duration
3. Tap "Open in Google Maps" for navigation

---

## 7. Technical Requirements

**For Admin Portal:**

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection
- Minimum screen resolution: 1280x720

**For Mobile App:**

- iOS or Android smartphone
- Expo Go app installed
- Internet connection
- Camera (for driver license upload)

**System Requirements:**

- Node.js installed
- MongoDB running on localhost:27017
- Backend server on port 3000
- Frontend server on port 3001
- Mobile app on port 8081

---

## 8. Security Features

- All passwords encrypted using bcryptjs
- JWT token authentication
- Token expiration: 30 days
- Role-based access control:
  - Admin: Web portal only
  - Parent: Mobile app with parent features
  - Driver: Mobile app with driver features
- Separate admin login endpoint
- Driver approval workflow
- Age validation for drivers (25+ years)

---

## 9. Support

**Troubleshooting:**

- Check backend server logs in terminal
- Verify MongoDB is running
- Ensure all ports are available (3000, 3001, 8081)
- Clear browser cache for web portal issues
- Restart Expo Go app for mobile issues

**Maintenance:**

- Monitor dashboard statistics daily
- Regular database backups recommended
- Check attendance reset at 6:00 AM daily
- Review pending driver approvals regularly

---

**Document Version:** 1.0  
**Last Updated:** 2024  
**© 2024 RoyalWay. All rights reserved.**
