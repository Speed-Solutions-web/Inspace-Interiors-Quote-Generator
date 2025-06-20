import QuoteDetails from './QuoteDetails'
import { useParams, useLocation, useNavigate } from 'react-router-dom'

const QuoteDetailsWrapper = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { id } = useParams()

  return (
    <QuoteDetails location={location} navigate={navigate} clientId={id} />
  )
}

export default QuoteDetailsWrapper
