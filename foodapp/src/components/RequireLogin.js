import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { selectCurrentUser } from '../services/loginSlice'

const RequireLogin = () => {

  const user = useSelector(selectCurrentUser)





  return user &&
        <Outlet />
}

export default RequireLogin