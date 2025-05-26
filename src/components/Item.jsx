import { useState } from 'react'
import { FaEdit, FaTrash } from 'react-icons/fa'

const Item = ({ item, section, sectionItems, pricingRates, onUpdate, onRemove }) => {
  const [isEditing, setIsEditing] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === 'length' || name === 'breadth') {
      onUpdate({
        ...item,
        dimensions: {
          ...item.dimensions,
          [name]: value
        }
      })
    } else if (name === 'natureOfWork') {
      onUpdate({
        ...item,
        natureOfWork: value,
        unitPrice: pricingRates[value] || 0
      })
    } else {
      onUpdate({
        ...item,
        [name]: value
      })
    }
  }

  const calculateArea = () => {
    const length = parseFloat(item.dimensions.length) || 0
    const breadth = parseFloat(item.dimensions.breadth) || 0
    return length * breadth
  }

  const calculateTotal = () => {
    const area = calculateArea()
    const rate = parseFloat(item.unitPrice) || 0
    return area * rate
  }

  return (
    <tr className="hover:bg-gray-50 transition-colors duration-150">
      <td className="px-4 py-3 whitespace-nowrap">
        {isEditing ? (
          sectionItems[section.name] ? (
            <select
              name="name"
              value={item.name}
              onChange={handleChange}
              className="input-field py-1 w-64"
              autoFocus
            >
              {sectionItems[section.name].map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              name="name"
              value={item.name}
              onChange={handleChange}
              className="input-field py-1 w-64"
              autoFocus
            />
          )
        ) : (
          <div className="text-sm font-medium text-gray-900">{item.name}</div>
        )}
      </td>

      <td className="px-4 py-3 whitespace-nowrap">
        {isEditing ? (
          <select
            name="natureOfWork"
            value={item.natureOfWork}
            onChange={handleChange}
            className="input-field py-1 w-64"
          >
            <option value="">Select work type</option>
            {Object.keys(pricingRates).map(rate => (
              <option key={rate} value={rate}>{rate}</option>
            ))}
          </select>
        ) : (
          <div className="text-sm text-gray-600">{item.natureOfWork || '-'}</div>
        )}
      </td>

      <td className="px-4 py-3 whitespace-nowrap">
        {isEditing ? (
          <div className="flex items-center space-x-2">
            <input
              type="number"
              name="length"
              value={item.dimensions.length}
              onChange={handleChange}
              className="input-field py-1 w-20"
              placeholder="L"
              min="0"
              step="0.01"
            />
            <span>×</span>
            <input
              type="number"
              name="breadth"
              value={item.dimensions.breadth}
              onChange={handleChange}
              className="input-field py-1 w-20"
              placeholder="B"
              min="0"
              step="0.01"
            />
          </div>
        ) : (
          <div className="text-sm text-gray-600">
            {item.dimensions.length} × {item.dimensions.breadth}
          </div>
        )}
      </td>

      <td className="px-4 py-3 whitespace-nowrap">
        <div className="text-sm text-gray-600">{calculateArea().toFixed(2)} sq.ft</div>
      </td>

      <td className="px-4 py-3 whitespace-nowrap">
        <div className="text-sm text-gray-600">₹{parseFloat(item.unitPrice).toFixed(2)}/sq.ft</div>
      </td>

      <td className="px-4 py-3 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">₹{calculateTotal().toFixed(2)}</div>
      </td>

      <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center space-x-2 justify-end">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-primary-700 hover:text-primary-900"
            aria-label={isEditing ? "Save item" : "Edit item"}
          >
            <FaEdit />
          </button>
          <button
            onClick={onRemove}
            className="text-red-600 hover:text-red-800"
            aria-label="Remove item"
          >
            <FaTrash />
          </button>
        </div>
      </td>
    </tr>
  )
}

export default Item
