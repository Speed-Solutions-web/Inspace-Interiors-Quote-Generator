// ✅ FINAL UPDATED PdfGenerator.jsx (with formatted bullet list)
import { useRef } from 'react'
import { FaFilePdf, FaDownload } from 'react-icons/fa'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { useReactToPrint } from 'react-to-print'
import PrintTemplate from './PrintTemplate'
import { useEffect, useState } from 'react'

const PdfGenerator = ({ quotationInfo, sections, grandTotal }) => {
  const printRef = useRef()

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  })

  const generatePDF = () => {
    const doc = new jsPDF()

    // Company Logo
    doc.addImage(quotationInfo.companyLogo, 'JPEG', 15, 10, 40, 25)

    // Company Info
    doc.setFontSize(18)
    doc.setTextColor(140, 28, 42)
    doc.text(quotationInfo.companyName, 105, 20, { align: 'center' })

    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text(quotationInfo.companyAddress, 105, 27, { align: 'center' })
    doc.text(`${quotationInfo.companyPhone} | ${quotationInfo.companyEmail}`, 105, 32, { align: 'center' })

    // Quotation Header
    doc.setFontSize(14)
    doc.setTextColor(0, 0, 0)
    doc.text('QUOTATION', 105, 42, { align: 'center' })

    // Quotation Details
    doc.setFontSize(10)
    doc.text(`Quotation #: ${quotationInfo.quotationNumber}`, 14, 55)
    doc.text(`Date: ${quotationInfo.date}`, 14, 60)
    doc.text(`Client: ${quotationInfo.clientName}`, 14, 65)
    doc.text(`Phone: ${quotationInfo.clientPhone}`, 14, 70)
    doc.text(`Project Location: ${quotationInfo.projectLocation}`, 14, 75)

    let yPos = 85

    sections.forEach(section => {
      doc.setFontSize(12)
      doc.setTextColor(140, 28, 42)
      doc.text(section.name, 14, yPos)
      yPos += 8

      if (section.items.length > 0) {
        const tableColumn = ["Item", "Nature of Work", "Length", "Breadth", "Area", "Rate", "Total"]
        const tableRows = []

        section.items.forEach(item => {
          const length = parseFloat(item.dimensions.length) || 0
          const breadth = parseFloat(item.dimensions.breadth) || 0
          const area = length * breadth
          const rate = parseFloat(item.unitPrice) || 0
          const total = area * rate

          tableRows.push([
            item.name,
            item.natureOfWork || '-',
            length,
            breadth,
            area.toFixed(2),
            `₹${rate.toFixed(2)}`,
            `₹${total.toFixed(2)}`
          ])
        })

        const sectionTotal = section.items.reduce((sum, item) => {
          const l = parseFloat(item.dimensions.length) || 0
          const b = parseFloat(item.dimensions.breadth) || 0
          const r = parseFloat(item.unitPrice) || 0
          return sum + (l * b * r)
        }, 0)

        tableRows.push(["", "", "", "", "", "Section Total:", `₹${sectionTotal.toFixed(2)}`])

        doc.autoTable({
          head: [tableColumn],
          body: tableRows,
          startY: yPos,
          styles: { fontSize: 8 },
          headStyles: { fillColor: [140, 28, 42] },
          theme: 'grid'
        })

        yPos = doc.lastAutoTable.finalY + 15
      } else {
        yPos += 10
      }
    })

    // Grand Total
    doc.setFontSize(12)
    doc.setTextColor(0, 0, 0)
    doc.text("Grand Total:", 140, yPos)
    doc.setFontSize(14)
    doc.setTextColor(140, 28, 42)
    doc.text(`₹${grandTotal.toFixed(2)}`, 200, yPos, { align: 'right' })

    // Terms & Conditions
    yPos += 15
    doc.setFontSize(10)
    doc.setTextColor(0, 0, 0)
    doc.text("Terms & Conditions:", 14, yPos)
    yPos += 6
    doc.setFontSize(9)

    const terms = [
      "50% advance payment required to start the work.",
      "Balance payment to be made before installation.",
      "Prices are valid for 30 days from the date of quotation.",
      "Delivery time: 4–6 weeks from the date of order confirmation."
    ]

    terms.forEach((term, index) => {
      doc.text(`${index + 1}. ${term}`, 16, yPos)
      yPos += 5
    })

    // Notes
    if (quotationInfo.additionalNote) {
      yPos += 10;
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text("Additional Note:", 14, yPos);
      yPos += 5;
      const wrappedNote = doc.splitTextToSize(quotationInfo.additionalNote, 180);
      doc.text(wrappedNote, 16, yPos);
      yPos += wrappedNote.length * 5;
    }

    doc.save(`Quotation_${quotationInfo.quotationNumber}.pdf`)
  }

  return (
    <div className="space-y-4">
      <div className="card">
        <label className="block text-sm font-medium text-gray-700 mb-2">Watch Preview and Download</label>
        <div className="flex flex-col items-center">
          <button
            onClick={generatePDF}
            className="btn-primary w-full flex justify-center items-center mb-3 hidden"
            disabled={sections.length === 0}
          >
            <FaFilePdf className="mr-2" /> Download PDF
          </button>

          <button
            onClick={handlePrint}
            className="btn-secondary w-full flex justify-center items-center"
            disabled={sections.length === 0}
          >
            <FaDownload className="mr-2" /> Print Preview
          </button>
        </div>
      </div>

      <div className="hidden">
        <PrintTemplate
          ref={printRef}
          quotationInfo={quotationInfo}
          sections={sections}
          grandTotal={grandTotal}
        />
      </div>
    </div>
  )
}

export default PdfGenerator
