import React, { useEffect, useState } from 'react'
import Card from './Card'
import { Link } from 'react-router-dom'
import Filter from './Filter'
import NavBar from './NavBar'
import SideBar from '../components/sideBar'
import List from './List'
import axios from 'axios'
import { toast } from 'react-toastify'
  
const CardContainer = () => {

  const [snippets, setSnippets] = useState([])
  const [categories, setCategories] =useState([])
  const [filterCategory, setFilterCategory] =useState('All')
  const [search, setSearch]=useState('')

  const [view, setView]=useState('grid')
  const [isLoading, setIsLoading] =useState(false)  

  const API_URL= 'http://localhost:8000/api'

  const fetchSnippets = async ()=>{
    setIsLoading(true)
    try{
      const response = await axios.get(`${API_URL}/snippets/`)
      setSnippets(response.data)
    } catch(error){
      console.error('Error fetching snippets: ', error)
      toast.error('Cant Load Snippets' , {theme: 'colored'})
    } finally{
      setIsLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/categories/`)
      setCategories(response.data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  useEffect(()=>{
    fetchSnippets()
    fetchCategories()
  },[])

  useEffect(() => {
    localStorage.setItem('snippetView', view)
  }, [view])

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
      filteredSnippets=snippets.filter((snippet)=> snippet.content_type === filterCategory)
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
            <Filter onFilterChange={setFilterCategory} selectedCategory={filterCategory} view={view} toggleView={toggleView} categories={['All',...categories.map(cat=> cat.content_type)]}/>
            <div className='bg-gray-300 p-8 overflow-y-auto' style={{height:'calc(100vh-100px)', width:'calc(100vw-330px)'}}>      
                {renderSnippets()}
            </div>
        </div>
      </div>
    </>       
  )
}

export default CardContainer