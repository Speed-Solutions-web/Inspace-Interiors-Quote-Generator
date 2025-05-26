import { useState, useEffect } from 'react'
import Header from './components/Header'
import QuotationForm from './components/QuotationForm'
import PricingConfig from './components/PricingConfig'
import Sections from './components/Sections'
import TotalSummary from './components/TotalSummary'
import PdfGenerator from './components/PdfGenerator'
import { v4 as uuidv4 } from 'uuid'

function App() {
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

  const [pricingRates, setPricingRates] = useState({
    'Panneling': 250,
    'Boxing': 180,
    'Framing': 300,
    'Custom': 0
  })

  const [sections, setSections] = useState([])

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
    const savedQuotation = localStorage.getItem('quotationInfo')
    const savedSections = localStorage.getItem('quotationSections')
    const savedPricingRates = localStorage.getItem('pricingRates')

    if (savedQuotation) {
      setQuotationInfo(JSON.parse(savedQuotation))
    }

    if (savedSections) {
      const parsed = JSON.parse(savedSections)
      if (Array.isArray(parsed) && parsed.length > 0) {
        setSections(parsed)
      }
    }

    if (savedPricingRates) {
      setPricingRates(JSON.parse(savedPricingRates))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('quotationInfo', JSON.stringify(quotationInfo))
    localStorage.setItem('quotationSections', JSON.stringify(sections))
    localStorage.setItem('pricingRates', JSON.stringify(pricingRates))
  }, [quotationInfo, sections, pricingRates])

  const handleQuotationInfoChange = (e) => {
    const { name, value } = e.target
    setQuotationInfo(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleUpdatePricingRate = (workType, newRate) => {
    setPricingRates(prev => ({
      ...prev,
      [workType]: newRate
    }))
  }

  const handleAddSection = () => {
    const newSection = {
      id: uuidv4(),
      name: Object.values(sectionOptions)[0][0],
      items: []
    }
    setSections(prev => [...prev, newSection])
  }

  const handleUpdateSection = (sectionId, updatedSection) => {
    setSections(prev =>
      prev.map(section =>
        section.id === sectionId ? updatedSection : section
      )
    )
  }

  const handleRemoveSection = (sectionId) => {
    setSections(prev => prev.filter(section => section.id !== sectionId))
  }

  const calculateGrandTotal = () => {
    return sections.reduce((total, section) => {
      const sectionTotal = section.items.reduce((itemTotal, item) => {
        const length = parseFloat(item.dimensions.length) || 0
        const breadth = parseFloat(item.dimensions.breadth) || 0
        const price = parseFloat(item.unitPrice) || 0
        const itemPrice = length * breadth * price
        return itemTotal + (isNaN(itemPrice) ? 0 : itemPrice)
      }, 0)
      return total + sectionTotal
    }, 0)
  }

  const handleClearAll = () => {
    localStorage.removeItem('quotationInfo')
    localStorage.removeItem('quotationSections')
    localStorage.removeItem('pricingRates')
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header companyName={quotationInfo.companyName} />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="card mb-8">
              <QuotationForm
                quotationInfo={quotationInfo}
                onChange={handleQuotationInfoChange}
              />
            </div>

            <PricingConfig
              pricingRates={pricingRates}
              onUpdateRate={handleUpdatePricingRate}
            />

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

          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <TotalSummary grandTotal={calculateGrandTotal()} />

              <div className="card mt-4 mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Additional Note</label>
                <textarea
                  name="additionalNote"
                  value={quotationInfo.additionalNote}
                  onChange={handleQuotationInfoChange}
                  className="input-field w-full h-24 resize-none"
                  placeholder="Enter any additional notes for this quotation..."
                />
              </div>

              <PdfGenerator
                quotationInfo={quotationInfo}
                sections={sections}
                grandTotal={calculateGrandTotal()}
              />

              <button
                onClick={handleClearAll}
                className="btn-danger mt-5 w-full"
              >
                Clear All & Start Fresh
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
