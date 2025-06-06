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

const App = () => {

  const router= createBrowserRouter(createRoutesFromElements(
    <Route path='/' element={<Layout/>}>
      <Route index element={<HomePage/>} />
      <Route path='/add-snippet' element={<NewSnippet/>} />
      <Route path='/snippet-view' element={<SnippetView/>}/>
      <Route path='/snippet-edit' element={<SnippetEdit/>}/>
    </Route>
  ))


  return (
      <RouterProvider router={router}/>
  )
}

export default App