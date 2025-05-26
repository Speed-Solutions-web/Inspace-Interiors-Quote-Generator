import Section from './Section'
import { FaPlus } from 'react-icons/fa'

const Sections = ({
  sections,
  sectionOptions,
  sectionItems,
  pricingRates,
  onAddSection,
  onUpdateSection,
  onRemoveSection
}) => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Sections</h2>
        <button
          onClick={onAddSection}
          className="btn-primary flex items-center"
          aria-label="Add new section"
        >
          <FaPlus className="mr-2" /> Add Section
        </button>
      </div>

      {sections.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 mb-4">No sections added yet</p>
          <button
            onClick={onAddSection}
            className="btn-primary inline-flex items-center"
          >
            <FaPlus className="mr-2" /> Add First Section
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {sections.map(section => (
            <Section
              key={section.id}
              section={section}
              sectionOptions={sectionOptions}
              sectionItems={sectionItems}
              pricingRates={pricingRates}
              onUpdate={(updatedSection) => onUpdateSection(section.id, updatedSection)}
              onRemove={() => onRemoveSection(section.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Sections
