import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import api from '../services/api';
import '../styles/Students.css';

function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await api.get('/students');
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
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
        <Header title="Students" />
        <div className="content">
          <div className="table-container">
            <div className="section-header">
              <h2>Student Management</h2>
              <p className="section-count">{students.length} students registered</p>
            </div>
            {loading ? (
              <p style={{ marginTop: '10px', color: '#666' }}>Loading students...</p>
            ) : (
              <div className="students-table-wrapper">
                <table className="students-table">
                  <thead>
                    <tr>
                      <th className="col-id">Student ID</th>
                      <th className="col-student">Student Name</th>
                      <th className="col-grade">Grade</th>
                      <th className="col-age">Age</th>
                      <th className="col-parent">Parent Name</th>
                      <th className="col-email">Parent Email</th>
                      <th className="col-route">Route</th>
                      <th className="col-status">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.length === 0 ? (
                      <tr>
                        <td colSpan="8" style={{ textAlign: 'center', padding: '30px' }}>
                          <div className="empty-state">
                            <p>No students registered yet</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      students.map((student) => (
                        <tr key={student._id} className="student-row">
                          <td className="col-id">
                            <span className="student-id-badge">{student.studentId}</span>
                          </td>
                          <td className="col-student">
                            <div className="student-info">
                              <span className="student-name">{student.childName}</span>
                            </div>
                          </td>
                          <td className="col-grade">
                            <span className="grade-badge">{student.childClass}</span>
                          </td>
                          <td className="col-age">
                            <span>{calculateAge(student.childDateOfBirth)}</span>
                          </td>
                          <td className="col-parent">
                            <div className="parent-info">
                              <span className="parent-name">{student.parentName}</span>
                            </div>
                          </td>
                          <td className="col-email">
                            <span className="parent-email">{student.parentEmail}</span>
                          </td>
                          <td className="col-route">
                            <span className="route-badge">{student.route}</span>
                          </td>
                          <td className="col-status">
                            <span className={`status-badge ${student.assignedDriver ? 'assigned' : 'pending'}`}>
                              {student.assignedDriver ? 'Assigned' : 'Pending'}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Students;
