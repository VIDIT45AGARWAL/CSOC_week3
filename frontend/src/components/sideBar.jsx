import React, { useEffect, useState } from 'react'
import Card from './Card'
import axios from 'axios'
import { useAuth } from './AuthContext'

const sideBar = () => {

  const [starredSnippets, setStarredSnippets] =useState([])
  const {user}= useAuth()
  const API_URL= import.meta.env.VITE_API_URL

  const fetchStarredSnippets = async ()=>{
    if(!user) return
    try{
      const token = localStorage.getItem('access_token');
      if (!token) return; 
      const response = await axios.get(`${API_URL}/snippets/`, {
        params: { is_starred: true },
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      })
      const filteredSnippets = response.data.filter(snippet => snippet.is_starred === true)
      setStarredSnippets(filteredSnippets)
    } catch(error){
      console.error('loading error: ', error)
    }
  }

  useEffect(()=>{
    fetchStarredSnippets()

    const handleStarToggle = (event) => {
      const updatedSnippet = event.detail
      if (updatedSnippet.is_starred) {
        setStarredSnippets(prev =>
          prev.some(s => s.id === updatedSnippet.id)
            ? prev.map(s => (s.id === updatedSnippet.id ? updatedSnippet : s))
            : [...prev, updatedSnippet]
        )
      } else {
        setStarredSnippets(prev => prev.filter(s => s.id !== updatedSnippet.id))
      }
    }

    window.addEventListener('snippetStarToggled', handleStarToggle);
    return () => window.removeEventListener('snippetStarToggled', handleStarToggle)
  },[user])

  const handleSnippetUpdate = (updatedSnippet) => {
    if (updatedSnippet.is_starred) {
      setStarredSnippets(prev =>
        prev.some(s => s.id === updatedSnippet.id)
          ? prev.map(s => (s.id === updatedSnippet.id ? updatedSnippet : s))
          : [...prev, updatedSnippet]
      )
    } else {
      setStarredSnippets(prev => prev.filter(s => s.id !== updatedSnippet.id))
    }
  }

  return (
    <div className='sm:w-[330px] bg-purple-100 shadow-2xl overflow-y-auto' style={{ height: 'calc(100vh - 100px)'}}>
        <h1 className='font-bold text-xl text-center pt-4'>Starred Snippets</h1>
        <div className='flex flex-col space-y-5 items-center mt-4 pb-4'>
            {starredSnippets.map((snippet)=> (
              <Card snippet={snippet} key={snippet.id} onUpdate={handleSnippetUpdate}/>
            ))}        
        </div>
    </div>
  )
}

export default sideBar