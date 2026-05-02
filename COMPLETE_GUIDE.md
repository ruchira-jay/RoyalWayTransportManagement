# RoyalWay Transportation System - Complete Implementation Guide

## 🎯 System Overview

This is a route-based parent-driver connection system where:
- Parents select a route when registering their child
- Drivers select a route they can drive
- System automatically connects them based on matching routes

## 📍 Available Routes

1. Puttalam Town to Kurunegala
2. Kandy Town to Kurunegala
3. Matale Town to Kurunegala
4. Ibbagamuwa Town to Kurunegala
5. Polgahawela to Kurunegala

## 👨‍👩‍👧 Parent Flow

### Registration
1. Open app → Click "Register"
2. Fill in:
   - Parent Name
   - Email
   - Password
3. Select Role: **Parent**
4. Fill Child Details:
   - Child Name (required)
   - Class/Grade (required)
   - Date of Birth (tap to select)
   - Select Route (dropdown)
5. Click "Create Account"

### Login & Dashboard
1. Login with credentials
2. Parent Dashboard shows:
   - Child information card
   - "Driver" button → View assigned driver details
   - "Track Bus" button → Real-time tracking
   - Logout option

### View Driver
- Click "Driver" button
- See driver's:
  - Name
  - Phone number
  - Route
  - NIC number

## 🚗 Driver Flow

### Registration
1. Open app → Click "Register"
2. Fill in:
   - Driver Name
   - Email
   - Password
3. Select Role: **Driver**
4. Fill Driver Details:
   - Date of Birth (must be 25+ years old)
   - Phone Number (required)
   - NIC Number (required)
   - Driver License Number
   - Select Route (dropdown)
5. Click "Create Account"

### Login & Dashboard
1. Login with credentials
2. Driver Dashboard shows:
   - Your route information
   - "Students" button → View all students on your route
   - "Attendance" button → Mark attendance
   - Logout option

### View Students
- Click "Students" button
- See list of all students on your route:
  - Student name
  - Class
  - Parent name
  - Student ID

## 🔧 Technical Implementation

### Backend Changes

#### 1. User Model (`/backend/models/User.js`)
```javascript
// Parent fields
- childName: String
- childClass: String
- childDateOfBirth: Date
- selectedRoute: String (enum of 5 routes)

// Driver fields
- dateOfBirth: Date
- phoneNumber: String
- nicNumber: String
- driverLicenseImage: String
- assignedRoute: String (enum of 5 routes)
- driverStatus: String (pending/approved/rejected)
```

#### 2. Student Model (`/backend/models/Student.js`)
```javascript
- studentId: String (auto-generated)
- childName: String
- parentName: String
- childClass: String
- childDateOfBirth: Date
- route: String (from parent's selectedRoute)
- parentId: ObjectId (ref to User)
- parentEmail: String
- assignedDriver: ObjectId (ref to User)
```

#### 3. Auth Controller (`/backend/controllers/authController.js`)
- **register**: Creates user and auto-creates student record for parents
- **login**: Returns user with all relevant fields
- **getDriverByRoute**: Gets driver assigned to a specific route

#### 4. Student Controller (`/backend/controllers/studentController.js`)
- **getAllStudents**: Get all students (for admin)
- **getStudentsByDriver**: Get students on driver's route
- **getStudentsByRoute**: Get students by route name

#### 5. API Routes
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/driver/route/:route
GET    /api/students
GET    /api/students/driver/:driverId
GET    /api/students/route/:route
```

### Mobile App Changes

#### New App.js Features
1. **Route Selection**: Dropdown picker for 5 routes
2. **Date Picker**: For child DOB and driver DOB
3. **Age Validation**: Driver must be 25+
4. **Auto-matching**: Students automatically assigned to drivers on same route
5. **Clean UI**: Simplified, modern interface

#### Screens
1. **Login Screen**: Email & password
2. **Register Screen**: Role-based form (Parent/Driver)
3. **Parent Dashboard**: Child info + Driver button
4. **Driver Info Screen**: Shows driver details to parent
5. **Driver Dashboard**: Route info + Students button
6. **Students List Screen**: Shows all students on driver's route

## 🚀 How to Start

### 1. Start Backend
```bash
cd /Users/admin/RoyalWay/backend
npm start
```
Server runs on port 3000

### 2. Start Mobile App
```bash
cd /Users/admin/RoyalWay/MobileApp
npx expo start -c
```
Use `-c` flag to clear cache

### 3. Test the System

#### Test Parent Registration
1. Register as Parent
2. Fill child details
3. Select route: "Kandy Town to Kurunegala"
4. Complete registration
5. Login
6. Click "Driver" to see assigned driver

#### Test Driver Registration
1. Register as Driver
2. Fill driver details (DOB must make you 25+)
3. Select route: "Kandy Town to Kurunegala"
4. Complete registration
5. Login
6. Click "Students" to see students on your route

## 📊 Database Structure

### Users Collection
```json
{
  "_id": "...",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "hashed",
  "role": "parent",
  "childName": "Jane Doe",
  "childClass": "Grade 5",
  "childDateOfBirth": "2015-05-15",
  "selectedRoute": "Kandy Town to Kurunegala"
}
```

### Students Collection
```json
{
  "_id": "...",
  "studentId": "STU1234567890123",
  "childName": "Jane Doe",
  "parentName": "John Doe",
  "childClass": "Grade 5",
  "childDateOfBirth": "2015-05-15",
  "route": "Kandy Town to Kurunegala",
  "parentId": "...",
  "parentEmail": "john@example.com",
  "assignedDriver": "..."
}
```

## 🔑 Key Features

### Automatic Matching
- When parent registers with route "Kandy Town to Kurunegala"
- System finds driver with assignedRoute "Kandy Town to Kurunegala"
- Student record automatically links to that driver

### Route-Based System
- All connections based on route matching
- Driver sees only students on their route
- Parent sees only driver on their route

### Age Validation
- Driver registration checks age from DOB
- Must be 25 or older
- Shows error if under 25

### Clean Data Flow
1. Parent registers → Student created → Driver auto-assigned
2. Driver registers → Available for student assignment
3. Parent views driver → API fetches by route
4. Driver views students → API fetches by driver's route

## 📱 Mobile App Packages

Required packages (already installed):
- `@react-native-picker/picker` - Route selection dropdown
- `@react-native-community/datetimepicker` - Date of birth picker
- `@react-native-async-storage/async-storage` - Store user data
- `axios` - API calls

## 🎨 UI/UX Features

- Modern gradient header
- Clean white cards
- Emoji icons for visual appeal
- Smooth navigation
- Loading states
- Error handling with alerts
- Back buttons for navigation

## 🔐 Security

- Passwords hashed with bcrypt
- JWT tokens for authentication
- Token stored in AsyncStorage
- API endpoints protected
- Input validation on both frontend and backend

## 📝 Notes

- Old App.js backed up as `App_OLD_BACKUP.js`
- Backend auto-approves drivers (can be changed to manual approval)
- Student IDs auto-generated with timestamp
- Date pickers work on both iOS and Android
- Route names must match exactly (case-sensitive)

## 🐛 Troubleshooting

### App won't start
```bash
cd /Users/admin/RoyalWay/MobileApp
rm -rf node_modules
npm install
npx expo start -c
```

### Backend errors
- Check MongoDB is running
- Check port 3000 is not in use
- Verify .env file exists

### No driver showing for parent
- Make sure a driver registered with same route
- Check driver's driverStatus is 'approved'
- Verify route names match exactly

### Students not showing for driver
- Make sure parents registered with same route
- Check student records were created
- Verify driver is logged in correctly

## 🎯 Next Steps (Optional Enhancements)

1. Add image upload for driver license
2. Add real-time bus tracking
3. Add attendance marking
4. Add push notifications
5. Add payment integration
6. Add admin approval workflow for drivers
7. Add multiple children per parent
8. Add route maps
9. Add emergency alerts
10. Add feedback system
