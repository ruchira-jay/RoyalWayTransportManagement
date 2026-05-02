import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Sidebar() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Hamburger Button */}
      <button className="hamburger-menu" onClick={toggleMenu}>
        <span className={isMenuOpen ? 'open' : ''}></span>
        <span className={isMenuOpen ? 'open' : ''}></span>
        <span className={isMenuOpen ? 'open' : ''}></span>
      </button>

      {/* Overlay */}
      {isMenuOpen && <div className="menu-overlay" onClick={closeMenu}></div>}

      {/* Sidebar */}
      <div className={`sidebar ${isMenuOpen ? 'active' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <img src="/logo.png" alt="RoyalWay Logo" className="logo-image" />
            <p>School Transportation</p>
          </div>
          <button className="close-menu" onClick={closeMenu}>
            ✕
          </button>
        </div>

        <ul className="sidebar-menu">
          <li>
            <Link to="/dashboard" className={isActive('/dashboard')} onClick={closeMenu}>
              <span className="menu-text">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="/drivers" className={isActive('/drivers')} onClick={closeMenu}>
              <span className="menu-text">Driver Approvals</span>
            </Link>
          </li>
          <li>
            <Link to="/students" className={isActive('/students')} onClick={closeMenu}>
              <span className="menu-text">Students</span>
            </Link>
          </li>
          <li>
            <Link to="/notifications" className={isActive('/notifications')} onClick={closeMenu}>
              <span className="menu-text">Notifications</span>
            </Link>
          </li>
          <li>
            <Link to="/reports" className={isActive('/reports')} onClick={closeMenu}>
              <span className="menu-text">Reports</span>
            </Link>
          </li>
        </ul>

        <div className="sidebar-footer">
          <p>© 2026 RoyalWay</p>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
