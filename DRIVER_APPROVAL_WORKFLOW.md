# Driver Approval System - Complete Workflow

## Overview
The RoyalWay School Transportation System includes a complete driver approval workflow where drivers must be approved by an admin before they can login and access the system.

---

## Complete Workflow

### 1. Driver Registration (Mobile App)

**Location:** `/MobileApp/App.js`

**Process:**
1. Driver opens the mobile app and clicks "Register"
2. Driver fills in required information:
   - Full Name
   - Email Address
   - Password
   - Date of Birth (must be 25+ years old)
   - Phone Number
   - NIC Number
   - Driver License Number
   - Assigned Route

3. When driver submits registration:
   - Backend validates all fields
   - Checks age requirement (25+)
   - Creates user with `driverStatus: 'pending'`
   - Shows success message: "Your driver account has been created. Please wait for admin approval before you can login."

**Backend Endpoint:** `POST /api/auth/register`
**Controller:** `/backend/controllers/authController.js` - `register()`

```javascript
// Driver registration automatically sets status to pending
if (role === 'driver') {
  userData.driverStatus = 'pending'; // Requires admin approval
}
```

---

### 2. Driver Details Appear in Frontend

**Location:** `/frontend/src/pages/Drivers.js`

**Process:**
1. Admin logs into the frontend website
2. Navigates to "Drivers" page from sidebar
3. All registered drivers are displayed in a table showing:
   - Name
   - Email
   - Phone Number
   - NIC Number
   - Age (calculated from date of birth)
   - Assigned Route
   - Status (Pending/Approved/Rejected)
   - Registration Date

**Backend Endpoint:** `GET /api/drivers`
**Controller:** `/backend/controllers/driverController.js` - `getAllDrivers()`

```javascript
// Fetches all drivers from database
const drivers = await User.find({ role: 'driver' }).select('-password');
```

---

### 3. Admin Approval/Rejection

**Location:** `/frontend/src/pages/Drivers.js`

**Process:**

#### Approve Driver:
1. Admin clicks "Approve" button next to pending driver
2. Confirmation dialog appears: "Are you sure you want to approve the driver application for [Driver Name]?"
3. Admin confirms
4. Backend updates `driverStatus` to `'approved'`
5. Success message: "Driver approved successfully!"
6. Table refreshes automatically to show updated status

**Backend Endpoint:** `PUT /api/drivers/approve/:id`
**Controller:** `/backend/controllers/driverController.js` - `approveDriver()`

```javascript
const driver = await User.findOneAndUpdate(
  { _id: req.params.id, role: 'driver' },
  { driverStatus: 'approved' },
  { new: true }
);
```

#### Reject Driver:
1. Admin clicks "Reject" button next to pending driver
2. Confirmation dialog appears: "Are you sure you want to reject the driver application for [Driver Name]?"
3. Admin confirms
4. Backend updates `driverStatus` to `'rejected'`
5. Success message: "Driver rejected successfully!"
6. Table refreshes automatically to show updated status

**Backend Endpoint:** `PUT /api/drivers/reject/:id`
**Controller:** `/backend/controllers/driverController.js` - `rejectDriver()`

```javascript
const driver = await User.findOneAndUpdate(
  { _id: req.params.id, role: 'driver' },
  { driverStatus: 'rejected' },
  { new: true }
);
```

---

### 4. Driver Login Control

**Location:** `/backend/controllers/authController.js` - `login()`

**Process:**

#### Approved Driver:
- Driver can login successfully
- Redirected to Driver Dashboard
- Can access all driver features

#### Pending Driver:
- Login blocked
- Error message: "Your account is pending approval. Please wait for admin approval."
- HTTP Status: 403 Forbidden

#### Rejected Driver:
- Login blocked
- Error message: "Your account has been rejected. Please contact administration."
- HTTP Status: 403 Forbidden

**Backend Code:**
```javascript
// Check if driver is approved
if (user.role === 'driver' && user.driverStatus !== 'approved') {
  if (user.driverStatus === 'pending') {
    return res.status(403).json({ 
      message: 'Your account is pending approval. Please wait for admin approval.' 
    });
  } else if (user.driverStatus === 'rejected') {
    return res.status(403).json({ 
      message: 'Your account has been rejected. Please contact administration.' 
    });
  }
}
```

---

## Database Schema

**Model:** `/backend/models/User.js`

```javascript
{
  name: String,
  email: String,
  password: String,
  role: String, // 'driver', 'parent', 'admin'
  
  // Driver-specific fields
  dateOfBirth: Date,
  phoneNumber: String,
  nicNumber: String,
  driverLicenseImage: String,
  assignedRoute: String,
  driverStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  
  createdAt: Date,
  updatedAt: Date
}
```

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new driver (sets driverStatus to 'pending')
- `POST /api/auth/login` - Login (checks driverStatus for drivers)

### Driver Management
- `GET /api/drivers` - Get all drivers (admin only)
- `PUT /api/drivers/approve/:id` - Approve driver (admin only)
- `PUT /api/drivers/reject/:id` - Reject driver (admin only)

---

## Status Flow Diagram

```
┌─────────────────┐
│ Driver Registers│
│  (Mobile App)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ driverStatus =  │
│   'pending'     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Appears in      │
│ Frontend Drivers│
│     Page        │
└────────┬────────┘
         │
         ▼
    ┌────┴────┐
    │  Admin  │
    │ Decision│
    └────┬────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐ ┌────────┐
│Approve │ │ Reject │
└───┬────┘ └───┬────┘
    │          │
    ▼          ▼
┌────────┐ ┌────────┐
│'approved'│'rejected'│
└───┬────┘ └───┬────┘
    │          │
    ▼          ▼
┌────────┐ ┌────────┐
│Can Login│Can't Login│
└────────┘ └────────┘
```

---

## Testing the Workflow

### Test Script
Run: `node backend/testDriverApprovalFlow.js`

This will show:
- Total number of drivers
- Driver details (name, email, phone, NIC, route, status)
- Status summary (approved, pending, rejected counts)
- Workflow verification checklist

### Manual Testing Steps

1. **Register a Driver:**
   ```
   - Open mobile app
   - Click "Register"
   - Select "Driver" role
   - Fill all required fields
   - Submit registration
   - Verify success message about approval
   ```

2. **Check Frontend:**
   ```
   - Login as admin on frontend website
   - Navigate to "Drivers" page
   - Verify new driver appears with "Pending" status
   - Verify all driver details are displayed correctly
   ```

3. **Test Pending Login:**
   ```
   - Try to login with pending driver credentials
   - Verify error: "Your account is pending approval"
   ```

4. **Approve Driver:**
   ```
   - Click "Approve" button
   - Confirm in dialog
   - Verify success message
   - Verify status changes to "Approved"
   ```

5. **Test Approved Login:**
   ```
   - Login with approved driver credentials
   - Verify successful login
   - Verify access to Driver Dashboard
   ```

6. **Test Rejection:**
   ```
   - Register another driver
   - Click "Reject" button
   - Confirm in dialog
   - Try to login with rejected driver
   - Verify error: "Your account has been rejected"
   ```

---

## Current System Status

✅ **Implemented Features:**
- Driver registration with automatic pending status
- All driver details displayed in frontend
- Admin approval/rejection functionality
- Login control based on driver status
- Appropriate error messages for each status
- Automatic table refresh after approval/rejection
- Confirmation dialogs before actions
- Age validation (25+ years)
- Complete driver information display

✅ **Database Status:**
- Total Drivers: 9
- Approved: 5
- Pending: 4
- Rejected: 0

---

## Files Modified/Created

### Backend
- `/backend/models/User.js` - Added driverStatus field
- `/backend/controllers/authController.js` - Registration and login logic
- `/backend/controllers/driverController.js` - Approval/rejection logic
- `/backend/routes/driverRoutes.js` - Driver management routes
- `/backend/testDriverApprovalFlow.js` - Test script

### Frontend
- `/frontend/src/pages/Drivers.js` - Driver approval dashboard
- `/frontend/src/styles/Drivers.css` - Styling for drivers page

### Mobile App
- `/MobileApp/App.js` - Driver registration with approval message

---

## Security Considerations

1. **Authentication Required:** All driver management endpoints should require admin authentication
2. **Role-Based Access:** Only admins can approve/reject drivers
3. **Status Validation:** Login checks driver status before allowing access
4. **Password Security:** Passwords are hashed before storage
5. **Input Validation:** All driver fields are validated before registration

---

## Future Enhancements

- Email notifications when driver is approved/rejected
- SMS notifications for driver status changes
- Driver document upload (license, NIC photos)
- Admin notes/comments for rejection reasons
- Driver application history/audit log
- Bulk approval/rejection functionality
- Driver profile verification checklist

---

## Support

For issues or questions:
1. Check backend logs: `cd backend && npm start`
2. Check frontend console for errors
3. Run test script: `node backend/testDriverApprovalFlow.js`
4. Verify MongoDB connection
5. Check API endpoints are accessible

---

**Last Updated:** May 1, 2026
**System Version:** 1.0
**Status:** ✅ Fully Operational
