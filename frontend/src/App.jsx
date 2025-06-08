import React from 'react'
import NavBar from './components/NavBar'
import Filter from './components/Filter'
import Card from './components/Card'
import NewSnippet from './pages/NewSnippet'
import SnippetView from './pages/SnippetView'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Layout from  './Layout/layout'
import SnippetEdit from './pages/SnippetEdit'
import { AuthProvider } from './components/AuthContext'
import { GoogleOAuthProvider } from '@react-oauth/google'
import Login from './pages/login'

const App = () => {

  const router= createBrowserRouter(createRoutesFromElements(
  <>
    <Route path='/' element={<Login/>}/>
    <Route element={<Layout/>}>
        <Route path='/home' element={<HomePage/>}/>
        <Route path='/add-snippet' element={<NewSnippet/>}/>
        <Route path='/snippet-view' element={<SnippetView/>}/>
        <Route path='/snippet-edit' element={<SnippetEdit/>}/>
    </Route>
  </>
  ))


  return (
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <AuthProvider>
      <RouterProvider router={router}/>
    </AuthProvider>
  </GoogleOAuthProvider>
  )
}

export default App