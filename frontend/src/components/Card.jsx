import React from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const Card = ({snippet, onUpdate}) => {

  const API_URL = 'http://localhost:8000/api'

  const handleStarToggle= async (e)=>{
    e.preventDefault()
    try {
      const response = await axios.patch(
        `${API_URL}/snippets/${snippet.id}/`,
        { is_starred: !snippet.is_starred },
        { headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` } }
      )
      if (onUpdate) {
        onUpdate(response.data)
      }
      window.dispatchEvent(new CustomEvent('snippetStarToggled', { detail: response.data }))
    } catch (error) {
      console.error('Error updating star status:', error)
    }
  }

  const renderIcon = () =>{
    if(snippet.category==='CODE'){
      return(<i className='bx bx-code mr-1 text-blue-600'></i>)
    }
    else if(snippet.category==='LINKS'){
      return(<i className='bx bx-link mr-1 text-violet-600'></i>)
    }
    else if(snippet.category==='NOTES'){
      return(<i className='bx bxs-edit-alt mr-1 text-green-600'></i>)
    }
    else if(snippet.category==='FILES'){
      return(<i className='bx bx-file-blank text-pink-600' ></i>)
    }
  }

  const truncateTitle=(title)=>{
    if(title.length >16){
      return title.slice(0,16) + '...'
    }
    else{
      return title
    }
  }

  const chooseColor=()=>{
    if(snippet.category==='NOTES'){
      return `green-600`
    }
    else if(snippet.category==='LINKS'){
      return `violet-600`
    }
    else if(snippet.category==='CODE'){
      return `blue-600`
    }
    else if(snippet.category==='FILES'){
      return `pink-600`
    }
  }

  return (
    
      <div className='inline-block bg-white w-65 h-45 rounded-lg p-3 shadow-lg relative'>
      <h1 className={`flex flex-row font-bold text-${chooseColor()} text-xl`}>
        <Link to='/snippet-view' state={{snippet}}>
        <div className='w-53'>
          <i className ='bx bx-note mr-1'></i>
          {truncateTitle(snippet.title)}
        </div>
        </Link>
        <div>
          <i className={snippet.is_starred? 'bx bxs-star': 'bx bx-star'} style={{color:'#f3cd08', cursor: 'pointer'}} onClick={handleStarToggle} ></i>
        </div>
           
      </h1>
      <br />
      <br />
      <h2 className={`text-${chooseColor()} absolute bottom-3 left-3`}>
        {renderIcon()}
        {snippet.category.charAt(0) + snippet.category.slice(1).toLowerCase()}
      </h2>
    </div> 
  )
}

export default Card