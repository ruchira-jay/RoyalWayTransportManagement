import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import api, { getAllDrivers, getAllNotifications } from '../services/api';

function Dashboard() {
  const [stats, setStats] = useState({
    totalDrivers: 0,
    approvedDrivers: 0,
    pendingDrivers: 0,
    totalStudents: 0,
    notifications: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Fetching dashboard stats...');
      
      const driversRes = await getAllDrivers();
      console.log('Drivers full response:', driversRes);
      console.log('Drivers data:', driversRes.data);
      
      const notificationsRes = await getAllNotifications();
      console.log('Notifications full response:', notificationsRes);
      console.log('Notifications data:', notificationsRes.data);
      
      const studentsRes = await api.get('/students');
      console.log('Students full response:', studentsRes);
      console.log('Students data:', studentsRes.data);

      const drivers = Array.isArray(driversRes.data) ? driversRes.data : [];
      console.log('Drivers array:', drivers);
      console.log('Drivers count:', drivers.length);
      
      const approved = drivers.filter((d) => d.driverStatus === 'approved').length;
      const pending = drivers.filter((d) => d.driverStatus === 'pending').length;
      console.log('Approved:', approved, 'Pending:', pending);

      const newStats = {
        totalDrivers: drivers.length,
        approvedDrivers: approved,
        pendingDrivers: pending,
        totalStudents: Array.isArray(studentsRes.data) ? studentsRes.data.length : 0,
        notifications: Array.isArray(notificationsRes.data) ? notificationsRes.data.length : 0,
      };

      console.log('Stats calculated:', newStats);
      setStats(newStats);
    } catch (error) {
      console.error('Error fetching stats:', error);
      console.error('Error message:', error.message);
      console.error('Error response:', error.response);
      console.error('Error details:', error.response?.data);
      console.error('Error status:', error.response?.status);
      setError(`Failed to load dashboard data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <Sidebar />
      <div className="main-content">
        <Header title="Dashboard" />
        <div className="content">
          {error && (
            <div style={{
              background: '#fee',
              color: '#c33',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '20px',
              border: '1px solid #fcc'
            }}>
              {error}
            </div>
          )}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              Loading dashboard data...
            </div>
          ) : (
            <div className="dashboard-cards">
              <div className="card">
                <h3>Total Drivers</h3>
                <div className="number">{stats.totalDrivers}</div>
              </div>
              <div className="card">
                <h3>Approved Drivers</h3>
                <div className="number">{stats.approvedDrivers}</div>
              </div>
              <div className="card">
                <h3>Pending Drivers</h3>
                <div className="number">{stats.pendingDrivers}</div>
              </div>
              <div className="card">
                <h3>Total Students</h3>
                <div className="number">{stats.totalStudents}</div>
              </div>
              <div className="card">
                <h3>Notifications</h3>
                <div className="number">{stats.notifications}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
