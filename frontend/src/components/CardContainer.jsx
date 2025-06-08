import React, { useEffect, useState } from 'react'
import Card from './Card'
import { Link } from 'react-router-dom'
import Filter from './Filter'
import NavBar from './NavBar'
import SideBar from '../components/sideBar'
import List from './List'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useAuth } from './AuthContext'
  
const CardContainer = () => {

  const {user}= useAuth()

  const [snippets, setSnippets] = useState([])
  const [filterCategory, setFilterCategory] =useState('All')
  const [search, setSearch]=useState('')

  const [view, setView]=useState('grid')
  const [isLoading, setIsLoading] =useState(false)  

  const API_URL= import.meta.env.VITE_API_URL

  const fetchSnippets = async ()=>{
    if(!user) return
    setIsLoading(true)
    try {
      const response = await axios.get(`${API_URL}/snippets/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
      })
      setSnippets(response.data)
    } catch (error) {
      console.error('Error fetching snippets: ', error)
      toast.error('Cant Load Snippets', { theme: 'colored' })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(()=>{
    fetchSnippets()
  },[user])

  useEffect(() => {
    localStorage.setItem('snippetView', view)
  }, [view])

  useEffect(()=>{
    const handleStarToggle = (event) => {
      const updatedSnippet = event.detail
      setSnippets((prev) =>
        prev.map((s) => (s.id === updatedSnippet.id ? updatedSnippet : s))
      )
    }

    window.addEventListener('snippetStarToggled', handleStarToggle)
    return () => window.removeEventListener('snippetStarToggled', handleStarToggle)
  },[])

  const toggleView = ()=>{
    if(view==='grid'){
      setView('list')
    }
    else{
      setView('grid')
    }
  }

  const handleSnippetUpdate = (updatedSnippet) => {
    setSnippets(snippets.map(s => s.id === updatedSnippet.id ? updatedSnippet : s))
  }

  let filteredSnippets
  if(search){
    filteredSnippets=snippets.filter((snippet)=> snippet.title.toLowerCase().includes(search.toLowerCase()))
  } else{
    if(filterCategory==='All'){
      filteredSnippets = snippets
    }
    else{
      filteredSnippets=snippets.filter((snippet)=> snippet.category === filterCategory)
    }
  }

  const renderSnippets = () =>{
      if(view==='grid'){
        return(
          <>
            <div className='flex flex-wrap gap-4'>
              {filteredSnippets.map((snippet)=>(
                <Card key={snippet.id} snippet={snippet} onUpdate={handleSnippetUpdate}/>
              ))}              
            </div>
          </>
        )
      }
      else{
        return(
          <>
            <div className='flex flex-col space-y-5'>
              {filteredSnippets.map((snippet)=>(
                <List key={snippet.id} snippet={snippet} onUpdate={handleSnippetUpdate}/>
              ))}  
            </div>
          </>
        )
      }
  }

  return (
    <>
      <NavBar onSearch={setSearch}/>
      <div className='flex flex-col sm:flex-row'>
        <SideBar/>
        <div className='bg-gray-300 flex flex-col sm:w-[calc(100vw-330px)]' style={{height: 'calc(100vh - 100px)'}}>
            <Filter onFilterChange={setFilterCategory} selectedCategory={filterCategory} view={view} toggleView={toggleView}/>
            <div className='bg-gray-300 p-8 overflow-y-auto' style={{height:'calc(100vh-100px)', width:'calc(100vw-330px)'}}>      
                {renderSnippets()}
            </div>
        </div>
      </div>
    </>       
  )
}

export default CardContainer