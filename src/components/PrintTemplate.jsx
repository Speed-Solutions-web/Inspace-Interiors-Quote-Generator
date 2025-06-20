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

  // 🟨 Get selected terms type from localStorage
  const termsType = localStorage.getItem('termsType') || ''

  // ✅ Terms Generator
  const renderTermsByType = (type) => {
    if (type === 'Gurjan Basic') {
      return `
      1. This quotation applies to Gurjan 710 Basic-grade plywood.
      2. Inner Laminate of 0.8mm thickness.
      3. External Laminate of 1mm thickness glossy/mat.
      4. Hardware of one year standard warranty.
      5. Handles of basic ss model.
      6. Wire baskets included.`
    } else if (type === 'Gurjan BWP') {
      return `
      1. Playwood of BWP Gurjan 710 grade.
      2. Innter Laminate of 0.8mm thickness + Fabric model.
      3. External Laminate of 1mm thickness glossy/mat.
      4. Hardware of 5 year standard warranty.
      5. G profile handles for kitchen and midvariant for wardobes ss make
      6. Wire basket included.`
    } else if (type === 'HDHMR') {
      return `
      1. HDHMR Sheets will be used.
      2. Innter Laminate of 0.8mm thickness + Fabric model.
      3. External Laminate of 1mm thickness glossy/mat.
      4. Hardware equivalent to Ebco/Hittich/Godrage/Nimmi.
      5. G profile handles for kitchen and highend model handles for all.
      6. Tandom Baskets. 
      `
    }
    return ''
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
                    <tr key={item.itemId}>
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

      {/* NOTE */}
      <div className="mt-12">
        <h3 className="text-lg font-semibold mb-2">Note:</h3>
        <p className="text-sm text-gray-700 whitespace-pre-line">
          1. 50% advance payment required to start the work.<br />
          2. 20% After Carcasing work.<br />
          3. 20% After at the time of hardware.<br />
          4. 10% Before site handover.<br />
          5. Prices are valid for 30 days from the date of quotation.<br />
          {quotationInfo.additionalNote && `\n${quotationInfo.additionalNote}`}
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

      {/* Terms & Conditions Page */}
      {termsType && (
        <>
          <div className="break-before-page pt-12 px-8">
            <h2 className="text-xl font-bold mb-4">Terms & Conditions</h2>
            <pre className="whitespace-pre-wrap text-sm text-gray-700">
              {renderTermsByType(termsType)}
            </pre>

            {/* Signature Block 2 */}
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
        </>
      )}
    </div>
  )
})

PrintTemplate.displayName = 'PrintTemplate'
export default PrintTemplate
