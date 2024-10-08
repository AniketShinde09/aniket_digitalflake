import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
const PrivateRoute = ({ children }) => {
    const location = useLocation()
    const auth = useSelector((store) => store.token)
    return auth ? children : <Navigate state={location.pathname} to={"/"} />
}
export default PrivateRoute