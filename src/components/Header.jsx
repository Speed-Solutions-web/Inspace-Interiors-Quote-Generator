import { useState, useEffect } from 'react'

const Header = ({ companyName }) => {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header 
      className={`sticky top-0 z-10 transition-all duration-300 ${
        scrolled 
          ? 'bg-primary-800 shadow-md py-2' 
          : 'bg-primary-800 py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="text-white font-bold text-xl md:text-2xl transition-all duration-300">
            {companyName || 'Interior Design Quotations'}
          </div>
        </div>
        
        <div className="text-white text-sm md:text-base">
          Quotation Generator
        </div>
      </div>
    </header>
  )
}

export default Header