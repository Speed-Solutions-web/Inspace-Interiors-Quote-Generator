import React, { Component } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { FiDownload } from 'react-icons/fi';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import baseUrl from '../../api/BaseUrl';

export default class Users extends Component {
  state = {
    users: [],
    searchTerm: '',
    showModal: false,
    isEditing: false,
    isLoading: false,
    currentUser: {
      id: null,
      name: '',
      email: '',
      phone: '',
      photo: '',
    },
  };

  componentDidMount() {
    this.fetchUsers();
  }

  fetchUsers = async () => {
    try {
      const token = Cookies.get('jwt_token');
      this.setState({ isLoading: true });
      const res = await axios.get(`${baseUrl}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      this.setState({ users: res.data, isLoading: false });
    } catch (err) {
      console.error('Error fetching users:', err);
      this.setState({ isLoading: false });
    }
  };

  handleSearch = (e) => {
    this.setState({ searchTerm: e.target.value });
  };

  getFilteredUsers = () => {
    const { users, searchTerm } = this.state;
    return users.filter((u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  handleOpenModal = (user = null) => {
    if (user) {
      this.setState({ isEditing: true, currentUser: { ...user }, showModal: true });
    } else {
      this.setState({
        isEditing: false,
        showModal: true,
        currentUser: { id: null, name: '', email: '', phone: '', photo: '' },
      });
    }
  };

  handleCloseModal = () => {
    this.setState({ showModal: false });
  };

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState((prev) => ({
      currentUser: { ...prev.currentUser, [name]: value },
    }));
  };

  handleSave = async () => {
    const { users, isEditing, currentUser } = this.state;
    const token = Cookies.get('jwt_token');

    try {
      if (isEditing) {
        const res = await axios.put(`${baseUrl}/users/${currentUser._id}`, currentUser, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const updated = users.map((u) =>
          u._id === currentUser._id ? res.data.user : u
        );
        this.setState({ users: updated, showModal: false });
      } else {
        const res = await axios.post(`${baseUrl}/users`, currentUser, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.setState({
          users: [...users, res.data.user],
          showModal: false,
        });
      }
    } catch (err) {
      console.error('Error saving user:', err);
    }
  };

  handleDelete = async (id) => {
    const token = Cookies.get('jwt_token');
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`${baseUrl}/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const updatedUsers = this.state.users.filter((u) => u._id !== id);
        this.setState({ users: updatedUsers });
      } catch (err) {
        console.error('Error deleting user:', err);
      }
    }
  };

  handleExport = () => {
    const { users } = this.state;

    const worksheet = XLSX.utils.json_to_sheet(users.map(({ name, email, phone }) => ({
      Name: name,
      Email: email,
      Phone: phone,
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'users.xlsx');
  };

  render() {
    const { showModal, currentUser, isEditing, isLoading } = this.state;
    const filteredUsers = this.getFilteredUsers();

    return (
      <div className="container-fluid py-4">
        <h3 className='mb-3'>Users</h3>

        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
          <button className="btn btn-primary text-white" onClick={() => this.handleOpenModal()}>
            + Add User
          </button>
          <div className="d-flex gap-2">
            <input
              type="text"
              className="form-control"
              placeholder="Search by name..."
              value={this.state.searchTerm}
              onChange={this.handleSearch}
              style={{ maxWidth: '250px' }}
            />
            <button className="btn btn-outline-dark" title="Export to Excel" onClick={this.handleExport}>
              <FiDownload />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2 text-muted">Loading users...</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-striped align-middle">
              <thead className="table-darkred text-white">
                <tr>
                  <th>#</th>
                  <th>Photo</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, i) => (
                    <tr key={user._id}>
                      <td>{i + 1}</td>
                      <td>
                        <img
                          src={user.avatarUrl || 'https://placehold.co/40'}
                          alt="profile"
                          className="rounded-circle"
                          width="40"
                          height="40"
                        />
                      </td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => this.handleOpenModal(user)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => this.handleDelete(user._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center text-muted">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {showModal && (
          <div className="modal d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{isEditing ? 'Edit User' : 'Add User'}</h5>
                  <button type="button" className="btn-close" onClick={this.handleCloseModal}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-2">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={currentUser.name}
                      onChange={this.handleInputChange}
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Phone</label>
                    <input
                      type="text"
                      className="form-control"
                      name="phone"
                      value={currentUser.phone}
                      onChange={this.handleInputChange}
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={currentUser.email}
                      onChange={this.handleInputChange}
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Photo URL</label>
                    <input
                      type="text"
                      className="form-control"
                      name="photo"
                      value={currentUser.photo}
                      onChange={this.handleInputChange}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={this.handleCloseModal}>
                    Cancel
                  </button>
                  <button className="btn btn-primary text-white" onClick={this.handleSave}>
                    {isEditing ? 'Update' : 'Add'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
