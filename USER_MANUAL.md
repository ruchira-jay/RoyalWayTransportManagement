# RoyalWay School Transportation Management System
## User Manual

---

### Table of Contents
1. Introduction
2. System Overview
3. Admin Web Portal
4. Mobile Application - Parents
5. Mobile Application - Drivers
6. Technical Requirements
7. Support & Troubleshooting

---

### 1. Introduction

RoyalWay is a comprehensive school transportation management system designed to streamline bus operations, driver management, parent communication, and student attendance tracking. This manual provides complete guidance for administrators, parents, and drivers to effectively use the system.

**System Components:**
- Admin Web Portal (localhost:3001)
- Mobile Application for Parents and Drivers
- Backend Server (localhost:3000)
- MongoDB Database

---

### 2. System Overview

**Purpose**

The RoyalWay system provides a centralized platform for managing school transportation operations. Administrators can approve drivers, monitor system statistics, and manage notifications. Parents can track their children, view attendance, and make payments. Drivers can mark daily attendance and manage their assigned routes.

**Key Features**
- Real-time driver approval workflow
- Multiple children support for parents
- Daily attendance tracking with automatic reset
- Secure role-based access control
- Instant notifications and alerts
- Payment processing for transportation fees

---

### 3. Admin Web Portal

**3.1 Accessing the Portal**

Open your web browser and navigate to:
```
http://localhost:3001
```

The login page displays the RoyalWay logo with animated cloud shapes in the background.

**Admin Credentials:**
```
Email: admin@royalway.com
Password: admin123
```

Enter the credentials and click "Sign In" to access the dashboard.

**3.2 Dashboard**

The dashboard provides an overview of the entire system with the following statistics:

- Total Drivers (Approved, Pending, Rejected)
- Total Parents Registered
- Total Students Enrolled
- Pending Driver Approvals

The sidebar navigation includes:
- Dashboard
- Drivers
- Parents
- Students
- Routes
- Attendance
- Notifications

**3.3 Driver Management**

Navigate to the "Drivers" section to manage driver applications.

**Driver Status Types:**
- Pending: Newly registered, awaiting approval
- Approved: Can access the mobile app
- Rejected: Cannot access the system

**Approving Drivers:**

1. Review driver details (Name, Email, Phone, NIC, Age, Route)
2. Verify driver license image
3. Click "Approve" button to grant access
4. Driver receives approval and can login immediately

**Rejecting Drivers:**

1. Review driver application
2. Click "Reject" button if requirements not met
3. Driver cannot access system and receives rejection message

**Driver Information Displayed:**
- Full Name
- Email Address
- Phone Number
- NIC Number
- Age (Must be 25+)
- Assigned Route
- Registration Date
- Driver Status

**3.4 Notifications**

The Notifications page displays system alerts with color-coded indicators:

- Blue: Information
- Green: Success
- Yellow: Warning
- Red: Critical

Each notification shows:
- Title
- Description
- Timestamp
- Priority Level

Click on notifications to mark them as read.

---

### 4. Mobile Application - Parents

**4.1 Registration**

1. Open the RoyalWay mobile app
2. Select "Parent" as your role
3. Fill in your personal information:
   - Full Name
   - Email Address
   - Password

**4.2 Adding Children**

The system supports multiple children registration:

1. Enter first child's information:
   - Child's Full Name
   - Class/Grade
   - Date of Birth
   - Select Bus Route
2. Click "Add This Child"
3. To add more children, fill the form again
4. Click "Add Another Child"
5. After adding all children, click "Register"

The system creates individual student records for each child and assigns them to drivers based on their routes.

**4.3 Parent Dashboard**

After login, the dashboard displays:

**Profile Access:**
- Click the profile circle (top right corner)
- View your personal information
- View all children's details

**Children List:**
- All registered children displayed
- Shows Name, Class, and Route
- Numbered list format

**Available Actions:**

**Track Bus**
- Status: Coming Soon
- Future feature for real-time bus tracking

**View Driver Info**
- Displays assigned driver details
- Shows driver name, phone, route
- "Call Driver" button for direct contact

**Make Payment**
- Monthly fee: LKR 15,000
- Active options: Bank Transfer, Cash Payment
- Coming Soon: Credit Card, Mobile Wallet

**Attendance History**
- View daily attendance records
- Shows Present, Absent, or Leave status
- Historical data for all children

**How to Use**
- Guidance on app features
- Step-by-step instructions

**Contact Support**
- Reach school administration
- Get assistance with issues

---

### 5. Mobile Application - Drivers

**5.1 Registration**

1. Open the RoyalWay mobile app
2. Select "Driver" as your role
3. Complete registration form:
   - Full Name
   - Email Address
   - Password
   - Date of Birth (Must be 25+ years)
   - Phone Number
   - NIC Number
   - Upload Driver License Image
   - Select Assigned Route

**Age Requirement:**
- Minimum age: 25 years
- System automatically calculates age from date of birth
- Registration rejected if under 25

**5.2 Approval Process**

After registration:
1. Account status: Pending
2. Cannot login until admin approval
3. Login attempt shows: "Your account is pending approval"
4. Admin reviews and approves via web portal
5. Once approved, driver can login immediately

**5.3 Driver Dashboard**

**Mark Attendance**

Primary function for daily operations:

1. Click "Mark Attendance" button
2. View list of all assigned students
3. For each student, select:
   - Present
   - Absent
   - Leave
4. Save attendance records

**Attendance System:**
- Automatic reset at 6:00 AM daily
- Fresh records for each school day
- Historical data maintained in database

**Route Information**
- View assigned route details
- See complete student list
- Access route schedule

**Profile Management**
- View personal information
- Update contact details
- Check approval status

---

### 6. Technical Requirements

**6.1 System Requirements**

**For Admin Portal:**
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection
- Screen resolution: 1280x720 minimum

**For Mobile App:**
- iOS or Android smartphone
- Expo Go app installed
- Internet connection
- Camera (for driver license upload)

**6.2 Server Requirements**

**Backend Server:**
- Node.js installed
- MongoDB running on localhost:27017
- Port 3000 available

**Frontend Server:**
- Port 3001 available
- React dependencies installed

**Mobile App:**
- Expo CLI installed
- Port 8081 available

**6.3 Database**

**MongoDB Collections:**
- users: All user accounts (admin, parents, drivers)
- students: Student records with route assignments
- attendances: Daily attendance logs
- notifications: System alerts and messages

**Automatic Maintenance:**
- Daily attendance cleanup at 6:00 AM
- Data integrity checks
- Automatic backups recommended

---

### 7. Support & Troubleshooting

**7.1 Common Issues**

**Cannot Login to Admin Portal**
- Verify credentials: admin@royalway.com / admin123
- Check if backend server is running
- Clear browser cache and cookies

**Driver Cannot Login**
- Check approval status in admin portal
- Verify driver is approved (not pending/rejected)
- Ensure correct email and password

**Parent Cannot See Children**
- Verify registration completed successfully
- Check if children were added during registration
- Contact admin for database verification

**Attendance Not Saving**
- Check internet connection
- Verify driver is logged in
- Ensure backend server is running

**7.2 Starting the System**

**Start Backend Server:**
```bash
cd /Users/admin/RoyalWay/backend
node server.js
```

**Start Frontend Portal:**
```bash
cd /Users/admin/RoyalWay/frontend
npm start
```

**Start Mobile App:**
```bash
cd /Users/admin/RoyalWay/MobileApp
npx expo start
```

**7.3 Checking System Status**

**Backend Server:**
- Should display: "Server running on port 3000"
- Should display: "MongoDB Connected: localhost"

**Frontend Portal:**
- Opens automatically at localhost:3001
- Login page should display with logo

**Mobile App:**
- QR code appears in terminal
- Scan with Expo Go app to open

**7.4 Database Access**

**Using MongoDB Compass:**
- Connection string: mongodb://localhost:27017
- Database name: royalway
- View collections: users, students, attendances, notifications

**Using Command Line:**
```bash
mongosh
use royalway
db.users.find()
```

**7.5 Security Best Practices**

- Change default admin password after first login
- Use strong passwords for all accounts
- Regular database backups
- Monitor system logs for unusual activity
- Keep Node.js and dependencies updated

**7.6 Contact Information**

For technical support or system issues:
- Check server logs in backend folder
- Review error messages in browser console
- Verify all services are running
- Contact system administrator

---

### Appendix

**Default Ports:**
- Backend: 3000
- Frontend: 3001
- Mobile App: 8081
- MongoDB: 27017

**Admin Credentials:**
- Email: admin@royalway.com
- Password: admin123

**System Features:**
- JWT Authentication (30-day expiration)
- Automatic daily attendance reset (6:00 AM)
- Multiple children support for parents
- Driver approval workflow
- Real-time statistics dashboard

**Version Information:**
- System: RoyalWay v1.0
- Node.js: Latest LTS
- React: 18.x
- React Native: Latest
- MongoDB: 6.x

---

**Document Version:** 1.0  
**Last Updated:** 2024  
**Copyright:** © 2024 RoyalWay. All rights reserved.
