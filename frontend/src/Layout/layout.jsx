import React from 'react'
import NavBar from '../components/NavBar'
import { Outlet } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';

const layout = () => {
  return (
    <>
    <ToastContainer/>
    <Outlet/>
    </>
  )
}

export default layout
