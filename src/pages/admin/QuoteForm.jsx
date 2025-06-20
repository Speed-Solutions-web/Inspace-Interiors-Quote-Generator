import { useState, useEffect, useRef } from 'react'
import QuotationForm from '../../components/QuotationForm'
import PricingConfig from '../../components/PricingConfig'
import Sections from '../../components/Sections'
import TotalSummary from '../../components/TotalSummary'
import PdfGenerator from '../../components/PdfGenerator'
import PrintTemplate from '../../components/PrintTemplate'
import { useReactToPrint } from 'react-to-print'
import { v4 as uuidv4 } from 'uuid'

import axios from 'axios'
import Cookies from 'js-cookie'
import baseUrl from '../../api/BaseUrl'

function QuoteForm() {
  const [quotationInfo, setQuotationInfo] = useState({
    quotationNumber: `QT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    date: new Date().toISOString().split('T')[0],
    clientName: '',
    clientPhone: '',
    projectLocation: '',
    additionalNote: '',
    companyName: 'INSPACE INTERIORS',
    companyLogo: 'https://res.cloudinary.com/dmkxqht5d/image/upload/v1722057660/inspase_kafzlu.jpg',
    companyAddress: 'Plot No. 10, New SBH Colony, West Maredpally, Secunderabad - 500026',
    companyPhone: '+91 90300 77709',
    companyEmail: 'info@inspaceinteriors.in',
  })

  const [termsType, setTermsType] = useState('')
  const [pricingRates, setPricingRates] = useState({
    'Panneling': 250,
    'Boxing': 180,
    'Framing': 300,
    'Custom': 0
  })
  const [sections, setSections] = useState([])
  const componentRef = useRef(null)

  const sectionOptions = {
    'Bedrooms': ['Master Bedroom', 'Child Bedroom', 'Guest Bedroom', 'Bedroom 1', 'Bedroom 2', 'Bedroom 3'],
    'Living Spaces': ['Kitchen', 'Living Area', 'Pooja Unit', 'Balcony'],
    'Additional Work': ['False Ceiling', 'Electric Material', 'Electric Charges', 'Putty & Painting']
  }

  const sectionItems = {
    'Master Bedroom': ['Wardrobe', 'TV Unit', 'Study Table', 'Cot', 'Mirror', 'Loft', 'Dressing Unit', 'Washroom Boxes'],
    'Child Bedroom': ['Wardrobe', 'TV Unit', 'Study Table', 'Cot', 'Mirror', 'Loft', 'Dressing Unit', 'Washroom Boxes'],
    'Guest Bedroom': ['Wardrobe', 'TV Unit', 'Study Table', 'Cot', 'Mirror', 'Loft', 'Dressing Unit', 'Washroom Boxes'],
    'Bedroom 1': ['Wardrobe', 'TV Unit', 'Study Table', 'Cot', 'Mirror', 'Loft', 'Dressing Unit', 'Washroom Boxes'],
    'Bedroom 2': ['Wardrobe', 'TV Unit', 'Study Table', 'Cot', 'Mirror', 'Loft', 'Dressing Unit', 'Washroom Boxes'],
    'Bedroom 3': ['Wardrobe', 'TV Unit', 'Study Table', 'Cot', 'Mirror', 'Loft', 'Dressing Unit', 'Washroom Boxes'],
    'Kitchen': ['Below Platform', 'Above Platform', 'Loft', 'Baskets', 'Profile Doors'],
    'Living Area': ['TV Unit', 'Storage Units', 'Display Units', 'Partition', 'Decor', 'Wallpaper', 'Sofa'],
    'Pooja Unit': ['Main Unit', 'Storage', 'Bells', 'Door', 'Boxing', 'Framing', 'Panneling'],
    'Balcony': ['Storage Units', 'Seating', 'Planters', 'Shoe Rack', 'Main Door', 'Decor'],
    'False Ceiling': null,
    'Electric Material': null,
    'Electric Charges': null,
    'Putty & Painting': null
  }

  const handleSaveQuote = async () => {
    try {
      const token = Cookies.get('jwt_token')

      if (!quotationInfo.clientName || !quotationInfo.clientPhone || !quotationInfo.projectLocation) {
        alert('Please fill in client name, phone, and location.')
        return
      }

      // Step 1: Create Client
      const clientRes = await axios.post(`${baseUrl}/clients`, {
        name: quotationInfo.clientName,
        phone: quotationInfo.clientPhone,
        location: quotationInfo.projectLocation,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const clientId = clientRes.data._id || clientRes.data.client?._id

      // Step 2: Create Quotation
      const quotePayload = {
        version: 1,
        pricingRates,
        sections,
        grandTotal: calculateGrandTotal(),
        additionalNote: quotationInfo.additionalNote,
        termsType,
        quotationInfo,
      }

      await axios.post(`${baseUrl}/quotations`, {
        ...quotePayload,
        clientId, // ✅ attach the client ID in the payload
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('Quotation saved successfully!')
    } catch (err) {
      console.error('Failed to save quotation:', err)
      alert('Failed to save quotation. See console for error.')
    }
  }

  useEffect(() => {
    const savedQuotation = localStorage.getItem('quotationInfo')
    const savedSections = localStorage.getItem('quotationSections')
    const savedPricingRates = localStorage.getItem('pricingRates')
    const savedTermsType = localStorage.getItem('termsType')

    if (savedQuotation) setQuotationInfo(JSON.parse(savedQuotation))
    if (savedSections) setSections(JSON.parse(savedSections))
    if (savedPricingRates) setPricingRates(JSON.parse(savedPricingRates))
    if (savedTermsType) setTermsType(savedTermsType)
  }, [])

  useEffect(() => {
    localStorage.setItem('quotationInfo', JSON.stringify(quotationInfo))
    localStorage.setItem('quotationSections', JSON.stringify(sections))
    localStorage.setItem('pricingRates', JSON.stringify(pricingRates))
  }, [quotationInfo, sections, pricingRates])

  const handleQuotationInfoChange = (e) => {
    const { name, value } = e.target
    setQuotationInfo(prev => ({ ...prev, [name]: value }))
  }

  const handleUpdatePricingRate = (type, rate) => {
    setPricingRates(prev => ({ ...prev, [type]: rate }))
  }

  const handleAddSection = () => {
    const newSection = {
      id: uuidv4(),
      name: Object.values(sectionOptions)[0][0],
      items: []
    }
    setSections(prev => [...prev, newSection])
  }

  const handleUpdateSection = (id, updated) => {
    setSections(prev => prev.map(s => s.id === id ? updated : s))
  }

  const handleRemoveSection = (id) => {
    setSections(prev => prev.filter(s => s.id !== id))
  }

  const calculateGrandTotal = () => {
    return sections.reduce((total, section) => {
      const sectionTotal = section.items.reduce((sum, item) => {
        const l = parseFloat(item.dimensions.length) || 0
        const b = parseFloat(item.dimensions.breadth) || 0
        const price = parseFloat(item.unitPrice) || 0
        return sum + (l * b * price)
      }, 0)
      return total + sectionTotal
    }, 0)
  }

  const handleClearAll = () => {
    localStorage.clear()
    window.location.reload()
  }

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: quotationInfo.quotationNumber || 'Quotation',
  })

  return (
    <div className="container-fluid py-4 bg-light">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card p-4 mb-4">
              <QuotationForm quotationInfo={quotationInfo} onChange={handleQuotationInfoChange} />
            </div>

            <div className="card p-4 mb-4">
              <PricingConfig pricingRates={pricingRates} onUpdateRate={handleUpdatePricingRate} />
            </div>

            <Sections
              sections={sections}
              sectionOptions={sectionOptions}
              sectionItems={sectionItems}
              pricingRates={pricingRates}
              onAddSection={handleAddSection}
              onUpdateSection={handleUpdateSection}
              onRemoveSection={handleRemoveSection}
            />
          </div>

          <div className="col-lg-4">
            <div className="sticky-top" style={{ top: '80px' }}>
              <TotalSummary grandTotal={calculateGrandTotal()} />

              <div className="card p-3 mb-3">
                <label className="form-label fw-semibold">Additional Note</label>
                <textarea
                  name="additionalNote"
                  value={quotationInfo.additionalNote}
                  onChange={handleQuotationInfoChange}
                  className="form-control"
                  rows="4"
                  placeholder="Enter any additional notes for this quotation..."
                />
              </div>

              <PdfGenerator
                quotationInfo={quotationInfo}
                sections={sections}
                grandTotal={calculateGrandTotal()}
                termsType={termsType}
              />

              <div className="card p-3 mb-3 mt-3">
                <label className="form-label fw-semibold">Select Terms Type</label>
                <select
                  className="form-select"
                  value={termsType}
                  onChange={(e) => {
                    setTermsType(e.target.value)
                    localStorage.setItem('termsType', e.target.value)
                  }}
                >
                  <option value="">-- Select Terms Type --</option>
                  <option value="Gurjan Basic">Gurjan 710 Basic</option>
                  <option value="Gurjan BWP">Gurjan 710 BWP</option>
                  <option value="HDHMR">HDHMR Material</option>
                </select>
              </div>

              <button type="button" className="btn btn-success w-100" onClick={handleSaveQuote}>
                Save Quote
              </button>

              <button onClick={handleClearAll} className="btn btn-danger w-100 mt-3">
                Clear All & Start Fresh
              </button>

              <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }} aria-hidden="true">
                <PrintTemplate
                  ref={componentRef}
                  quotationInfo={quotationInfo}
                  sections={sections}
                  grandTotal={calculateGrandTotal()}
                  termsType={termsType}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuoteForm
