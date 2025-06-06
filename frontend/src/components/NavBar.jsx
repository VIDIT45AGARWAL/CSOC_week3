import React, {useState} from 'react'
import { Link } from 'react-router-dom'

const NavBar = ({onSearch}) => {

  const [search, setSearch] =useState('')

  const handleSearchChange =(e)=>{
    const searchText=e.target.value
    setSearch(searchText)
    onSearch(searchText)
  }

  const handleSearchSubmit=(e)=>{
    e.preventDefault()
    onSearch(search)
  }
  
  return (
    <nav className=''>
        <div className='bg-gradient-to-r from-purple-400 to-purple-800 flex flex-row justify-around h-[100px] shadow-2xl p-8'>
            
            <Link to="/">
              <div className='text-xl sm:text-3xl font-bold cursor-pointer text-gray-900 select-none'>
                <i class='bx bxs-file-export'></i>
                SnippetHUB
                </div>
            </Link>
              <form onSubmit={handleSearchSubmit} className='flex'>
                <input value={search} onChange={handleSearchChange} className='bg-white hidden lg:block rounded-l-2xl h-9 p-3 w-110' type="search" placeholder='Search Snippet Title' aria-label='Search' />
                <button type='submit' className='cursor-pointer hidden lg:block bg-green-500 h-9 hover:bg-green-400 w-20 rounded-r-2xl '>Search</button>
              </form>                
            <Link to='/add-snippet'>
              <div className='bg-white h-9 sm:h-11 rounded-lg w-30 sm:w-40 text-blue-500 font-bold text-center text-sm sm:text-lg pt-2 hover:bg-blue-500 hover:text-white transition-colors cursor-pointer select-none'>
                  <i className='bx bxs-folder-plus mr-2' ></i>
                  Add Snippet
              </div>
            </Link>                        
        </div>
        <div className='bg-gradient-to-r from-purple-400 to-purple-800 flex flex-row lg:hidden justify-center p-3'>
          <form onSubmit={handleSearchSubmit} className='flex'>
                <input value={search} onChange={handleSearchChange} className='bg-white rounded-l-2xl h-7 w-50 sm:h-9 p-3 sm:w-110' type="search" placeholder='Search Snippet Title' aria-label='Search' />
                <button type='submit' className='cursor-pointer bg-green-500 h-7 sm:h-9 hover:bg-green-400 w-15 sm:w-20 rounded-r-2xl '>Search</button>
          </form>
        </div>
    </nav>
  )
}

export default NavBar