# RoyalWay School Transportation Management System

A comprehensive school transportation management system designed to streamline bus operations, enhance communication between parents and drivers, and provide administrators with powerful management tools.

## 🚀 Features

### Admin Web Portal
- **Dashboard**: Real-time statistics for drivers, parents, students, and pending approvals
- **Driver Management**: Approve or reject driver applications
- **Notifications**: System-wide alerts and notifications
- **Responsive Design**: Works on desktop, tablet, and mobile devices

### Mobile App for Parents
- **Multiple Children Support**: Register and manage multiple children
- **Real-time Attendance**: View morning pickup and evening dropoff status
- **Driver Information**: Access driver contact details with direct call feature
- **Payment Processing**: Pay monthly transportation fees (LKR 15,000)
- **Feedback System**: Rate driver service with 5-star rating and comments
- **Track Bus**: Real-time bus tracking (coming soon)

### Mobile App for Drivers
- **Attendance Management**: Mark student pickup/dropoff for morning and evening sessions
- **Attendance Reports**: View historical attendance data
- **Calendar View**: Check attendance by date
- **Route Map**: View assigned route with Google Maps integration
- **Automatic Reset**: Attendance resets daily at 6:00 AM

## 🛠️ Technologies Used

### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Token for authentication
- **bcryptjs**: Password hashing
- **node-cron**: Scheduled tasks for attendance reset

### Frontend (Admin Portal)
- **React.js**: JavaScript library for building UI
- **React Router**: Client-side routing
- **Axios**: HTTP client for API requests
- **CSS3**: Styling with responsive design

### Mobile Application
- **React Native**: Cross-platform mobile development
- **Expo**: Development platform for React Native
- **Expo Location**: GPS and location services
- **Expo Linking**: Deep linking and phone calls

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v14 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn**
- **Expo Go** app (for mobile testing)
- **Git**

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/ruchira-jay/RoyalWayTransportManagement.git
cd RoyalWayTransportManagement
```

### 2. Setup Backend Server

```bash
cd backend
npm install
npm start
```

Backend will run on: `http://localhost:3000`

### 3. Setup Admin Web Portal

```bash
cd frontend
npm install
npm start
```

Frontend will run on: `http://localhost:3001`

### 4. Setup Mobile Application

```bash
cd MobileApp
npm install
npx expo start
```

Scan the QR code with:
- **iOS**: Camera app
- **Android**: Expo Go app

## 🔐 Default Admin Credentials

- **Email**: admin@royalway.com
- **Password**: admin123

## 📱 Mobile App Setup

### For iOS:
1. Download **Expo Go** from App Store
2. Open Camera app
3. Scan QR code from terminal
4. App opens in Expo Go

### For Android:
1. Download **Expo Go** from Google Play Store
2. Open Expo Go app
3. Scan QR code from terminal
4. App opens automatically

## 🗂️ Project Structure

```
RoyalWay/
├── backend/                 # Backend server
│   ├── controllers/         # Route controllers
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   └── server.js           # Entry point
├── frontend/               # Admin web portal
│   ├── public/             # Static files
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── styles/         # CSS files
│   └── package.json
├── MobileApp/              # React Native mobile app
│   ├── assets/             # Images and fonts
│   ├── App.js              # Main app component
│   └── package.json
├── TEST_CASES.md           # Test cases documentation
├── USER_MANUAL_FINAL.md    # User manual
└── README.md               # This file
```

## 🔧 Configuration

### Backend Configuration

Create `.env` file in `backend/` folder:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/royalway
JWT_SECRET=your_jwt_secret_key_here
```

### Frontend Configuration

Create `.env` file in `frontend/` folder:

```env
REACT_APP_API_URL=http://localhost:3000
```

### Mobile App Configuration

Update API URL in `MobileApp/App.js`:

```javascript
const API_URL = 'http://YOUR_LOCAL_IP:3000';
```

Replace `YOUR_LOCAL_IP` with your computer's local IP address (e.g., 192.168.1.100)

## 📊 Database Collections

- **users**: Stores admin, parent, and driver accounts
- **students**: Stores student information
- **attendances**: Stores daily attendance records
- **notifications**: Stores system notifications

## 🎯 Key Features Explained

### Driver Approval Workflow
1. Driver registers through mobile app
2. Account status set to "pending"
3. Driver cannot login until approved
4. Admin reviews and approves/rejects via web portal
5. Approved drivers can login and manage routes

### Multiple Children Registration
1. Parents can add unlimited children during registration
2. Each child gets individual student record
3. Automatic assignment to approved drivers based on route
4. All children visible on parent dashboard

### Attendance System
1. Drivers mark attendance twice daily (morning/evening)
2. Parents view real-time attendance status
3. Automatic reset at 6:00 AM daily
4. Historical reports available

### Payment Processing
- Monthly fee: LKR 15,000
- Payment methods: Bank Transfer, Cash Payment
- Credit Card and Mobile Wallet (coming soon)

## 🧪 Testing

Run the test cases documented in `TEST_CASES.md`:

- 10 Admin Web Portal test cases
- 10 Mobile App test cases

## 📖 Documentation

- **User Manual**: See `USER_MANUAL_FINAL.md`
- **Test Cases**: See `TEST_CASES.md`

## 🔒 Security Features

- Password encryption using bcryptjs
- JWT token authentication (30-day expiration)
- Role-based access control
- Separate admin login endpoint
- Driver age validation (25+ years)
- Secure API endpoints

## 🌐 API Endpoints

### Authentication
- `POST /auth/register` - Register parent/driver
- `POST /auth/login` - Mobile app login
- `POST /auth/admin/login` - Admin login

### Users
- `GET /users/parents` - Get all parents
- `GET /users/drivers` - Get all drivers
- `PUT /users/driver/:id/approve` - Approve driver
- `PUT /users/driver/:id/reject` - Reject driver

### Students
- `GET /students` - Get all students
- `GET /students/parent/:parentId` - Get students by parent

### Attendance
- `POST /attendance/mark` - Mark attendance
- `GET /attendance/student/:studentId` - Get student attendance

## 🐛 Troubleshooting

### Backend won't start
- Check if MongoDB is running: `mongod`
- Verify port 3000 is available

### Frontend won't start
- Clear cache: `npm cache clean --force`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`

### Mobile app won't connect
- Use local IP address instead of localhost
- Ensure backend is running
- Check firewall settings

### Database connection error
- Start MongoDB: `mongod` or `brew services start mongodb-community`
- Verify MongoDB URI in .env file

## 👥 User Roles

1. **Admin**: Full system access via web portal
2. **Parent**: Mobile app access for children management
3. **Driver**: Mobile app access for attendance and route management

## 📱 Supported Platforms

- **Web Portal**: Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile App**: iOS 11+, Android 5.0+

## 🚦 System Requirements

### Development
- RAM: 8GB minimum
- Storage: 2GB free space
- Internet connection

### Production
- Server with Node.js support
- MongoDB hosting
- SSL certificate for HTTPS

## 📝 License

This project is developed for educational purposes.

## 👨‍💻 Developer

Developed by Ruchira Jay

## 📞 Support

For issues and questions:
- Check `USER_MANUAL_FINAL.md`
- Review `TEST_CASES.md`
- Check backend logs in terminal
- Verify all services are running

## 🔄 Version

**Version**: 1.0  
**Last Updated**: 2024

---

**© 2024 RoyalWay. All rights reserved.**
