// ✅ Fully updated QuoteDetails.jsx with section structure fixes and dropdown compatibility
import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
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
import { ClipLoader } from 'react-spinners'

const baseUrl = 'http://localhost:5000/api'

function QuoteDetails() {
  const { id: clientId } = useParams()
  const navigate = useNavigate()

  const [quotationInfo, setQuotationInfo] = useState({})
  const [termsType, setTermsType] = useState('')
  const [pricingRates, setPricingRates] = useState({})
  const [sections, setSections] = useState([])
  const [versions, setVersions] = useState([])
  const [selectedVersion, setSelectedVersion] = useState('')
  const [isLoading, setIsLoading] = useState(true)

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

  useEffect(() => {
    if (!clientId) {
      navigate('/admin/quotes')
      return
    }
    fetchVersions()
  }, [clientId])

  const fetchVersions = async () => {
    try {
      const token = Cookies.get('jwt_token')
      const res = await axios.get(`${baseUrl}/quotations/client/${clientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setVersions(res.data)
      const latest = res.data[res.data.length - 1]
      loadVersionDetails(latest._id)
    } catch (err) {
      console.error('Failed to fetch versions:', err)
    }
  }

  const loadVersionDetails = async (versionId) => {
    try {
      const token = Cookies.get('jwt_token')
      const res = await axios.get(`${baseUrl}/quotations/${versionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = res.data

      // Fix missing structure
      const normalizedSections = (data.sections || []).map(section => ({
        id: section.id || uuidv4(),
        name: section.name || '',
        items: (section.items || []).map(item => ({
          itemId: item.itemId || uuidv4(),
          name: item.name || '',
          unit: item.unit || '',
          unitPrice: item.unitPrice || '',
          dimensions: {
            length: item.dimensions?.length || '',
            breadth: item.dimensions?.breadth || ''
          }
        }))
      }))

      setQuotationInfo(data.quotationInfo)
      setPricingRates(data.pricingRates)
      setSections(normalizedSections)
      setTermsType(data.termsType)
      setSelectedVersion(data.version)
      setIsLoading(false)
    } catch (err) {
      console.error('Failed to load version details:', err)
    }
  }

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

  const handleSaveNewVersion = async () => {
    try {
      const token = Cookies.get('jwt_token')
      await axios.post(`${baseUrl}/quotations`, {
        quotationInfo,
        pricingRates,
        sections,
        termsType,
        clientId,
        version: versions.length + 1
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      alert('Saved as new version!')
      fetchVersions()
    } catch (err) {
      console.error('Failed to save version:', err)
    }
  }

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: quotationInfo.quotationNumber || 'Quotation'
  })

  if (isLoading) {
    return <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}><ClipLoader size={50} /></div>
  }

  return (
    <div className="container-fluid py-4 bg-light">
      <div className="container">
        <div className="d-flex align-items-center gap-2">
          <h4 className='fw-bold'>Quotation Version:</h4>
          <select
            name="version"
            id="QuoteVersions"
            className='form-control'
            style={{ maxWidth: 170 }}
            value={selectedVersion}
            onChange={(e) => {
              const selected = versions.find(v => v.version === parseInt(e.target.value))
              if (selected) loadVersionDetails(selected._id)
            }}
          >
            <option value="">-- select version --</option>
            {versions.map(v => (
              <option key={v._id} value={v.version}>Version {v.version}</option>
            ))}
          </select>
        </div>

        <div className="row g-4 mt-3">
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
              onAddSection={handleAddSection}
              onUpdateSection={handleUpdateSection}
              onRemoveSection={handleRemoveSection}
              pricingRates={pricingRates}
            />
          </div>

          <div className="col-lg-4">
            <div className="sticky-top" style={{ top: '80px' }}>
              <TotalSummary grandTotal={calculateGrandTotal()} />

              <div className="card p-3 mb-3">
                <label className="form-label fw-semibold">Additional Note</label>
                <textarea
                  name="additionalNote"
                  value={quotationInfo.additionalNote || ''}
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
                  onChange={(e) => setTermsType(e.target.value)}
                >
                  <option value="">-- Select Terms Type --</option>
                  <option value="Gurjan Basic">Gurjan 710 Basic</option>
                  <option value="Gurjan BWP">Gurjan 710 BWP</option>
                  <option value="HDHMR">HDHMR Material</option>
                </select>
              </div>

              <button onClick={handleSaveNewVersion} className='btn btn-success w-100'>Save as New Version</button>
              <button onClick={() => window.location.reload()} className="btn btn-danger w-100 mt-3">Clear All & Start Fresh</button>

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

export default QuoteDetails;
