// ✅ Updated Quotes.jsx to fetch saved client quotes from backend
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import QuoteCard from '../../components/QuoteCard';
import axios from 'axios';
import Cookies from 'js-cookie';
import baseUrl from '../../api/BaseUrl';

export default class Quotes extends Component {
  state = {
    quoteData: [],
    searchText: '',
    startDate: '',
    endDate: '',
  };

  componentDidMount() {
    this.fetchQuotes();
  }

  fetchQuotes = async () => {
    try {
      const token = Cookies.get('jwt_token');

      // 1. Get all quotations
      const res = await axios.get(`${baseUrl}/quotations`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const quotes = res.data;

      // 2. Retain only latest version per clientId
      const latestQuotesMap = {};
      quotes.forEach(q => {
        const existing = latestQuotesMap[q.clientId];
        if (!existing || new Date(q.createdAt) > new Date(existing.createdAt)) {
          latestQuotesMap[q.clientId] = q;
        }
      });
      const latestQuotes = Object.values(latestQuotesMap);

      // 3. Fetch all unique user IDs from the latest quotes
      const uniqueUserIds = [...new Set(latestQuotes.map(q => q.createdBy))];

      const userFetches = await Promise.all(
        uniqueUserIds.map(id =>
          axios.get(`${baseUrl}/users/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );

      const userMap = {};
      userFetches.forEach(res => {
        const user = res.data;
        userMap[user._id] = user.name;
      });

      const formattedQuotes = latestQuotes.map(q => ({
        id: q._id,
        clientId: q.clientId,
        name: q.quotationInfo.clientName,
        projectLocation: q.quotationInfo.projectLocation,
        quoteCreatedBy: userMap[q.createdBy] || 'N/A',
        quoteCreatedOn: new Date(q.createdAt),
      }));

      this.setState({ quoteData: formattedQuotes });

    } catch (err) {
      console.error('Error fetching quotes:', err);
    }
  };

  handleDelete = async (clientId) => {
    const confirmDelete = window.confirm(
      "⚠️ If you delete this quote, all versions related to this client will be permanently removed from the database.\n\nDo you want to continue?"
    );

    if (!confirmDelete) return;

    try {
      const token = Cookies.get('jwt_token');
      await axios.delete(`${baseUrl}/quotations/client/${clientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedData = this.state.quoteData.filter(item => item.clientId !== clientId);
      this.setState({ quoteData: updatedData });
      alert("Client's quotations deleted successfully!");
    } catch (err) {
      console.error('Error deleting client quotations:', err);
      alert("❌ Failed to delete. Please try again.");
    }
  };



  handleSearchChange = (e) => {
    this.setState({ searchText: e.target.value });
  };

  handleStartDateChange = (e) => {
    this.setState({ startDate: e.target.value });
  };

  handleEndDateChange = (e) => {
    this.setState({ endDate: e.target.value });
  };

  applyFilters = () => {
    const { quoteData, searchText, startDate, endDate } = this.state;

    return quoteData.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchText.toLowerCase());
      const createdOn = new Date(item.quoteCreatedOn).toISOString().split('T')[0];

      const isAfterStart = startDate ? createdOn >= startDate : true;
      const isBeforeEnd = endDate ? createdOn <= endDate : true;

      return matchesSearch && isAfterStart && isBeforeEnd;
    });
  };

  render() {
    const filteredQuotes = this.applyFilters();

    return (
      <div>
        <div className="container-fluid">
          <h3 className='mt-3'>Quotes</h3>
          <div className="row">
            <div className="col-md-4 mt-2">
              <Link to='/admin/create-quote'><button type="button" className='btn btn-primary'>Create New Quote</button></Link>
            </div>
            <div className="col-md-4 mt-2">
              <input
                type="search"
                className="form-control"
                placeholder="Search by name"
                onChange={this.handleSearchChange}
              />
            </div>
            <div className="col-md-2 mt-2">
              <input
                type="date"
                className="form-control"
                onChange={this.handleStartDateChange}
              />
            </div>
            <div className="col-md-2 mt-2">
              <input
                type="date"
                className="form-control"
                onChange={this.handleEndDateChange}
              />
            </div>
          </div>

          <div className="row">
            {filteredQuotes.length === 0 ? (
              <div className="text-center mt-4">
                <p className="text-muted">No quotes found.</p>
              </div>
            ) : (
              filteredQuotes.map(eachItem => (
                <QuoteCard
                  key={eachItem.id}
                  cardDetails={eachItem}
                  onDelete={() => this.handleDelete(eachItem.clientId)}
                  onClick={() => this.props.navigate(`/admin/create-quote/${eachItem.id}`)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    );
  }
}