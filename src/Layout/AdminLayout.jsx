import React, { Component } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';
import { TbLogout } from "react-icons/tb";
import { FaArrowCircleRight, FaArrowCircleLeft } from "react-icons/fa";

export default class AdminLayout extends Component {
  state = {
    isNavActive: false,
    user: null
  };

  componentDidMount() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.setState({ user: JSON.parse(userData) });
    }
  }

  onClickToggleBtn = () => {
    this.setState((prevState) => ({
      isNavActive: !prevState.isNavActive,
    }));
  };

  onClickLogout = () => {
    Cookies.remove('jwt_token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

  render() {
    const { isNavActive, user } = this.state;

    return (
      <div className='min-vh-100 d-flex flex-column'>
        {/* Header */}
        <header className="w-100 bg-darkred d-flex align-items-center px-4 py-2 shadow-sm">
          <h3 className='text-white m-0'>Inspace</h3>
          <div className='ms-auto d-flex align-items-center gap-3'>
            <div className="d-flex align-items-center gap-2">
              <img
                src={user?.avatarUrl || 'https://placehold.co/150x150'}
                className='header-profile rounded-circle'
                alt='Admin'
                style={{ width: '40px', height: '40px', objectFit: 'cover' }}
              />
              <p className='text-light mb-0 fw-semibold'>{user?.name || 'Admin'}</p>
            </div>
            <button type='button' onClick={this.onClickLogout} className='btn' style={{ outline: 'none' }}>
              <TbLogout size={26} className='text-white' title='Logout' />
            </button>
          </div>
        </header>

        {/* Main content layout */}
        <div className="d-flex flex-grow-1" style={{ minHeight: 'calc(100vh - 56px)' }}>
          {/* Sidebar */}
          <aside className={`sidebar ${isNavActive ? 'sidebar-collaps' : ''}`}>
            <ul className='nav flex-column gap-2'>
              <li className='nav-item'>
                <NavLink
                  to="dashboard"
                  className={({ isActive }) =>
                    `nav-link rounded fw-medium ${isActive ? 'bg-white text-dark' : 'text-white'}`
                  }
                >
                  Dashboard
                </NavLink>
              </li>
              <li className='nav-item'>
                <NavLink
                  to="users"
                  className={({ isActive }) =>
                    `nav-link rounded fw-medium ${isActive ? 'bg-white text-dark' : 'text-white'}`
                  }
                >
                  Users
                </NavLink>
              </li>
              <li className='nav-item'>
                <NavLink
                  to="quotes"
                  className={({ isActive }) =>
                    `nav-link rounded fw-medium ${isActive ? 'bg-white text-dark' : 'text-white'}`
                  }
                >
                  Quotes
                </NavLink>
              </li>
              <li className='nav-item'>
                <NavLink
                  to="create-quote"
                  className={({ isActive }) =>
                    `nav-link rounded fw-medium ${isActive ? 'bg-white text-dark' : 'text-white'}`
                  }
                >
                  Create Quote
                </NavLink>
              </li>
            </ul>
          </aside>

          {/* Toggle Icon */}
          <div className="toggle-icon-container" style={{ left: isNavActive ? '0px' : '250px' }}>
            <button type="button" className='btn' onClick={this.onClickToggleBtn}>
              {isNavActive ? (
                <FaArrowCircleRight size={26} className='text-white' title='Open Navbar' />
              ) : (
                <FaArrowCircleLeft size={26} className='text-white' title='Close Navbar' />
              )}
            </button>
          </div>

          {/* Page content */}
          <main className="flex-grow-1 bg-light p-4 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    );
  }
}
