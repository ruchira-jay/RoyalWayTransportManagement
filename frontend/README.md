# RoyalWay School Transportation System - Frontend

React admin dashboard for RoyalWay School Transportation System.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

## Login Credentials

Use the credentials you created in the backend:
- Email: test@test.com
- Password: 123456

## Features

- ✅ Login/Logout
- ✅ Dashboard with statistics
- ✅ Driver approval system
- ✅ Notifications management
- ✅ Responsive design
- ✅ Modern UI with school transport theme

## Pages

1. **Login** - Admin authentication
2. **Dashboard** - Overview with cards (Total Drivers, Approved, Pending, Students, Notifications)
3. **Driver Approvals** - Approve/Reject driver applications
4. **Students** - Student management (coming soon)
5. **Notifications** - View and manage notifications
6. **Reports** - Analytics and reports (coming soon)

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Sidebar.js
│   │   └── Header.js
│   ├── pages/
│   │   ├── Login.js
│   │   ├── Dashboard.js
│   │   ├── Drivers.js
│   │   ├── Students.js
│   │   ├── Notifications.js
│   │   └── Reports.js
│   ├── services/
│   │   └── api.js
│   ├── App.js
│   └── App.css
└── package.json
```

## Backend Connection

Make sure your backend is running on `http://localhost:3000`

If you need to change the API URL, edit `src/services/api.js`
