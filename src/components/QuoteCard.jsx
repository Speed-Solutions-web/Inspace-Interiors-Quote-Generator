import React, { Component } from 'react';
import { MdDelete } from "react-icons/md";
import { withRouter } from '../utils/withRouter';

class QuoteCard extends Component {
  handleCardClick = () => {
    const { navigate, cardDetails } = this.props;
    navigate(`/admin/quotes/${cardDetails.clientId}`); // Clean, no state needed
  };

  render() {
    const { cardDetails, onDelete } = this.props;
    const { name, projectLocation, quoteCreatedBy, quoteCreatedOn } = cardDetails;
    const formattedDate = new Date(quoteCreatedOn).toLocaleDateString();

    return (
      <div className='col-12 col-md-4 mt-4'>
        <div
          className="quote-card border p-3 rounded shadow-sm mb-4 bg-white"
          onClick={this.handleCardClick}
          style={{ cursor: 'pointer' }}
        >
          <div className="d-flex align-items-center">
            <h3 className="quote-name mb-2 text-darkred" style={{ fontSize: 26 }}>
              {name}'s Quote
            </h3>
            <button
              type="button"
              className='btn ms-auto'
              onClick={(e) => {
                e.stopPropagation(); // Prevent card click when deleting
                onDelete();
              }}
            >
              <MdDelete size={26} className='text-danger' />
            </button>
          </div>
          <p className='fw-bold'>
            Project Location: <span className='text-muted fw-normal'>{projectLocation}</span>
          </p>
          <div className="d-flex justify-content-between mt-2">
            <p className='fw-bold'>
              Quote Created By: <span className="text-muted fw-normal">{quoteCreatedBy}</span>
            </p>
            <p className='fw-bold'>
              Quote Created On: <span className="text-muted fw-normal">{formattedDate}</span>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(QuoteCard);
