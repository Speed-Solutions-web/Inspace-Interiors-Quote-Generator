import { FaUser, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaFileInvoiceDollar } from 'react-icons/fa'

const QuotationForm = ({ quotationInfo, onChange }) => {
  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Quotation Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="form-group">
          <label className="flex items-center text-gray-700 mb-2">
            <FaFileInvoiceDollar className="mr-2 text-primary-700" />
            Quotation Number
          </label>
          <input
            type="text"
            name="quotationNumber"
            value={quotationInfo.quotationNumber}
            onChange={onChange}
            className="input-field"
            readOnly
          />
        </div>

        <div className="form-group">
          <label className="flex items-center text-gray-700 mb-2">
            <FaCalendarAlt className="mr-2 text-primary-700" />
            Date
          </label>
          <input
            type="date"
            name="date"
            value={quotationInfo.date}
            onChange={onChange}
            className="input-field"
          />
        </div>

        <div className="form-group">
          <label className="flex items-center text-gray-700 mb-2">
            <FaUser className="mr-2 text-primary-700" />
            Client Name
          </label>
          <input
            type="text"
            name="clientName"
            value={quotationInfo.clientName}
            onChange={onChange}
            className="input-field"
            placeholder="Enter client name"
          />
        </div>

        <div className="form-group">
          <label className="flex items-center text-gray-700 mb-2">
            <FaPhone className="mr-2 text-primary-700" />
            Client Phone
          </label>
          <input
            type="tel"
            name="clientPhone"
            value={quotationInfo.clientPhone}
            onChange={onChange}
            className="input-field"
            placeholder="Enter client phone number"
          />
        </div>

        <div className="form-group md:col-span-2">
          <label className="flex items-center text-gray-700 mb-2">
            <FaMapMarkerAlt className="mr-2 text-primary-700" />
            Project Location
          </label>
          <input
            type="text"
            name="projectLocation"
            value={quotationInfo.projectLocation}
            onChange={onChange}
            className="input-field"
            placeholder="Enter project location"
          />
        </div>
      </div>
    </div>
  )
}

export default QuotationForm
