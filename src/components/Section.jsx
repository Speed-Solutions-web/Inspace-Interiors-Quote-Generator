import { useState } from 'react'
import { FaChevronDown, FaChevronUp, FaPlus, FaTrash } from 'react-icons/fa'
import Item from './Item'
import { v4 as uuidv4 } from 'uuid'

const Section = ({ section, sectionOptions, sectionItems, pricingRates, onUpdate, onRemove }) => {
  const [isExpanded, setIsExpanded] = useState(true)

  const sectionName = section?.name || 'Untitled Section'
  const items = section?.items || []

  const handleSectionChange = (e) => {
    if (!section) return
    onUpdate({
      ...section,
      name: e.target.value
    })
  }

  const handleAddItem = () => {
    if (!section) return
    const newItem = {
      id: uuidv4(),
      name: sectionItems[sectionName] ? sectionItems[sectionName][0] : 'New Item',
      natureOfWork: '',
      dimensions: { length: 0, breadth: 0 },
      unitPrice: 0
    }
    onUpdate({
      ...section,
      items: [...items, newItem]
    })
  }

  const handleUpdateItem = (itemId, updatedItem) => {
    if (!section || !Array.isArray(items)) return
    onUpdate({
      ...section,
      items: items.map(item => item.id === itemId ? updatedItem : item)
    })
  }

  const handleRemoveItem = (itemId) => {
    if (!section || !Array.isArray(items)) return
    onUpdate({
      ...section,
      items: items.filter(item => item.id !== itemId)
    })
  }

  const calculateSectionTotal = () => {
    return items.reduce((total, item) => {
      const length = parseFloat(item.dimensions?.length) || 0
      const breadth = parseFloat(item.dimensions?.breadth) || 0
      const price = parseFloat(item.unitPrice) || 0
      return total + (length * breadth * price)
    }, 0)
  }

  return (
    <div className="card animate-fade-in overflow-hidden">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mr-3 text-gray-500 hover:text-primary-700 transition-colors duration-200"
            aria-label={isExpanded ? "Collapse section" : "Expand section"}
          >
            {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
          </button>

          <select
            value={sectionName}
            onChange={handleSectionChange}
            className="input-field py-1"
          >
            {Object.entries(sectionOptions || {}).map(([group, options]) => (
              <optgroup key={group} label={group}>
                {options.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onRemove}
            className="p-2 text-gray-500 hover:text-red-600 transition-colors duration-200"
            aria-label="Remove section"
          >
            <FaTrash />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-6 animate-slide-in">
          {items.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type of Work</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Length × Breadth</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Area</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="relative px-4 py-3"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {items.map(item => (
                    <Item
                      key={item.id}
                      item={item}
                      section={section}
                      sectionItems={sectionItems}
                      pricingRates={pricingRates}
                      onUpdate={(updatedItem) => handleUpdateItem(item.id, updatedItem)}
                      onRemove={() => handleRemoveItem(item.id)}
                    />
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="5" className="px-4 py-3 text-right font-medium text-gray-700">Section Total:</td>
                    <td className="px-4 py-3 text-left font-bold text-gray-900">₹{calculateSectionTotal().toFixed(2)}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No items in this section</p>
          )}

          <div className="pt-4">
            <button
              onClick={handleAddItem}
              className="btn-outline flex items-center"
              aria-label="Add new item"
            >
              <FaPlus className="mr-2" /> Add Item
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Section