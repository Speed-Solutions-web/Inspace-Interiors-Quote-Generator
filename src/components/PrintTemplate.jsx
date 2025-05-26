// ✅ FINAL UPDATED PrintTemplate.jsx
import { forwardRef } from 'react'

const PrintTemplate = forwardRef(({ quotationInfo, sections, grandTotal }, ref) => {
  const calculateArea = (item) => {
    const length = parseFloat(item.dimensions.length) || 0
    const breadth = parseFloat(item.dimensions.breadth) || 0
    return length * breadth
  }

  const calculateItemTotal = (item) => {
    const area = calculateArea(item)
    const rate = parseFloat(item.unitPrice) || 0
    return area * rate
  }

  const calculateSectionTotal = (section) => {
    return section.items.reduce((total, item) => total + calculateItemTotal(item), 0)
  }

  return (
    <div ref={ref} className="p-8 bg-white max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary-800">{quotationInfo.companyName}</h1>
        <p className="text-gray-600">{quotationInfo.companyAddress}</p>
        <p className="text-gray-600">{quotationInfo.companyPhone} | {quotationInfo.companyEmail}</p>
      </div>

      {/* Quotation Info */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div>
          <p className="text-gray-700 font-medium">Quotation #: {quotationInfo.quotationNumber}</p>
          <p className="text-gray-700 font-medium">Date: {quotationInfo.date}</p>
        </div>
        <div>
          <p className="text-gray-700 font-medium">Client: {quotationInfo.clientName}</p>
          <p className="text-gray-700 font-medium">Phone: {quotationInfo.clientPhone}</p>
          <p className="text-gray-700 font-medium">Project Location: {quotationInfo.projectLocation}</p>
        </div>
      </div>

      {/* Sections */}
      {sections.map((section) => (
        <div key={section.id} className="mb-8">
          <h3 className="text-xl font-semibold text-primary-800 mb-4">{section.name}</h3>

          {section.items.length > 0 ? (
            <table className="w-full border-collapse mb-2">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-3 py-2 text-left text-sm">Item</th>
                  <th className="border px-3 py-2 text-left text-sm">Nature of Work</th>
                  <th className="border px-3 py-2 text-left text-sm">Length</th>
                  <th className="border px-3 py-2 text-left text-sm">Breadth</th>
                  <th className="border px-3 py-2 text-left text-sm">Area (sq.ft)</th>
                  <th className="border px-3 py-2 text-left text-sm">Rate</th>
                  <th className="border px-3 py-2 text-left text-sm">Total</th>
                </tr>
              </thead>
              <tbody>
                {section.items.map((item) => {
                  const area = calculateArea(item)
                  const total = calculateItemTotal(item)

                  return (
                    <tr key={item.id}>
                      <td className="border px-3 py-2 text-sm">{item.name}</td>
                      <td className="border px-3 py-2 text-sm">{item.natureOfWork || '-'}</td>
                      <td className="border px-3 py-2 text-sm">{item.dimensions.length}</td>
                      <td className="border px-3 py-2 text-sm">{item.dimensions.breadth}</td>
                      <td className="border px-3 py-2 text-sm">{area.toFixed(2)}</td>
                      <td className="border px-3 py-2 text-sm">₹{parseFloat(item.unitPrice).toFixed(2)}</td>
                      <td className="border px-3 py-2 text-sm font-medium">₹{total.toFixed(2)}</td>
                    </tr>
                  )
                })}
                <tr className="bg-gray-100">
                  <td colSpan="6" className="border px-3 py-2 text-right font-medium">Section Total:</td>
                  <td className="border px-3 py-2 font-bold">₹{calculateSectionTotal(section).toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 italic">No items in this section</p>
          )}
        </div>
      ))}

      {/* Grand Total */}
      <div className="text-right mt-6">
        <p className="text-lg font-medium text-gray-700">Grand Total:</p>
        <p className="text-2xl font-bold text-primary-800">₹{grandTotal.toFixed(2)}</p>
      </div>

      {/* Terms */}
      <div className="mt-12">
        <h3 className="text-lg font-semibold mb-2">Terms & Conditions:</h3>
        <ul className="text-sm text-gray-700 list-decimal pl-5">
          <li>50% advance payment required to start the work.</li>
          <li>Balance payment to be made before installation.</li>
          <li>Prices are valid for 30 days from the date of quotation.</li>
          <li>Delivery time: 4–6 weeks from the date of order confirmation.</li>
        </ul>
        <p className="mt-3 text-gray-700 whitespace-pre-line">
          <b>Note: <br/> </b>{quotationInfo.additionalNote}
        </p>
      </div>

      {/* Signature */}
      <div className="mt-12 pt-8 border-t border-gray-300 grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600 mb-10">Customer Signature</p>
          <div className="border-t border-gray-400 w-40"></div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600 mb-10">For {quotationInfo.companyName}</p>
          <div className="border-t border-gray-400 w-40 ml-auto"></div>
          <p className="text-sm text-gray-600 mt-1">Authorized Signatory</p>
        </div>
      </div>
    </div>
  )
})

PrintTemplate.displayName = 'PrintTemplate'

export default PrintTemplate