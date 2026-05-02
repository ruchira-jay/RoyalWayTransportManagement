import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import '../styles/Reports.css';

function Reports() {
  // Dummy data for reports
  const reportStats = [
    {
      id: 1,
      title: 'Total Trips',
      value: '1,284',
      percentage: '+12.5%',
      trend: 'up',
      color: '#1e40af'
    },
    {
      id: 2,
      title: 'Attendance Rate',
      value: '94.3%',
      percentage: '+2.1%',
      trend: 'up',
      color: '#059669'
    },
    {
      id: 3,
      title: 'Average Cost/Trip',
      value: 'LKR1600.20',
      percentage: '-3.2%',
      trend: 'down',
      color: '#dc2626'
    },
    {
      id: 4,
      title: 'Driver Safety Score',
      value: '98.5%',
      percentage: '+1.8%',
      trend: 'up',
      color: '#7c3aed'
    }
  ];

  const monthlyData = [
    { month: 'Jan', trips: 320, students: 245, cost: 8500 },
    { month: 'Feb', trips: 350, students: 260, cost: 9200 },
    { month: 'Mar', trips: 390, students: 280, cost: 10100 },
    { month: 'Apr', trips: 420, students: 295, cost: 11200 },
    { month: 'May', trips: 450, students: 310, cost: 12500 },
    { month: 'Jun', trips: 480, students: 325, cost: 13800 }
  ];

  const routePerformance = [
    { route: 'Route A', trips: 245, students: 89, efficiency: '98%' },
    { route: 'Route B', trips: 198, students: 76, efficiency: '95%' },
    { route: 'Route C', trips: 276, students: 102, efficiency: '97%' },
    { route: 'Route D', trips: 215, students: 81, efficiency: '96%' },
    { route: 'Route E', trips: 350, students: 127, efficiency: '99%' }
  ];

  const driverStats = [
    { name: 'John Smith', trips: 156, rating: 4.8, status: 'Active' },
    { name: 'Sarah Johnson', trips: 142, rating: 4.9, status: 'Active' },
    { name: 'Michael Brown', trips: 138, rating: 4.7, status: 'Active' },
    { name: 'Emma Davis', trips: 145, rating: 4.8, status: 'Active' },
    { name: 'David Wilson', trips: 139, rating: 4.6, status: 'Active' }
  ];

  return (
    <div className="app">
      <Sidebar />
      <div className="main-content">
        <Header title="Reports" />
        <div className="content">
          {/* Report Stats Cards */}
          <div className="reports-stats">
            {reportStats.map((stat) => (
              <div key={stat.id} className="report-stat-card">
                <div className="stat-header">
                  <h3>{stat.title}</h3>
                  <span className={`trend ${stat.trend}`}>{stat.percentage}</span>
                </div>
                <div className="stat-value" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <div className="stat-bar" style={{ backgroundColor: stat.color }}></div>
              </div>
            ))}
          </div>

          {/* Monthly Performance */}
          <div className="reports-grid">
            <div className="report-section">
              <h2>Monthly Performance</h2>
              <div className="chart-table">
                <table>
                  <thead>
                    <tr>
                      <th>Month</th>
                      <th>Trips</th>
                      <th>Students</th>
                      <th>Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyData.map((data, index) => (
                      <tr key={index}>
                        <td><strong>{data.month}</strong></td>
                        <td>{data.trips}</td>
                        <td>{data.students}</td>
                        <td>${data.cost.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Route Performance */}
            <div className="report-section">
              <h2>Route Performance</h2>
              <div className="chart-table">
                <table>
                  <thead>
                    <tr>
                      <th>Route</th>
                      <th>Trips</th>
                      <th>Students</th>
                      <th>Efficiency</th>
                    </tr>
                  </thead>
                  <tbody>
                    {routePerformance.map((route, index) => (
                      <tr key={index}>
                        <td><strong>{route.route}</strong></td>
                        <td>{route.trips}</td>
                        <td>{route.students}</td>
                        <td>
                          <span className="efficiency-badge">{route.efficiency}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Driver Statistics */}
          <div className="report-section">
            <h2>Top Drivers</h2>
            <div className="drivers-grid">
              {driverStats.map((driver, index) => (
                <div key={index} className="driver-card">
                  <div className="driver-header">
                    <h4>{driver.name}</h4>
                    <span className="driver-status">{driver.status}</span>
                  </div>
                  <div className="driver-stats">
                    <div className="driver-stat-item">
                      <span className="label">Trips</span>
                      <span className="value">{driver.trips}</span>
                    </div>
                    <div className="driver-stat-item">
                      <span className="label">Rating</span>
                      <span className="value rating">
                        <span>★</span> {driver.rating}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;
