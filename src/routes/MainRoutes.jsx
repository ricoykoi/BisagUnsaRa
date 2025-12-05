import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from '../pages/Dashboard'
import MyPets from '../pages/MyPets'
import Plans from '../pages/Plans'
import Export from '../pages/Export'
import Login from '../pages/Auth/Login'
import Register from '../pages/Auth/Register'
import { SubscriptionProvider } from '../context/SubscriptionContext'
import MainLayout from '../layout/MainLayout'

const MainRoutes = () => {
  return (
    <SubscriptionProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/dashboard' element={<MainLayout><Dashboard /></MainLayout>} />
          <Route path='/mypets' element={<MainLayout><MyPets /></MainLayout>} />
          <Route path='/plans' element={<MainLayout><Plans /></MainLayout>} />
          <Route path='/export' element={<MainLayout><Export /></MainLayout>} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='*' element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </SubscriptionProvider>
  )
}

export default MainRoutes