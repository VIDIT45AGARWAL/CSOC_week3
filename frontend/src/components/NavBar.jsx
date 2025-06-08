import React, {useState, useContext} from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { useGoogleLogin } from '@react-oauth/google'

const NavBar = ({onSearch}) => {

  const { user, logout } = useAuth()

  const [search, setSearch] =useState('')
  const navigate=useNavigate() 

  const handleSearchChange =(e)=>{
    const searchText=e.target.value
    setSearch(searchText)
    onSearch(searchText)
  }

  const handleSearchSubmit=(e)=>{
    e.preventDefault()
    onSearch(search)
  }

  const handleLogout = () =>{
    logout()
    navigate('/')
  }
  
  return (
    <nav className=''>
        <div className='bg-gradient-to-r from-purple-400 to-purple-800 flex flex-row justify-around h-[100px] shadow-2xl p-8'>
            
            <Link to="/home">
              <div className='text-xl sm:text-3xl font-bold cursor-pointer text-gray-900 select-none'>
                <i class='bx bxs-file-export'></i>
                SnippetHUB
                </div>
            </Link>
              <form onSubmit={handleSearchSubmit} className='flex'>
                <input value={search} onChange={handleSearchChange} className='bg-white hidden lg:block rounded-l-2xl h-9 p-3 w-90' type="search" placeholder='Search Snippet Title' aria-label='Search' />
                <button type='submit' className='cursor-pointer hidden lg:block bg-green-500 h-9 hover:bg-green-400 w-20 rounded-r-2xl '>Search</button>
              </form>                
            <Link to='/add-snippet'>
              <div className='bg-white h-9 sm:h-11 rounded-lg w-30 sm:w-40 text-blue-500 font-bold text-center text-sm sm:text-lg pt-2 hover:bg-blue-500 hover:text-white transition-colors cursor-pointer select-none'>
                  <i className='bx bxs-folder-plus mr-2' ></i>
                  Add Snippet
              </div>
            </Link>
            {user && (
              <button
                onClick={handleLogout}
                className='hidden lg:block bg-white h-9 sm:h-11 rounded-lg w-20 sm:w-25 text-blue-500 font-bold text-center text-sm sm:text-lg pt-2 hover:bg-blue-500 hover:text-white transition-colors cursor-pointer select-none pb-1.5'
              >
                <i class='bx bx-log-out mr-2'></i>
                Logout
              </button>
            )}                      
        </div>
        <div className='bg-gradient-to-r from-purple-400 to-purple-800 flex flex-row lg:hidden justify-evenly p-3'>
          <form onSubmit={handleSearchSubmit} className='flex'>
                <input value={search} onChange={handleSearchChange} className='bg-white rounded-l-2xl h-7 w-30 sm:h-9 p-3 sm:w-90' type="search" placeholder='Search Snippet Title' aria-label='Search' />
                <button type='submit' className='cursor-pointer bg-green-500 h-7 sm:h-9 hover:bg-green-400 w-15 sm:w-20 rounded-r-2xl '>Search</button>
          </form>
          {user && (
              <button
                onClick={handleLogout}
                className='lg:hidden bg-white h-9 sm:h-11 rounded-lg w-20 sm:w-25 text-blue-500 font-bold text-center text-sm sm:text-lg pt-2 hover:bg-blue-500 hover:text-white transition-colors cursor-pointer select-none pb-1.5'
              >
                <i class='bx bx-log-out mr-2'></i>
                Logout
              </button>
            )}
        </div>
    </nav>
  )
}

export default NavBar