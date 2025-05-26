import { FaTools } from 'react-icons/fa'

const PricingConfig = ({ pricingRates, onUpdateRate }) => {
  const handleRateChange = (workType, newRate) => {
    onUpdateRate(workType, parseFloat(newRate))
  }

  return (
    <div className="card animate-fade-in mb-8">
      <div className="flex items-center mb-6">
        <FaTools className="text-primary-700 text-xl mr-2" />
        <h2 className="text-2xl font-bold text-gray-800">Pricing Configuration</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(pricingRates).map(([workType, rate]) => (
          <div key={workType} className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {workType} (₹/sq.ft)
            </label>
            <input
              type="number"
              value={rate}
              onChange={(e) => handleRateChange(workType, e.target.value)}
              className="input-field"
              min="0"
              step="0.01"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default PricingConfig