import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from '../pages/Login'
import Home from '../pages/Home'
import State from '../pages/State'
import City from '../pages/City'
import Warehouse from '../pages/Warehouse'
import ResetPassword from "../pages/ResetPassword"

function Allroutes() {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/Home' element={<Home />} />
      <Route path='/State' element={<State />} />
      <Route path='/City' element={<City />} />
      <Route path='/Warehouse' element={<Warehouse />} />
      <Route path='/ResetPassword' element={< ResetPassword />} />
      <Route path='*' element={<h1>No routes</h1>} />
    </Routes>
  )
}

export default Allroutes
