import React from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const List = ({snippet, onUpdate}) => {

  const API_URL = 'http://localhost:8000/api'

    const handleStarToggle= async (e)=>{
    e.preventDefault()
    try{
      const response= await axios.patch(`${API_URL}/snippets/${snippet.id}/`,{
        is_starred: !snippet.is_starred
      })
      if(onUpdate){
        onUpdate(response.data)
      }
      window.dispatchEvent(
        new CustomEvent('snippetStarToggled', { detail: response.data })
      );
    } catch(error){
      console.error('Error updating star status:', error)
    }
  }

  const renderIcon = () =>{
    if(snippet.content_type==='CODE'){
      return(<i className='bx bx-code mr-1 text-blue-600'></i>)
    }
    else if(snippet.content_type==='LINKS'){
      return(<i className='bx bx-link mr-1 text-violet-600'></i>)
    }
    else if(snippet.content_type==='NOTES'){
      return(<i className='bx bxs-edit-alt mr-1 text-green-600'></i>)
    }
    else if(snippet.content_type==='FILES'){
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
    if(snippet.content_type==='NOTES'){
      return `green-600`
    }
    else if(snippet.content_type==='LINKS'){
      return `violet-600`
    }
    else if(snippet.content_type==='CODE'){
      return `blue-600`
    }
    else if(snippet.content_type==='FILES'){
      return `pink-600`
    }
  }


  return (
    <>
        <div className='bg-white flex h-15 items-center p-4 rounded-2xl shadow-lg relative'>
            <Link to='/snippet-view' state={{snippet}}>
                <div className={`text-${chooseColor()} text-xl font-bold`}>
                    <i className ='bx bx-note mr-1'></i>
                    {truncateTitle(snippet.title)}
                </div>
            </Link>
            <div className={`text-${chooseColor()} hidden lg:block absolute right-30`}>
                {renderIcon()}
                {snippet.content_type.charAt(0) + snippet.content_type.slice(1).toLowerCase()}
            </div>
            <div className='absolute right-6 text-2xl'>
                <i className={snippet.is_starred? 'bx bxs-star': 'bx bx-star'} style={{color:'#f3cd08', cursor: 'pointer'}} onClick={handleStarToggle} ></i>
            </div>
        </div>
    </>
  )
}

export default List