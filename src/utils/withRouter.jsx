// src/utils/withRouter.js
import { useNavigate, useLocation, useParams } from 'react-router-dom'

export const withRouter = (Component) => {
  return function Wrapper(props) {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();

    return (
      <Component
        {...props}
        navigate={navigate}
        location={location}
        params={params}
      />
    );
  };
};
