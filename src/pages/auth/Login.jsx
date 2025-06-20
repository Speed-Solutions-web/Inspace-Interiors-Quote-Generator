import React, { Component } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import withNavigation from '../../utils/withNavigation';

const baseUrl = 'https://inspace-quote-backend.onrender.com';

class Login extends Component {
  state = {
    email: '',
    password: '',
    error: ''
  };

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value, error: '' });
  };

  handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = this.state;

    try {
      const res = await axios.post(`${baseUrl}/api/auth/login`, {
        email,
        password
      });

      // Save JWT token in cookie
      Cookies.set('jwt_token', res.data.token, { expires: 7 });

      // Save user info in localStorage
      localStorage.setItem('user', JSON.stringify(res.data.user));

      const { navigate } = this.props;

      if (res.data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        alert("You don't have enough permissions to access this page.");
      }

    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Login failed';
      this.setState({ error: errorMsg });
    }
  };

  render() {
    const { email, password, error } = this.state;

    return (
      <div className="login-page">
        <div className="container d-flex justify-content-center">
          <form className="row login-form" onSubmit={this.handleLogin}>
            <h3 className='text-center mb-3'>Login</h3>

            <div className="col-12 mt-3">
              <label htmlFor="email" className='text-muted'>Username:</label>
              <input
                type="text"
                id='email'
                name='email'
                value={email}
                onChange={this.handleInputChange}
                placeholder='Enter your email*'
                className='form-control'
                required
              />
            </div>

            <div className="col-12 mt-3">
              <label htmlFor="password" className='text-muted'>Password:</label>
              <input
                type="password"
                id='password'
                name='password'
                value={password}
                onChange={this.handleInputChange}
                placeholder='Enter your Password*'
                className='form-control'
                required
              />
            </div>

            {error && (
              <div className="col-12 mt-2">
                <p className="text-danger text-center">{error}</p>
              </div>
            )}

            <div className="col-12 d-flex justify-content-center mt-4">
              <button className="btn-1 w-100" type="submit">Sign In</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default withNavigation(Login);
