import { FaFileInvoiceDollar } from 'react-icons/fa'

const TotalSummary = ({ grandTotal }) => {
  return (
    <div className="card mb-6">
      <div className="flex items-center justify-center mb-4">
        <FaFileInvoiceDollar className="text-primary-700 text-xl mr-2" />
        <h2 className="text-xl font-bold text-gray-800">Summary</h2>
      </div>
      
      <div className="text-center p-4 bg-gray-50 rounded-lg">
        <div className="text-sm text-gray-600 mb-2">Grand Total</div>
        <div className="text-3xl font-bold text-primary-800">
          ₹{grandTotal.toFixed(2)}
        </div>
      </div>
    </div>
  )
}

export default TotalSummary