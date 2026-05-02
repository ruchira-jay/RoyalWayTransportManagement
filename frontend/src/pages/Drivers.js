import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import api from '../services/api';
import '../styles/Drivers.css';

function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    action: null,
    driverId: null,
    driverName: ''
  });

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/drivers');
      console.log('Drivers fetched:', response.data);
      console.log('First driver data:', response.data[0]);
      setDrivers(response.data);
    } catch (error) {
      console.error('Error fetching drivers:', error);
      setError('Failed to load drivers. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const openConfirmDialog = (action, driverId, driverName) => {
    setConfirmDialog({
      open: true,
      action,
      driverId,
      driverName
    });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({
      open: false,
      action: null,
      driverId: null,
      driverName: ''
    });
  };

  const confirmAction = async () => {
    const { action, driverId } = confirmDialog;
    closeConfirmDialog();

    if (action === 'approve') {
      handleApprove(driverId);
    } else if (action === 'reject') {
      handleReject(driverId);
    }
  };

  const handleApprove = async (id) => {
    try {
      setError('');
      setSuccessMessage('');
      await api.put(`/drivers/approve/${id}`);
      setSuccessMessage('Driver approved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      // Immediately refresh the list
      await fetchDrivers();
    } catch (error) {
      console.error('Error approving driver:', error);
      setError('Failed to approve driver');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleReject = async (id) => {
    try {
      setError('');
      setSuccessMessage('');
      await api.put(`/drivers/reject/${id}`);
      setSuccessMessage('Driver rejected successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      // Immediately refresh the list
      await fetchDrivers();
    } catch (error) {
      console.error('Error rejecting driver:', error);
      setError('Failed to reject driver');
      setTimeout(() => setError(''), 3000);
    }
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 'N/A';
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="app">
      <Sidebar />
      <div className="main-content">
        <Header title="Driver Approvals" />
        <div className="content">
          <div className="table-container">
            <div className="section-header">
              <h2>Driver Applications</h2>
              <p className="section-count">{drivers.length} drivers</p>
            </div>

            {error && (
              <div className="error-message" style={{ marginBottom: '15px' }}>
                {error}
              </div>
            )}

            {successMessage && (
              <div className="success-message" style={{ marginBottom: '15px' }}>
                {successMessage}
              </div>
            )}

            {/* Debug Info - Remove in production */}
            {drivers.length > 0 && drivers[0] && !drivers[0].name && (
              <div className="warning-message" style={{ marginBottom: '15px', background: '#fff3cd', color: '#856404', padding: '12px 16px', borderRadius: '8px', borderLeft: '4px solid #ffc107' }}>
                <strong>⚠️ Data Issue Detected:</strong> Driver records exist but are missing required fields (name, email, etc.). 
                This usually means you have old driver records from a previous database schema.
                <br/><br/>
                <strong>Solution:</strong>
                <ol style={{ marginLeft: '20px', marginTop: '10px' }}>
                  <li>Delete old driver records from database</li>
                  <li>Register a new driver through the mobile app</li>
                  <li>Or run: <code style={{ background: '#f5f5f5', padding: '2px 6px', borderRadius: '3px' }}>cd backend && node cleanupOldDrivers.js</code></li>
                </ol>
              </div>
            )}

            {loading ? (
              <p>Loading drivers...</p>
            ) : drivers.length === 0 ? (
              <p>No drivers registered yet.</p>
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="drivers-table-wrapper desktop-view">
                  <table className="drivers-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>NIC</th>
                        <th>Age</th>
                        <th>Route</th>
                        <th>Status</th>
                        <th>Registered</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {drivers.map((driver) => {
                        const age = calculateAge(driver.dateOfBirth);
                        const status = driver.driverStatus || 'pending';
                        const statusLabel = status.charAt(0).toUpperCase() + status.slice(1);
                        
                        return (
                          <tr key={driver._id} className="driver-row">
                            <td className="col-name">{driver.name || 'N/A'}</td>
                            <td className="col-email">{driver.email || 'N/A'}</td>
                            <td className="col-phone">{driver.phoneNumber || 'N/A'}</td>
                            <td className="col-nic">{driver.nicNumber || 'N/A'}</td>
                            <td className="col-age">{age}</td>
                            <td className="col-route">
                              {driver.assignedRoute ? (
                                <span className="route-badge">{driver.assignedRoute}</span>
                              ) : (
                                'N/A'
                              )}
                            </td>
                            <td className="col-status">
                              <span className={`status-badge status-${status}`}>
                                {statusLabel}
                              </span>
                            </td>
                            <td className="col-date">
                              {driver.createdAt ? new Date(driver.createdAt).toLocaleDateString() : 'N/A'}
                            </td>
                            <td className="col-actions">
                              <div className="action-buttons">
                                {status === 'pending' && (
                                  <>
                                    <button
                                      className="btn-modern btn-approve"
                                      onClick={() => openConfirmDialog('approve', driver._id, driver.name)}
                                      title="Approve Driver"
                                    >
                                      Approve
                                    </button>
                                    <button
                                      className="btn-modern btn-reject"
                                      onClick={() => openConfirmDialog('reject', driver._id, driver.name)}
                                      title="Reject Driver"
                                    >
                                      Reject
                                    </button>
                                  </>
                                )}
                                {status === 'approved' && (
                                  <span className="status-text approved">Approved</span>
                                )}
                                {status === 'rejected' && (
                                  <span className="status-text rejected">Rejected</span>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="drivers-cards-wrapper mobile-view">
                  {drivers.map((driver) => {
                    const age = calculateAge(driver.dateOfBirth);
                    const status = driver.driverStatus || 'pending';
                    const statusLabel = status.charAt(0).toUpperCase() + status.slice(1);
                    
                    return (
                      <div key={driver._id} className="driver-card">
                        <div className="card-header">
                          <h3 className="driver-name">{driver.name || 'N/A'}</h3>
                          <span className={`status-badge status-${status}`}>
                            {statusLabel}
                          </span>
                        </div>
                        <div className="card-body">
                          <div className="info-row">
                            <span className="info-label">Email:</span>
                            <span className="info-value">{driver.email || 'N/A'}</span>
                          </div>
                          <div className="info-row">
                            <span className="info-label">Phone:</span>
                            <span className="info-value">{driver.phoneNumber || 'N/A'}</span>
                          </div>
                          <div className="info-row">
                            <span className="info-label">NIC:</span>
                            <span className="info-value">{driver.nicNumber || 'N/A'}</span>
                          </div>
                          <div className="info-row">
                            <span className="info-label">Age:</span>
                            <span className="info-value">{age}</span>
                          </div>
                          <div className="info-row">
                            <span className="info-label">Route:</span>
                            <span className="info-value">
                              {driver.assignedRoute ? (
                                <span className="route-badge">{driver.assignedRoute}</span>
                              ) : (
                                'N/A'
                              )}
                            </span>
                          </div>
                          <div className="info-row">
                            <span className="info-label">Registered:</span>
                            <span className="info-value">
                              {driver.createdAt ? new Date(driver.createdAt).toLocaleDateString() : 'N/A'}
                            </span>
                          </div>
                        </div>
                        {status === 'pending' && (
                          <div className="card-actions">
                            <button
                              className="btn-modern btn-approve"
                              onClick={() => openConfirmDialog('approve', driver._id, driver.name)}
                            >
                              Approve
                            </button>
                            <button
                              className="btn-modern btn-reject"
                              onClick={() => openConfirmDialog('reject', driver._id, driver.name)}
                            >
                              Reject
                            </button>
                          </div>
                        )}
                        {status === 'approved' && (
                          <div className="card-actions">
                            <span className="status-text approved">Approved</span>
                          </div>
                        )}
                        {status === 'rejected' && (
                          <div className="card-actions">
                            <span className="status-text rejected">Rejected</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {confirmDialog.open && (
        <div className="modal-overlay">
          <div className="confirmation-modal">
            <div className="modal-header">
              <h3>Confirm Action</h3>
            </div>
            <div className="modal-body">
              <p>
                Are you sure you want to <strong>{confirmDialog.action === 'approve' ? 'approve' : 'reject'}</strong> the driver application for <strong>{confirmDialog.driverName}</strong>?
              </p>
            </div>
            <div className="modal-footer">
              <button
                className="btn-modal btn-cancel"
                onClick={closeConfirmDialog}
              >
                Cancel
              </button>
              <button
                className={`btn-modal ${confirmDialog.action === 'approve' ? 'btn-confirm-approve' : 'btn-confirm-reject'}`}
                onClick={confirmAction}
              >
                {confirmDialog.action === 'approve' ? 'Approve' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Drivers;
