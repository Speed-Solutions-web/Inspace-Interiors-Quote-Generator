import React from 'react'

const StatCard = ({ icon, count, label }) => (
  <div className="col-12 col-md-3 mt-3">
    <div className="border border-light shadow-sm bg-white rounded p-3 d-flex align-items-center gap-4">
      <div className='card-icon-container'>
        {icon}
      </div>
      <div>
        <h1>{count}</h1>
        <span className="text-muted">{label}</span>
      </div>
    </div>
  </div>
);

export default StatCard;