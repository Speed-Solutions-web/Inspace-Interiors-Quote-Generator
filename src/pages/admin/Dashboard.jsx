import React, { Component } from 'react'

import StatCard from '../../components/StatCard'
import LoginsChart from '../../components/LoginsChart';
import QuotesChart from '../../components/QuotesChart';

import { FaRegUser } from "react-icons/fa";
import { BsChatRightQuote } from "react-icons/bs";
import { GoVersions } from "react-icons/go";
import { BiLogInCircle } from "react-icons/bi";

export default class Dashboard extends Component {
  render() {
    return (
      <div>
        <div className="container-fulid">
            <h3 className="fs-small text-start ms-4">Dashboard</h3>
            <div className="row">
                <StatCard icon={<FaRegUser size={36} className="text-muted" />} count={0} label="Total Users" />
                <StatCard icon={<BsChatRightQuote size={36} className="text-muted" />} count={0} label="Total Quotes" />
                <StatCard icon={<GoVersions size={36} className="text-muted" />} count={0} label="Total Versions" />
                <StatCard icon={<BiLogInCircle size={36} className="text-muted" />} count={0} label="Today Logins" />
            </div>
            <div className="row mt-4">
                <div className="col-md-6 mb-4">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-body">
                            <LoginsChart />
                        </div>
                    </div>
                </div>
                <div className="col-md-6 mb-4">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-body">
                            <QuotesChart />
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    )
  }
}
