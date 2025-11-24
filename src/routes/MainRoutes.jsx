import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from '../pages/Dashboard'
import MyPets  from '../pages/MyPets'
import Plans from '../pages/Plans'
import Export from '../pages/Export'
import Login from '../pages/Auth/Login'
import Register from '../pages/Auth/Register'
import { SubscriptionProvider } from '../context/SubscriptionContext'

const MainRoutes = () => {
  return (
    <SubscriptionProvider>
      <BrowserRouter>
        <Routes>
            <Route path='/dashboard' element={<Dashboard/>}/>
            <Route path='/mypets' element={<MyPets/>}/>
            <Route path='/plans' element={<Plans/>}/>
            <Route path='/export' element={<Export/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/register' element={<Register/>}/>
            <Route path='*' element={<Navigate to="/login"/>}/>

        </Routes>
      </BrowserRouter>
    </SubscriptionProvider>
  )
}

export default MainRoutes