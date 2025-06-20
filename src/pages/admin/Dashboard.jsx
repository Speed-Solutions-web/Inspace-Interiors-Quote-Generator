import React, { Component } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import StatCard from '../../components/StatCard';
import LoginsChart from '../../components/LoginsChart';
import QuotesChart from '../../components/QuotesChart';

import { FaRegUser } from "react-icons/fa";
import { BsChatRightQuote } from "react-icons/bs";
import { GoVersions } from "react-icons/go";
import { BiLogInCircle } from "react-icons/bi";

const baseUrl = 'https://inspace-quote-backend.onrender.com';

export default class Dashboard extends Component {
  state = {
    totalUsers: 0,
    totalQuotes: 0,
    totalVersions: 0,
    todayLogins: 0,
    loginsChartData: [],
    quotesChartData: [],
  };

  componentDidMount() {
    this.fetchDashboardData();
  }

  fetchDashboardData = async () => {
    const token = localStorage.getItem('jwt_token') || Cookies.get('jwt_token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    try {
      const [usersRes, quotesRes, versionsRes, loginsRes, loginsChartRes, quotesChartRes] = await Promise.all([
        axios.get(`${baseUrl}/api/users`, config),
        axios.get(`${baseUrl}/api/quotations`, config),
        axios.get(`${baseUrl}/api/quotations/versions`, config),
        axios.get(`${baseUrl}/api/users/logins/today`, config),
        axios.get(`${baseUrl}/api/analytics/logins/week`, config),
        axios.get(`${baseUrl}/api/analytics/quotes/week`, config),
      ]);

      this.setState({
        totalUsers: usersRes.data.length,
        totalQuotes: quotesRes.data.length,
        totalVersions: versionsRes.data.total || 0,
        todayLogins: loginsRes.data.count || 0,
        loginsChartData: this.formatMultiUserChartData(loginsChartRes.data),
        quotesChartData: this.formatChartData(quotesChartRes.data),
      });
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
    }
  };

  formatChartData = (data) => {
    const labels = data.map(item => item._id);
    const counts = data.map(item => item.count);
    return { labels, datasets: [{ label: 'Count', data: counts }] };
  };

  formatMultiUserChartData = (data) => {
    const { days, users } = data;
    const datasets = users.map(user => ({
      label: user.name,
      data: user.counts,
      borderColor: '#' + Math.floor(Math.random()*16777215).toString(16),
      backgroundColor: 'rgba(0,0,0,0.05)',
      fill: false,
      tension: 0.4,
    }));
    return { labels: days, datasets };
  };

  render() {
    const { totalUsers, totalQuotes, totalVersions, todayLogins, loginsChartData, quotesChartData } = this.state;

    return (
      <div className="container-fulid">
        <h3 className="fs-small text-start ms-4">Dashboard</h3>
        <div className="row">
          <StatCard icon={<FaRegUser size={36} className="text-muted" />} count={totalUsers} label="Total Users" />
          <StatCard icon={<BsChatRightQuote size={36} className="text-muted" />} count={totalQuotes} label="Total Quotes" />
          <StatCard icon={<GoVersions size={36} className="text-muted" />} count={totalVersions} label="Total Versions" />
          <StatCard icon={<BiLogInCircle size={36} className="text-muted" />} count={todayLogins} label="Today Logins" />
        </div>

        <div className="row mt-4">
          <div className="col-md-6 mb-4">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <LoginsChart data={loginsChartData} />
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-4">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <QuotesChart data={quotesChartData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
